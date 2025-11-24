import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Item from '../models/Item.js';
import connectDB from '../config/db.js';

dotenv.config();

// Admin user ID as specified in the issue
const ADMIN_USER_ID = '6923914c954a9bdea72eafea';

const items = [
  // Soft Drinks
  {
    name: 'Fanta Orange small',
    description: 'Small bottle of Fanta Orange soft drink',
    price: 600,
    quantity_available: 20,
    category: 'Drink',
    owner: new mongoose.Types.ObjectId(ADMIN_USER_ID),
    available: true,
  },
  {
    name: 'Coca Cola small',
    description: 'Small bottle of Coca Cola soft drink',
    price: 600,
    quantity_available: 20,
    category: 'Drink',
    owner: new mongoose.Types.ObjectId(ADMIN_USER_ID),
    available: true,
  },
  // Beer
  {
    name: 'Mutzing small',
    description: 'Small bottle of Mutzing beer',
    price: 800,
    quantity_available: 20,
    category: 'Drink',
    owner: new mongoose.Types.ObjectId(ADMIN_USER_ID),
    available: true,
  },
  {
    name: 'Primus Nini',
    description: 'Primus Nini beer',
    price: 800,
    quantity_available: 20,
    category: 'Drink',
    owner: new mongoose.Types.ObjectId(ADMIN_USER_ID),
    available: true,
  },
  {
    name: 'Heineken',
    description: 'Heineken beer',
    price: 1000,
    quantity_available: 20,
    category: 'Drink',
    owner: new mongoose.Types.ObjectId(ADMIN_USER_ID),
    available: true,
  },
];

const seedItems = async () => {
  try {
    await connectDB();

    // Convert ADMIN_USER_ID to ObjectId for proper comparison
    const adminObjectId = new mongoose.Types.ObjectId(ADMIN_USER_ID);

    // Clear existing items for this admin user
    await Item.deleteMany({ owner: adminObjectId });
    console.log('Cleared existing items for admin user');

    // Insert seed items
    const createdItems = await Item.insertMany(items);
    console.log('Items seeded successfully');

    console.log(`\nSeeded items for admin user (ID: ${ADMIN_USER_ID}):`);
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
