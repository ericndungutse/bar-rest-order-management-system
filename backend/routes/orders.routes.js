import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { addOrder } from '../controllers/ordersController.js';

const router = express.Router();

// POST /api/v1/orders - create a new order (waiters only)
router.post('/', protect, authorize('waiter'), addOrder);

export default router;
