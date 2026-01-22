import mongoose from "mongoose";

const franchiseInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    investmentCapacity: {
      type: String,
      required: true,
    },
    propertyStatus: {
      type: String,
      required: true,
    },
    shopArea: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "shortlisted", "rejected", "closed"],
      default: "new",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.models.FranchiseInquiry ||
  mongoose.model("FranchiseInquiry", franchiseInquirySchema);
