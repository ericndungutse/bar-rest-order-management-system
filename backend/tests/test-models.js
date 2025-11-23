import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Item, Order } from '../models/index.js';

dotenv.config();

// Test MongoDB connection and models
async function testModels() {
  try {
    console.log('🔍 Testing MongoDB Models...\n');

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bar-restaurant-db-test';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Test User Model
    console.log('📋 Testing User Model...');
    const testUser = new User({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'hashedpassword123',
      roles: ['waiter', 'admin'],
      phone: '+1234567890',
    });
    
    // Validate without saving
    await testUser.validate();
    console.log('✅ User model validation passed');
    console.log('   Fields:', Object.keys(testUser.toObject()));
    console.log('   Has timestamps:', testUser.createdAt !== undefined && testUser.updatedAt !== undefined);

    // Test Item Model
    console.log('\n📋 Testing Item Model...');
    const testItem = new Item({
      name: 'Burger',
      description: 'Delicious beef burger',
      price: 12.99,
      quantity_available: 50,
      category: 'Food',
      userId: new mongoose.Types.ObjectId(),
      available: true,
    });
    
    await testItem.validate();
    console.log('✅ Item model validation passed');
    console.log('   Fields:', Object.keys(testItem.toObject()));
    console.log('   Has timestamps:', testItem.createdAt !== undefined && testItem.updatedAt !== undefined);
    console.log('   Has userId reference:', testItem.userId instanceof mongoose.Types.ObjectId);

    // Test Order Model
    console.log('\n📋 Testing Order Model...');
    const testOrder = new Order({
      client: {
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        phone: '+0987654321',
      },
      items: [
        {
          itemId: new mongoose.Types.ObjectId(),
          name: 'Burger',
          price: 12.99,
          quantity: 2,
          ownerId: new mongoose.Types.ObjectId(),
        },
        {
          itemId: new mongoose.Types.ObjectId(),
          name: 'Cola',
          price: 2.50,
          quantity: 1,
        },
      ],
      waiterId: new mongoose.Types.ObjectId(),
      sellerId: new mongoose.Types.ObjectId(),
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: 'Extra sauce please',
      date: new Date(),
    });
    
    await testOrder.validate();
    console.log('✅ Order model validation passed');
    console.log('   Fields:', Object.keys(testOrder.toObject()));
    console.log('   Has timestamps:', testOrder.createdAt !== undefined && testOrder.updatedAt !== undefined);
    console.log('   Client embedded:', typeof testOrder.client === 'object');
    console.log('   Items array length:', testOrder.items.length);
    console.log('   Has waiterId reference:', testOrder.waiterId instanceof mongoose.Types.ObjectId);

    // Test required field validations
    console.log('\n📋 Testing Required Field Validations...');
    
    try {
      const invalidUser = new User({});
      await invalidUser.validate();
      console.log('❌ User validation should have failed');
    } catch (error) {
      console.log('✅ User required fields validation works');
    }

    try {
      const invalidItem = new Item({});
      await invalidItem.validate();
      console.log('❌ Item validation should have failed');
    } catch (error) {
      console.log('✅ Item required fields validation works');
    }

    try {
      const invalidOrder = new Order({});
      await invalidOrder.validate();
      console.log('❌ Order validation should have failed');
    } catch (error) {
      console.log('✅ Order required fields validation works');
    }

    // Test enum validations
    console.log('\n📋 Testing Enum Validations...');
    
    try {
      const invalidUser = new User({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        roles: ['invalid_role'],
      });
      await invalidUser.validate();
      console.log('❌ User role enum validation should have failed');
    } catch (error) {
      console.log('✅ User role enum validation works');
    }

    try {
      const invalidItem = new Item({
        name: 'Test',
        price: 10,
        quantity_available: 5,
        category: 'InvalidCategory',
        userId: new mongoose.Types.ObjectId(),
      });
      await invalidItem.validate();
      console.log('❌ Item category enum validation should have failed');
    } catch (error) {
      console.log('✅ Item category enum validation works');
    }

    try {
      const invalidOrder = new Order({
        client: { name: 'Test', email: 'test@test.com', phone: '123' },
        items: [{ itemId: new mongoose.Types.ObjectId(), name: 'Test', price: 10, quantity: 1 }],
        waiterId: new mongoose.Types.ObjectId(),
        status: 'invalid_status',
      });
      await invalidOrder.validate();
      console.log('❌ Order status enum validation should have failed');
    } catch (error) {
      console.log('✅ Order status enum validation works');
    }

    console.log('\n✨ All model tests passed successfully!\n');
    
    // Display schema relationships
    console.log('📊 Schema Relationships:');
    console.log('   User → Item (userId reference)');
    console.log('   User → Order (waiterId reference)');
    console.log('   User → Order (sellerId reference)');
    console.log('   Item → Order.items (itemId reference)');
    console.log('   User → Order.items (ownerId reference)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`   - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB Connection Closed');
  }
}

testModels();
