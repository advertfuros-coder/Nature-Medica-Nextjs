import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    default: 'general' // We can have 'general', 'email', 'payment', etc. or just one doc for now
  },
  orderNotificationEmails: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  // Add other global settings here in the future
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
