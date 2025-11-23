import mongoose from 'mongoose';

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
        validator: function(items) {
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

// Index for status filtering
orderSchema.index({ status: 1 });

// Index for payment status filtering
orderSchema.index({ paymentStatus: 1 });

// Index for date-based queries
orderSchema.index({ date: -1 });

// Compound index for filtering orders by status and date
orderSchema.index({ status: 1, date: -1 });

// Compound index for waiter's orders by status
orderSchema.index({ waiterId: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
