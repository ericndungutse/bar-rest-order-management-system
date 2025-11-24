import express from 'express';
import { getAllItems } from '../controllers/itemsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/items - Get all items based on user role
router.get('/', protect, authorize('admin', 'manager', 'waiter'), getAllItems);

export default router;
