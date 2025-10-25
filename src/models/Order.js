import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  variant: { type: String }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMode: { type: String, enum: ['online', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    note: String
  }],
  couponCode: { type: String },
  trackingId: { type: String }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
