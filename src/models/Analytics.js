import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  salesCount: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  newUsers: { type: Number, default: 0 },
  topSellingProducts: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      count: Number,
      revenue: Number
    }
  ],
  categoryBreakdown: [
    {
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      revenue: Number,
      sales: Number
    }
  ],
  dailyOrders: [{ orderId: String, total: Number }],
}, { timestamps: true });

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
