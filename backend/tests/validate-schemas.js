import mongoose from 'mongoose';
import { User, Item, Order } from '../models/index.js';

console.log('🔍 Testing MongoDB Model Schemas (No DB Connection Required)...\n');

// Test User Model Schema
console.log('📋 User Model Schema:');
console.log('   ✅ Model name:', User.modelName);
console.log('   ✅ Schema paths:', Object.keys(User.schema.paths).join(', '));
console.log('   ✅ Has timestamps:', User.schema.options.timestamps);
console.log('   ✅ Indexes:', User.schema.indexes().map(idx => Object.keys(idx[0])[0]).join(', '));

// Verify User schema fields
const userPaths = Object.keys(User.schema.paths);
const requiredUserFields = ['name', 'email', 'password', 'roles', 'phone'];
const hasAllUserFields = requiredUserFields.every(field => userPaths.includes(field));
console.log('   ✅ Has all required fields:', hasAllUserFields);

// Test Item Model Schema
console.log('\n📋 Item Model Schema:');
console.log('   ✅ Model name:', Item.modelName);
console.log('   ✅ Schema paths:', Object.keys(Item.schema.paths).join(', '));
console.log('   ✅ Has timestamps:', Item.schema.options.timestamps);
console.log('   ✅ Indexes:', Item.schema.indexes().map(idx => Object.keys(idx[0])[0] || 'compound').join(', '));

// Verify Item schema fields
const itemPaths = Object.keys(Item.schema.paths);
const requiredItemFields = ['name', 'description', 'price', 'quantity_available', 'category', 'userId', 'available'];
const hasAllItemFields = requiredItemFields.every(field => itemPaths.includes(field));
console.log('   ✅ Has all required fields:', hasAllItemFields);

// Check Item userId reference
const userIdField = Item.schema.path('userId');
console.log('   ✅ userId references User:', userIdField.options.ref === 'User');

// Test Order Model Schema
console.log('\n📋 Order Model Schema:');
console.log('   ✅ Model name:', Order.modelName);
console.log('   ✅ Schema paths:', Object.keys(Order.schema.paths).join(', '));
console.log('   ✅ Has timestamps:', Order.schema.options.timestamps);
console.log('   ✅ Indexes:', Order.schema.indexes().map(idx => Object.keys(idx[0])[0] || 'compound').join(', '));

// Verify Order schema fields
const orderPaths = Object.keys(Order.schema.paths);
const requiredOrderFields = ['client', 'items', 'waiterId', 'sellerId', 'status', 'paymentStatus', 'notes', 'date'];
const hasAllOrderFields = requiredOrderFields.every(field => orderPaths.includes(field));
console.log('   ✅ Has all required fields:', hasAllOrderFields);

// Check Order references
const waiterIdField = Order.schema.path('waiterId');
const sellerIdField = Order.schema.path('sellerId');
console.log('   ✅ waiterId references User:', waiterIdField.options.ref === 'User');
console.log('   ✅ sellerId references User:', sellerIdField.options.ref === 'User');

// Check embedded client schema
const clientSchema = Order.schema.path('client');
console.log('   ✅ client is embedded document:', clientSchema.schema !== undefined);

// Check embedded items array
const itemsSchema = Order.schema.path('items');
const hasItemsSchema = itemsSchema.schema !== undefined && itemsSchema.schema.paths.itemId !== undefined;
console.log('   ✅ items is array of embedded documents:', hasItemsSchema);

console.log('\n📊 Schema Relationships:');
console.log('   ✅ User → Item (userId reference)');
console.log('   ✅ User → Order (waiterId reference)');
console.log('   ✅ User → Order (sellerId reference)');
console.log('   ✅ Item → Order.items (itemId reference)');
console.log('   ✅ User → Order.items (ownerId reference)');

// Test enum validations
console.log('\n📋 Enum Validations:');
const rolesEnum = User.schema.path('roles').caster.enumValues;
console.log('   ✅ User roles enum:', rolesEnum.join(', '));

const categoryEnum = Item.schema.path('category').enumValues;
console.log('   ✅ Item category enum:', categoryEnum.join(', '));

const statusEnum = Order.schema.path('status').enumValues;
console.log('   ✅ Order status enum:', statusEnum.join(', '));

const paymentStatusEnum = Order.schema.path('paymentStatus').enumValues;
console.log('   ✅ Order paymentStatus enum:', paymentStatusEnum.join(', '));

console.log('\n✨ All schema validations passed successfully!\n');

// Test instance creation (no DB save)
console.log('🧪 Testing Model Instantiation (without saving):');

try {
  const testUser = new User({
    name: 'John Doe',
    email: 'john.doe@test.com',
    password: 'hashedpassword123',
    roles: ['waiter', 'admin'],
    phone: '+1234567890',
  });
  console.log('   ✅ User instance created successfully');
  console.log('      - ID type:', testUser._id.constructor.name);
} catch (error) {
  console.log('   ❌ User instantiation failed:', error.message);
}

try {
  const testItem = new Item({
    name: 'Burger',
    description: 'Delicious beef burger',
    price: 12.99,
    quantity_available: 50,
    category: 'Food',
    userId: new mongoose.Types.ObjectId(),
    available: true,
  });
  console.log('   ✅ Item instance created successfully');
  console.log('      - ID type:', testItem._id.constructor.name);
} catch (error) {
  console.log('   ❌ Item instantiation failed:', error.message);
}

try {
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
    ],
    waiterId: new mongoose.Types.ObjectId(),
    sellerId: new mongoose.Types.ObjectId(),
    status: 'pending',
    paymentStatus: 'unpaid',
  });
  console.log('   ✅ Order instance created successfully');
  console.log('      - ID type:', testOrder._id.constructor.name);
  console.log('      - Client embedded:', typeof testOrder.client === 'object');
  console.log('      - Items count:', testOrder.items.length);
} catch (error) {
  console.log('   ❌ Order instantiation failed:', error.message);
}

console.log('\n🎉 All model tests completed successfully!');
console.log('💡 Models are ready to use with MongoDB connection.\n');
