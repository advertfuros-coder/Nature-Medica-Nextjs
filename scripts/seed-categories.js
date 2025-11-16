require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://user:user7233@cluster0.wzu8u.mongodb.net/nm");
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  icon: String,
  image: String,
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  level: Number,
  order: Number,
  isActive: Boolean
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const categories = [
  // Main Categories (Level 0)
  {
    name: 'Face & Beauty Care',
    slug: 'face-beauty-care',
    description: 'Complete range of face and beauty products for glowing skin',
    icon: '✨',
    level: 0,
    order: 1,
    subcategories: [
      { name: 'Face Wash', slug: 'face-wash', icon: '🧴', order: 1 },
      { name: 'Face Serum', slug: 'face-serum', icon: '💧', order: 2 },
      { name: 'Cold Cream', slug: 'cold-cream', icon: '🧊', order: 3 },
      { name: 'Night Gel', slug: 'night-gel', icon: '🌙', order: 4 },
      { name: 'Perfume', slug: 'perfume', icon: '🌸', order: 5 }
    ]
  },
  {
    name: 'Oral Care',
    slug: 'oral-care',
    description: 'Complete dental care products for healthy teeth and gums',
    icon: '🦷',
    level: 0,
    order: 2,
    subcategories: [
      { name: 'Toothpaste', slug: 'toothpaste', icon: '🦷', order: 1 },
      { name: 'Tooth Brush', slug: 'tooth-brush', icon: '🪥', order: 2 }
    ]
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Natural hair care solutions for healthy, shiny hair',
    icon: '💇',
    level: 0,
    order: 3,
    subcategories: [
      { name: 'Shampoo', slug: 'shampoo', icon: '🧴', order: 1 },
      { name: 'Hair Oil', slug: 'hair-oil', icon: '💆', order: 2 }
    ]
  },
  {
    name: 'Feminine Hygiene',
    slug: 'feminine-hygiene',
    description: 'Premium feminine hygiene products for comfort and confidence',
    icon: '🌺',
    level: 0,
    order: 4,
    subcategories: [
      { name: 'Sanitary Pads', slug: 'sanitary-pads', icon: '🩸', order: 1 }
    ]
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Complete range of health supplements and wellness products',
    icon: '💊',
    level: 0,
    order: 5,
    subcategories: [
      {
        name: 'Effervescent Tablets',
        slug: 'effervescent-tablets',
        icon: '💊',
        order: 1,
        products: [
          'Glutathion Effervescent Tablets',
          'Calcium Effervescent Tablets',
          'Anti Cold Effervescent Tablets',
          'Green Tea Effervescent Tablets',
          'Gas Effervescent Tablets'
        ]
      },
      {
        name: 'Gummies',
        slug: 'gummies',
        icon: '🍬',
        order: 2,
        products: [
          'Multivitamin Gummies',
          'Sleepwell Gummies'
        ]
      },
      {
        name: 'Ayurvedic Remedies',
        slug: 'ayurvedic-remedies',
        icon: '🌿',
        order: 3,
        products: [
          'Veda Piles Cure',
          'Veda Sugar Cure'
        ]
      },
      {
        name: 'Health Supplements',
        slug: 'health-supplements',
        icon: '💪',
        order: 4,
        products: [
          'Moringa Powder',
          'Japanese Matcha Green Tea'
        ]
      }
    ]
  },
  {
    name: "Women's Health",
    slug: 'womens-health',
    description: 'Essential products for women\'s health and wellness',
    icon: '👩',
    level: 0,
    order: 6,
    subcategories: [
      { name: 'Pregnancy Kit', slug: 'pregnancy-kit', icon: '🤰', order: 1 }
    ]
  }
];

async function seedCategories() {
  try {
    await connectDB();

    console.log('🗑️ Clearing existing categories...');
    await Category.deleteMany({});

    console.log('🌱 Seeding categories...\n');

    for (const mainCategory of categories) {
      // Create main category
      const { subcategories, ...mainCatData } = mainCategory;
      const createdMainCat = await Category.create(mainCatData);
      
      console.log(`✅ Created: ${createdMainCat.name} (Main)`);

      // Create subcategories
      if (subcategories && subcategories.length > 0) {
        for (const subcat of subcategories) {
          const subcatData = {
            ...subcat,
            parentCategory: createdMainCat._id,
            level: 1,
            description: `${subcat.name} from Nature Medica`,
            isActive: true
          };

          delete subcatData.products; // Remove products array from subcategory

          const createdSubCat = await Category.create(subcatData);
          console.log(`  ↳ ${createdSubCat.name}`);
        }
      }
    }

    console.log('\n🎉 All categories seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
