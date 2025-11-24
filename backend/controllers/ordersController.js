import Order from '../models/Order.js';

// Create a new order (only waiters should call this)
export const addOrder = async (req, res) => {
  try {
    const { client, items, notes } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Items are needed',
      });
    }

    // Ensure waiter is the authenticated user
    const waiter = req.user;
    const waiterId = waiter?._id;
    if (!waiterId) {
      return res.status(401).json({ status: 'error', message: 'Authenticated waiter required' });
    }

    // Build order payload - enforce waiterId server-side
    const orderPayload = {
      client,
      items,
      waiterId,
      sellerId: waiter.boss,
      status: 'preparing',
    };

    if (notes) orderPayload.notes = notes;

    const order = await Order.create(orderPayload);

    return res.status(201).json({ status: 'success', data: order });
  } catch (error) {
    console.error('Add order error:', error);
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Server error creating order' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const user = req.user;
    const query = {};

    if (user.roles.includes('admin')) {
      // Admin: orders for their own establishment
      query.sellerId = user._id;
    } else if (user.roles.includes('manager') || user.roles.includes('waiter')) {
      if (!user.boss) {
        return res.status(400).json({
          status: 'error',
          message: 'No boss assigned. Please contact administrator.',
        });
      }

      query.sellerId = user.boss;

      if (user.roles.includes('waiter')) {
        // Waiter: only their own orders
        query.waiterId = user._id;
      }
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to view orders',
      });
    }

    // Execute query once
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      data: {
        count: orders.length,
        orders,
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching orders',
    });
  }
};
