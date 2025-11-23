import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@yopmain.com',
    password: 'Test@123',
    roles: ['admin'],
    phone: '1234567890',
  },
  {
    name: 'Manager User',
    email: 'manager@yopmain.com',
    password: 'Test@123',
    roles: ['manager'],
    phone: '1234567891',
  },
  {
    name: 'Waiter User',
    email: 'waiter@yopmain.com',
    password: 'Test@123',
    roles: ['waiter'],
    phone: '1234567892',
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users');

    // Insert seed users one by one to trigger pre-save middleware
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }
    console.log('Users seeded successfully');

    console.log('\nSeeded users (Development only - Do not use in production):');
    users.forEach((user) => {
      console.log(`- ${user.roles.join(', ')}: ${user.name} (${user.email}) - Password: Test@123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
