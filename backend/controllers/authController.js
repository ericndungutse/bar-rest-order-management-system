import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Login Successful',
      data: {
        access_token: token,
        user: {
          user_id: user._id,
          name: user.name,
          boss: user.boss || null,
          email: user.email,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login',
    });
  }
};
