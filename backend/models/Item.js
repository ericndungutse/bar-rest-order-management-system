import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    quantity_available: {
      type: Number,
      required: [true, 'Quantity available is required'],
      min: [0, 'Quantity available must be a positive number'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Drink', 'Dessert'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID (owner/seller) is required'],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups by userId (owner)
itemSchema.index({ userId: 1 });

// Index for category filtering
itemSchema.index({ category: 1 });

// Index for available items
itemSchema.index({ available: 1 });

// Compound index for filtering available items by category
itemSchema.index({ available: 1, category: 1 });

const Item = mongoose.model('Item', itemSchema);

export default Item;
