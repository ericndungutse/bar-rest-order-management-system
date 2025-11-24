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

export default { addOrder };
