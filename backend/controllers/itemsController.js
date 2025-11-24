import Item from '../models/Item.js';
import User from '../models/User.js';

// @desc    Get all items based on user role
// @route   GET /api/v1/items
// @access  Private (admin, manager, waiter)
export const getAllItems = async (req, res) => {
  try {
    const user = req.user;
    let items;

    if (user.roles.includes('admin')) {
      // Admin sees only their own items
      items = await Item.find({ owner: user._id }).populate('owner', 'name email roles').sort({ createdAt: -1 });
    } else {
      // Manager and waiter see items from their boss (admin)
      if (!user.boss) {
        return res.status(400).json({
          status: 'error',
          message: 'No boss assigned. Please contact administrator.',
        });
      }

      // Verify the boss exists and is an admin
      const boss = await User.findById(user.boss);
      if (!boss || !boss.roles.includes('admin')) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid boss assignment. Please contact administrator.',
        });
      }

      // Get items owned by the boss
      items = await Item.find({ owner: user.boss }).populate('owner', 'name email roles').sort({ createdAt: -1 });
    }

    res.status(200).json({
      status: 'success',
      data: {
        count: items.length,
        items,
      },
    });
  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching items',
    });
  }
};
