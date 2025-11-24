import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Item from '../models/Item.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const createItems = (adminId) => [
  // Soft Drinks
  {
    name: 'Fanta Orange small',
    description: 'Small bottle of Fanta Orange soft drink',
    price: 600,
    quantity_available: 20,
    category: 'Drink',
    owner: adminId,
    available: true,
  },
  {
    name: 'Coca Cola small',
    description: 'Small bottle of Coca Cola soft drink',
    price: 600,
    quantity_available: 20,
    category: 'Drink',
    owner: adminId,
    available: true,
  },
  // Beer
  {
    name: 'Mutzing small',
    description: 'Small bottle of Mutzing beer',
    price: 800,
    quantity_available: 20,
    category: 'Drink',
    owner: adminId,
    available: true,
  },
  {
    name: 'Primus Nini',
    description: 'Primus Nini beer',
    price: 800,
    quantity_available: 20,
    category: 'Drink',
    owner: adminId,
    available: true,
  },
  {
    name: 'Heineken',
    description: 'Heineken beer',
    price: 1000,
    quantity_available: 20,
    category: 'Drink',
    owner: adminId,
    available: true,
  },
];

const seedItems = async () => {
  try {
    await connectDB();

    // Find the admin user
    const adminUser = await User.findOne({ roles: 'admin' });
    if (!adminUser) {
      console.error('Admin user not found. Please run "npm run seed" first to create users.');
      process.exit(1);
    }

    console.log(`Found admin user: ${adminUser.name} (${adminUser._id})`);

    // Create items with admin's ID
    const items = createItems(adminUser._id);

    // Clear existing items for this admin user
    await Item.deleteMany({ owner: adminUser._id });
    console.log('Cleared existing items for admin user');

    // Insert seed items
    const createdItems = await Item.insertMany(items);
    console.log('Items seeded successfully');

    console.log(`\nSeeded items for admin user (ID: ${adminUser._id}):`);
    console.log('============================================================');
    
    // Separate items by type based on their names
    const softDrinks = createdItems.filter(item => 
      item.name.includes('Fanta') || item.name.includes('Coca Cola')
    );
    const beers = createdItems.filter(item => 
      item.name.includes('Mutzing') || item.name.includes('Primus') || item.name.includes('Heineken')
    );
    
    console.log('\nSoft Drinks:');
    softDrinks.forEach((item) => {
      console.log(`- ${item.name}: ${item.quantity_available} pieces @ ${item.price} RWF each`);
    });
    console.log('\nBeer:');
    beers.forEach((item) => {
      console.log(`- ${item.name}: ${item.quantity_available} pieces @ ${item.price} RWF each`);
    });
    console.log('\n============================================================');
    console.log(`Total items seeded: ${createdItems.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding items:', error);
    process.exit(1);
  }
};

seedItems();
