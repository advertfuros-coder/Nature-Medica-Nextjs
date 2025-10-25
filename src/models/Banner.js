import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  type: { type: String, enum: ['home', 'bestseller', 'hotselling'], required: true },
  title: { type: String },
  subtitle: { type: String },
  image: { 
    url: { type: String, required: true },
    publicId: String 
  },
  link: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
