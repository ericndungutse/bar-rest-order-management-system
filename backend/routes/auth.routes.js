import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/v1/auth/login
// TODO: Add rate limiting to prevent brute-force attacks (e.g., using express-rate-limit)
router.post('/login', login);

export default router;
