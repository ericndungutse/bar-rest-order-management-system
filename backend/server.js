import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.warn('MongoDB connection failed, server will continue without database:', err.message);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bar & Restaurant Order Management System API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'not connected'
    }
  };
  
  const statusCode = dbStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API routes will be added here
// app.use('/api/orders', orderRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/tables', tableRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
