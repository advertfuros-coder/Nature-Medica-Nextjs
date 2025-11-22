import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Made optional for guest orders
    },
    isGuestOrder: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: false,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        image: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        variant: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    shippingAddress: {
      name: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^[6-9][0-9]{9}$/.test(v);
          },
          message: "Phone must be 10 digits starting with 6, 7, 8, or 9",
        },
      },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: String,
      type: { type: String, enum: ["home", "work", "other"], default: "home" },
    },

    paymentMode: {
      type: String,
      enum: ["online", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    isManualShipment: { type: Boolean, default: false },
    manualTrackingId: String,
    manualCourierName: String,
    manualShipmentNote: String,

    courierName: String,
    trackingId: String,
    estimatedDelivery: Date,
    delhiveryWaybill: String,
    phonePeTransactionId: String,
    phonePePaymentId: String,
    ekartReferenceId: {
      type: String,
      default: null,
    },
    ekartTrackingId: {
      type: String,
      default: null,
    },

    // Generic shipping fields
    shippingProvider: {
      type: String,
      enum: ["shiprocket", "delhivery", "manual"],
      default: "manual",
    },
    shiprocketOrderId: Number,
    shiprocketShipmentId: Number,
    courierName: String,
    estimatedDelivery: Date,
    trackingId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    trackingId: String,
    couponCode: String,
    statusHistory: [
      {
        status: String,
        updatedAt: Date,
        note: String,
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ user: 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
