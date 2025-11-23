# Database Models

This directory contains the MongoDB/Mongoose models for the Bar & Restaurant Order Management System.

## Models Overview

### User Model (`User.js`)

Represents users in the system (waiters, admins, sellers).

**Attributes:**
- `_id` (ObjectId) - Primary key (auto-generated)
- `name` (String) - User's full name (required)
- `email` (String) - Unique email address (required)
- `password` (String) - Hashed password (required, min 6 characters)
- `roles` (Array[String]) - User roles: `['waiter', 'admin', 'seller']` (required)
- `phone` (String) - Phone number (optional)
- `createdAt` (Date) - Timestamp (auto-generated)
- `updatedAt` (Date) - Timestamp (auto-generated)

**Indexes:**
- `email` (unique)
- `roles` (for role-based queries)

**Relationships:**
- `owns → Item (userId)`
- `serves → Order (waiterId)`
- `receives → Order (sellerId)`

---

### Item Model (`Item.js`)

Represents menu items (food, drinks, desserts).

**Attributes:**
- `_id` (ObjectId) - Primary key (auto-generated)
- `name` (String) - Item name (required)
- `description` (String) - Item description (optional)
- `price` (Number) - Item price (required, min 0)
- `quantity_available` (Number) - Stock quantity (required, min 0, default 0)
- `category` (String) - Category: `['Food', 'Drink', 'Dessert']` (required)
- `userId` (ObjectId) - Reference to User (owner/seller) (required)
- `available` (Boolean) - Item availability (default true)
- `createdAt` (Date) - Timestamp (auto-generated)
- `updatedAt` (Date) - Timestamp (auto-generated)

**Indexes:**
- `userId` (for owner lookups)
- `category` (for filtering)
- `available` (for filtering)
- `{available, category}` (compound index)

**Relationships:**
- `belongsTo → User (userId)`
- `includedIn → Order.items.itemId`

---

### Order Model (`Order.js`)

Represents customer orders.

**Attributes:**
- `_id` (ObjectId) - Primary key (auto-generated)
- `client` (Embedded Document):
  - `name` (String) - Client name (required)
  - `email` (String) - Client email (required)
  - `phone` (String) - Client phone (required)
- `items` (Array[Embedded Document]):
  - `itemId` (ObjectId) - Reference to Item (required)
  - `name` (String) - Item name snapshot (required)
  - `price` (Number) - Item price snapshot (required, min 0)
  - `quantity` (Number) - Quantity ordered (required, min 1)
  - `ownerId` (ObjectId) - Reference to User (optional)
- `waiterId` (ObjectId) - Reference to User serving the order (required)
- `sellerId` (ObjectId) - Reference to User who owns items (optional)
- `status` (String) - Order status: `['pending', 'preparing', 'served', 'cancelled']` (default 'pending')
- `paymentStatus` (String) - Payment status: `['unpaid', 'paid', 'refunded']` (default 'unpaid')
- `notes` (String) - Order notes (optional)
- `date` (Date) - Order date (default now)
- `createdAt` (Date) - Timestamp (auto-generated)
- `updatedAt` (Date) - Timestamp (auto-generated)

**Indexes:**
- `waiterId` (for waiter lookups)
- `sellerId` (for seller lookups)
- `status` (for filtering)
- `paymentStatus` (for filtering)
- `date` (for date-based queries)
- `{status, date}` (compound index)
- `{waiterId, status}` (compound index)

**Relationships:**
- `servedBy → User (waiterId)`
- `soldBy → User (sellerId)`
- `contains → Item (items.itemId)`

---

## Relationship Diagram

```
User (_id)
 ├─ owns → Item (userId)
 ├─ serves → Order (waiterId)
 └─ receives → Order (sellerId)

Item (_id)
 ├─ belongsTo → User (userId)
 └─ includedIn → Order.items.itemId

Order (_id)
 ├─ servedBy → User (waiterId)
 ├─ soldBy → User (sellerId)
 └─ contains → Item (items.itemId)
```

---

## Usage

Import models in your application:

```javascript
import { User, Item, Order } from './models/index.js';

// Or import individually
import User from './models/User.js';
import Item from './models/Item.js';
import Order from './models/Order.js';
```

### Examples

**Create a User:**
```javascript
const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword123',
  roles: ['waiter'],
  phone: '+1234567890'
});
await user.save();
```

**Create an Item:**
```javascript
const item = new Item({
  name: 'Burger',
  description: 'Delicious beef burger',
  price: 12.99,
  quantity_available: 50,
  category: 'Food',
  userId: userId, // Reference to User
  available: true
});
await item.save();
```

**Create an Order:**
```javascript
const order = new Order({
  client: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321'
  },
  items: [
    {
      itemId: itemId, // Reference to Item
      name: 'Burger',
      price: 12.99,
      quantity: 2
    }
  ],
  waiterId: waiterId, // Reference to User
  status: 'pending',
  paymentStatus: 'unpaid'
});
await order.save();
```

---

## Testing

Run schema validation tests:

```bash
node tests/validate-schemas.js
```

This will validate all model schemas without requiring a database connection.

---

## Notes

- All models use `timestamps: true` for automatic `createdAt` and `updatedAt` fields
- Email validation uses regex pattern for basic validation
- Indexes are optimized for common query patterns
- Embedded documents (client, items) are used in Order for data denormalization
- All references use ObjectId type for relationships between collections
