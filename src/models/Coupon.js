import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['flat', 'percent'], required: true },
  value: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
