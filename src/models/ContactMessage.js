import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['order', 'product', 'shipping', 'return', 'payment', 'feedback', 'other']
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  adminNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
