import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    roles: {
      type: [String],
      enum: ['waiter', 'admin', 'seller'],
      default: ['waiter'],
      validate: {
        validator: function(roles) {
          return roles && roles.length > 0;
        },
        message: 'At least one role is required',
      },
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for role-based queries
userSchema.index({ roles: 1 });

const User = mongoose.model('User', userSchema);

export default User;
