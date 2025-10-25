import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { 
    url: String, 
    publicId: String 
  },
  icon: { type: String },
  description: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
