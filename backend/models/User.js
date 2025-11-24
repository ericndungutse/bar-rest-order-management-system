import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
      enum: ['admin', 'manager', 'waiter'],
      default: ['waiter'],
      validate: {
        validator: function (roles) {
          return roles && roles.length > 0;
        },
        message: 'At least one role is required',
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    boss: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      validate: {
        validator: function (bossId) {
          // Boss can only be set if user is manager or waiter
          return !bossId || this.roles.includes('manager') || this.roles.includes('waiter');
        },
        message: 'Only managers and waiters can have a boss',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for role-based queries
userSchema.index({ roles: 1 });

// Index for boss relationship queries
userSchema.index({ boss: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
