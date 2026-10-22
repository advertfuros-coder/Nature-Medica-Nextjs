import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['hero_left', 'hero_right', 'home', 'bestseller', 'hotselling'], 
    required: true,
    index: true 
  },
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  badge: { type: String, trim: true },
  tagline: { type: String, trim: true },
  categoryName: { type: String, trim: true },
  image: { 
    url: { type: String, required: true },
    publicId: String 
  },
  link: { type: String, trim: true },
  active: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
