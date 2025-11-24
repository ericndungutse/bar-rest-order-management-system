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

    // Insert admin user first
    const adminUser = new User(users[0]);
    await adminUser.save();
    console.log('Admin user created');

    // Insert manager and waiter with boss reference to admin
    for (let i = 1; i < users.length; i++) {
      const userData = { ...users[i], boss: adminUser._id };
      const user = new User(userData);
      await user.save();
    }
    console.log('Manager and waiter users created with boss reference');

    console.log('\nSeeded users (Development only - Do not use in production):');
    console.log(`- Admin: ${users[0].name} (${users[0].email}) - Password: Test@123 - ID: ${adminUser._id}`);
    users.slice(1).forEach((user) => {
      console.log(`- ${user.roles.join(', ')}: ${user.name} (${user.email}) - Password: Test@123 - Boss: ${adminUser._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
