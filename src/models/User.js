import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define address schema
const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String, default: '' },
  type: { type: String, default: 'home' },
  isDefault: { type: Boolean, default: false },
  addressScore: { type: Number, default: 0 },
  addressQuality: { type: String, default: 'Standard' },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true
  },
  phone: { 
    type: String 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required']
  },
  
  // Email verification
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationOTP: { type: String },
  emailVerificationOTPExpires: { type: Date },
  
  // Password reset
  resetPasswordOTP: { type: String },
  resetPasswordOTPExpires: { type: Date },
  
  // Address
  addresses: [addressSchema], // ✅ Fixed: array of objects
  
  // User preferences
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { 
  timestamps: true,
  collection: 'users' // Explicitly set collection name
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Generate OTP method
UserSchema.methods.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Clear the model from cache to avoid conflicts
delete mongoose.models.User;

const User = mongoose.model('User', UserSchema);

export default User;
