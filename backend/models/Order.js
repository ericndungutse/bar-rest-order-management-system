import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import Item from './Item.js';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

// Embedded document schema for client information
const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Client phone is required'],
      trim: true,
    },
  },
  { _id: false }
);

// Embedded document schema for order items
const orderItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price must be a positive number'],
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: clientSchema,
      required: [true, 'Client information is required'],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: 'At least one item is required in the order',
      },
    },
    waiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Waiter ID is required'],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'served', 'cancelled'],
      default: 'pending',
    },
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups by waiterId
orderSchema.index({ waiterId: 1 });

// Index for faster lookups by sellerId
orderSchema.index({ sellerId: 1 });

// Model will be created after middleware is attached so pre-save runs as expected

// Generate orderId before save
orderSchema.pre('save', function (next) {
  if (this.isNew && !this.orderId) {
    this.orderId = nanoid(); // <- call the function!
  }
  next();
});

// Pre-validate middleware: ensure each ordered item exists, is available and has enough quantity
// Pre-save middleware: ensure each ordered item exists, is available and has enough quantity
orderSchema.pre('save', async function (next) {
  // only run on create/update when items are present
  if (!this.items || this.items.length === 0) return next();

  const sellerId = this.sellerId;

  try {
    for (let idx = 0; idx < this.items.length; idx++) {
      const orderItem = this.items[idx];
      const itemDoc = await Item.findOne({ _id: orderItem.itemId, owner: sellerId });

      // build a short identifier for errors
      const itemName = itemDoc?.name || null;
      const itemIdent = itemName ? `${itemName} (${orderItem.itemId})` : `${orderItem.itemId}`;

      if (!itemDoc) {
        const err = new mongoose.Error.ValidationError(this);
        err.addError(
          `items.${idx}`,
          new mongoose.Error.ValidatorError({
            message: `Item not found: ${orderItem.itemId}`,
            reason: 'not_found',
            item: orderItem.itemId,
            index: idx,
          })
        );
        throw err;
      }

      if (!itemDoc.available) {
        const err = new mongoose.Error.ValidationError(this);
        err.addError(
          `items.${idx}`,
          new mongoose.Error.ValidatorError({
            message: `Item unavailable: ${itemIdent}. Reason: marked unavailable`,
            reason: 'unavailable',
            item: itemDoc._id,
            itemName,
            index: idx,
          })
        );
        throw err;
      }

      if (itemDoc.quantity_available < orderItem.quantity) {
        const err = new mongoose.Error.ValidationError(this);
        err.addError(
          `items.${idx}`,
          new mongoose.Error.ValidatorError({
            message: `Insufficient stock for ${itemIdent}. Requested ${orderItem.quantity}, available ${itemDoc.quantity_available}. Reason: insufficient_quantity`,
            reason: 'insufficient_quantity',
            item: itemDoc._id,
            itemName,
            requested: orderItem.quantity,
            available: itemDoc.quantity_available,
            index: idx,
          })
        );
        throw err;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Post-save middleware: decrement stock for each ordered item. This uses atomic updates
// to reduce race conditions but is not a full transaction. If an update fails due to
// a concurrent change, we log a warning — the order has already been saved.
orderSchema.post('save', async function (doc, next) {
  try {
    for (const orderItem of doc.items) {
      const updated = await Item.findOneAndUpdate(
        { _id: orderItem.itemId, quantity_available: { $gte: orderItem.quantity } },
        { $inc: { quantity_available: -orderItem.quantity } },
        { new: true }
      );

      if (!updated) {
        // This indicates a race condition where stock was consumed after validation
        console.warn(`Failed to decrement stock for item ${orderItem.itemId} — possible concurrent order.`);
      }
    }

    next();
  } catch (error) {
    console.error('Error decrementing item stock after order save:', error);
    next();
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
