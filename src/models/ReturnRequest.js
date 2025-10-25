import mongoose from 'mongoose';

const ReturnRequestSchema = new mongoose.Schema({
  returnId: { type: String, required: true, unique: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    quantity: Number,
    price: Number,
    reason: String
  }],
  type: { type: String, enum: ['return', 'exchange'], required: true },
  reason: { type: String, required: true },
  detailedReason: { type: String },
  images: [{
    url: String,
    publicId: String
  }],
  refundMethod: { type: String, enum: ['bank', 'upi', 'wallet'], required: true },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  upiDetails: {
    upiId: String
  },
  refundAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'pickup_scheduled', 'picked_up', 'refunded', 'completed'], 
    default: 'pending' 
  },
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    note: String
  }],
  adminNotes: { type: String },
  pickupScheduled: { type: Date },
  refundProcessedDate: { type: Date }
}, { timestamps: true });

export default mongoose.models.ReturnRequest || mongoose.model('ReturnRequest', ReturnRequestSchema);
