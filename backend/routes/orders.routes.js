import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { addOrder, getAllOrders } from '../controllers/ordersController.js';

const router = express.Router();

// GET /api/v1/orders - get all orders (any authenticated role)
router.get('/', protect, getAllOrders);

// POST /api/v1/orders - create a new order (waiters only)
router.post('/', protect, authorize('waiter'), addOrder);

export default router;
