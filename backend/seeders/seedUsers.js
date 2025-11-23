import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const users = [
  {
    username: 'admin',
    fullname: 'Admin User',
    email: 'admin@yopmain.com',
    password: 'Test@123',
    role: 'admin',
    phone: '1234567890',
  },
  {
    username: 'manager',
    fullname: 'Manager User',
    email: 'manager@yopmain.com',
    password: 'Test@123',
    role: 'manager',
    phone: '1234567891',
  },
  {
    username: 'staff_member',
    fullname: 'Staff Member',
    email: 'staff@yopmain.com',
    password: 'Test@123',
    role: 'staff',
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

    console.log('\nSeeded users:');
    users.forEach((user) => {
      console.log(`- ${user.role}: ${user.username} (${user.email}) - Password: Test@123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
