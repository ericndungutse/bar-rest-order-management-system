import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder
} from '../controllers/orderController.js';

const router = express.Router();

// TODO: Add rate limiting middleware for production use
// Example: const rateLimit = require('express-rate-limit');
// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
// router.use(limiter);

// Order routes
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById);
  // .put(updateOrder)
  // .delete(deleteOrder)

export default router;
