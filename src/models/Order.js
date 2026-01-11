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
      enum: ["online", "cod", "partial_cod"],
      required: true,
      default: "online",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_paid"],
      default: "pending",
    },

    // Partial COD fields
    isPartialCOD: {
      type: Boolean,
      default: false,
    },
    advancePaid: {
      type: Number,
      default: 0,
    },
    codAmountToCollect: {
      type: Number,
      default: 0,
    },

    // Phone verification fields
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    otpVerifiedAt: {
      type: Date,
    },
    otpVerificationId: {
      type: String,
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

    // Generic shipping fields
    shippingProvider: {
      type: String,
      enum: ["shiprocket", "delhivery", "ekart", "manual"],
      default: "manual",
    },
    courierName: String,
    estimatedDelivery: Date,
    trackingId: String,

    // Ekart Logistics specific fields
    ekart: {
      trackingId: String, // Ekart tracking ID (500999A3408005)
      waybillNumber: String, // Vendor waybill number
      vendor: String, // Courier partner name (e.g., "EKART", "BLUEDART")
      orderNumber: String, // Order number as sent to Ekart
      channelId: String, // Ekart order ID
      codWaybill: String, // COD waybill for COD shipments
      shipmentStatus: String, // Latest shipment status
      labelUrl: String, // URL to download label
      manifestUrl: String, // URL to download manifest
      createdAt: Date, // Shipment creation timestamp
      cancelledAt: Date, // Cancellation timestamp (if applicable)
      deliveredAt: Date, // Delivery timestamp (if delivered)
    },

    // Delhivery specific
    delhiveryWaybill: String,

    // Shiprocket specific
    shiprocketOrderId: Number,
    shiprocketShipmentId: Number,

    // PhonePe/Razorpay/Cashfree payment IDs
    phonePeTransactionId: String,
    phonePePaymentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    cashfreeOrderId: String,
    cashfreePaymentId: String,

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

OrderSchema.index({ user: 1 });
OrderSchema.index({ "ekart.trackingId": 1 });

// Delete the model from cache in development to pick up schema changes
if (process.env.NODE_ENV !== "production" && mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
