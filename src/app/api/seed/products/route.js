import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function POST(req) {
  try {
    await connectDB();

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return NextResponse.json({
        error: 'Products already seeded. Delete existing products first or use a different endpoint.'
      }, { status: 400 });
    }

    // First, check if categories exist, if not create them
    let categories = await Category.find();
    
    if (categories.length === 0) {
      categories = await Category.insertMany([
        {
          name: 'Ayurvedic Supplements',
          slug: 'ayurvedic-supplements',
          icon: '🌿',
          description: 'Traditional Ayurvedic health supplements',
          active: true
        },
        {
          name: 'Vitamins & Minerals',
          slug: 'vitamins-minerals',
          icon: '💊',
          description: 'Essential vitamins and minerals for daily health',
          active: true
        },
        {
          name: 'Organic Foods',
          slug: 'organic-foods',
          icon: '🥗',
          description: 'Pure organic food products',
          active: true
        },
        {
          name: 'Herbal Tea',
          slug: 'herbal-tea',
          icon: '🍵',
          description: 'Natural herbal teas and wellness drinks',
          active: true
        },
        {
          name: 'Personal Care',
          slug: 'personal-care',
          icon: '🧴',
          description: 'Natural personal care products',
          active: true
        },
        {
          name: 'Immunity Boosters',
          slug: 'immunity-boosters',
          icon: '🛡️',
          description: 'Products to boost your immune system',
          active: true
        }
      ]);
    }

    // Sample products data
    const products = [
      {
        title: 'Ashwagandha Capsules 500mg - 60 Capsules',
        slug: 'ashwagandha-capsules-500mg',
        description: 'Premium Ashwagandha extract capsules for stress relief, better sleep, and enhanced energy. Made from pure Withania Somnifera root extract. Helps reduce cortisol levels and supports overall wellness.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
            publicId: 'ashwagandha_capsules'
          }
        ],
        price: 399,
        mrp: 599,
        discountPercent: 33,
        category: categories[0]._id,
        brand: 'NatureMedica',
        stock: 150,
        ingredients: 'Ashwagandha Root Extract (Withania Somnifera) 500mg, Vegetable Cellulose Capsule',
        specifications: {
          'Pack Size': '60 Capsules',
          'Serving Size': '1 Capsule',
          'Servings Per Container': '60',
          'Vegetarian': 'Yes',
          'Gluten Free': 'Yes'
        },
        ratingAvg: 4.5,
        reviewCount: 145,
        visibility: true
      },
      {
        title: 'Vitamin D3 + K2 - 90 Tablets',
        slug: 'vitamin-d3-k2-tablets',
        description: 'High potency Vitamin D3 (2000 IU) combined with Vitamin K2 for optimal calcium absorption and bone health. Supports immune function and cardiovascular health.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1550572017-4325a3ee3c00?w=500',
            publicId: 'vitamin_d3_k2'
          }
        ],
        price: 599,
        mrp: 899,
        discountPercent: 33,
        category: categories[1]._id,
        brand: 'NatureMedica',
        stock: 200,
        ingredients: 'Vitamin D3 (Cholecalciferol) 2000 IU, Vitamin K2 (MK-7) 100mcg, Microcrystalline Cellulose',
        specifications: {
          'Pack Size': '90 Tablets',
          'Serving Size': '1 Tablet',
          'Vitamin D3': '2000 IU',
          'Vitamin K2': '100mcg',
          'Vegetarian': 'Yes'
        },
        ratingAvg: 4.7,
        reviewCount: 203,
        visibility: true
      },
      {
        title: 'Organic Chia Seeds - 500g',
        slug: 'organic-chia-seeds-500g',
        description: 'Premium quality organic chia seeds packed with omega-3, fiber, and protein. Perfect for smoothies, yogurt, salads, and baking. Rich in antioxidants and minerals.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1628776725108-d23de6b5e86f?w=500',
            publicId: 'chia_seeds'
          }
        ],
        price: 249,
        mrp: 349,
        discountPercent: 29,
        category: categories[2]._id,
        brand: 'NatureMedica Organic',
        stock: 300,
        ingredients: '100% Organic Chia Seeds (Salvia Hispanica)',
        specifications: {
          'Weight': '500g',
          'Organic': 'Yes',
          'Protein': '21g per 100g',
          'Fiber': '34g per 100g',
          'Omega-3': 'High'
        },
        variants: [
          { name: 'Size', value: '250g', price: 149, stock: 150 },
          { name: 'Size', value: '500g', price: 249, stock: 200 },
          { name: 'Size', value: '1kg', price: 449, stock: 100 }
        ],
        ratingAvg: 4.6,
        reviewCount: 187,
        visibility: true
      },
      {
        title: 'Tulsi Green Tea - 25 Tea Bags',
        slug: 'tulsi-green-tea-bags',
        description: 'Refreshing blend of premium green tea and holy basil (Tulsi). Rich in antioxidants, supports immunity, and promotes relaxation. Perfect for daily wellness routine.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500',
            publicId: 'tulsi_green_tea'
          }
        ],
        price: 199,
        mrp: 299,
        discountPercent: 33,
        category: categories[3]._id,
        brand: 'NatureMedica Wellness',
        stock: 250,
        ingredients: 'Organic Green Tea Leaves, Tulsi Leaves (Holy Basil), Natural Flavors',
        specifications: {
          'Pack Size': '25 Tea Bags',
          'Weight': '50g',
          'Caffeine': 'Low',
          'Organic': 'Yes',
          'Flavored': 'Natural'
        },
        ratingAvg: 4.4,
        reviewCount: 98,
        visibility: true
      },
      {
        title: 'Multivitamin Gummies for Adults - 60 Gummies',
        slug: 'multivitamin-gummies-adults',
        description: 'Delicious fruit-flavored gummies packed with 12 essential vitamins and minerals. Sugar-free formula supports energy, immunity, and overall health.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500',
            publicId: 'multivitamin_gummies'
          }
        ],
        price: 499,
        mrp: 799,
        discountPercent: 38,
        category: categories[1]._id,
        brand: 'NatureMedica',
        stock: 180,
        ingredients: 'Vitamin A, C, D, E, B6, B12, Folate, Biotin, Zinc, Iodine, Natural Fruit Flavors, Pectin',
        specifications: {
          'Pack Size': '60 Gummies',
          'Serving Size': '2 Gummies',
          'Sugar Free': 'Yes',
          'Vegetarian': 'Yes',
          'Gluten Free': 'Yes'
        },
        ratingAvg: 4.8,
        reviewCount: 267,
        visibility: true
      },
      {
        title: 'Turmeric Curcumin with Black Pepper - 90 Capsules',
        slug: 'turmeric-curcumin-capsules',
        description: 'High-potency turmeric curcumin extract with BioPerine (black pepper extract) for enhanced absorption. Supports joint health and reduces inflammation.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=500',
            publicId: 'turmeric_curcumin'
          }
        ],
        price: 449,
        mrp: 699,
        discountPercent: 36,
        category: categories[0]._id,
        brand: 'NatureMedica',
        stock: 220,
        ingredients: 'Turmeric Root Extract (95% Curcuminoids) 500mg, Black Pepper Extract (BioPerine) 5mg',
        specifications: {
          'Pack Size': '90 Capsules',
          'Curcuminoids': '95%',
          'Serving Size': '1 Capsule',
          'Vegetarian': 'Yes',
          'Gluten Free': 'Yes'
        },
        ratingAvg: 4.7,
        reviewCount: 189,
        visibility: true
      },
      {
        title: 'Neem Face Wash - 100ml',
        slug: 'neem-face-wash-100ml',
        description: 'Gentle herbal face wash with pure neem extract. Helps cleanse skin, fights acne, and prevents pimples. Suitable for all skin types.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
            publicId: 'neem_facewash'
          }
        ],
        price: 149,
        mrp: 199,
        discountPercent: 25,
        category: categories[4]._id,
        brand: 'NatureMedica Care',
        stock: 350,
        ingredients: 'Neem Extract, Aloe Vera, Tulsi, Turmeric, Natural Cleansing Agents',
        specifications: {
          'Volume': '100ml',
          'Skin Type': 'All Types',
          'Paraben Free': 'Yes',
          'Sulfate Free': 'Yes',
          'Cruelty Free': 'Yes'
        },
        ratingAvg: 4.5,
        reviewCount: 156,
        visibility: true
      },
      {
        title: 'Immunity Booster Juice - 500ml',
        slug: 'immunity-booster-juice-500ml',
        description: 'Power-packed immunity juice with amla, tulsi, giloy, and ashwagandha. Strengthens immune system naturally.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
            publicId: 'immunity_juice'
          }
        ],
        price: 299,
        mrp: 449,
        discountPercent: 33,
        category: categories[5]._id,
        brand: 'NatureMedica Wellness',
        stock: 120,
        ingredients: 'Amla, Tulsi, Giloy, Ashwagandha, Ginger, Turmeric, Water',
        specifications: {
          'Volume': '500ml',
          'Sugar Added': 'No',
          'Preservatives': 'No',
          'Organic': 'Yes',
          'Shelf Life': '6 Months'
        },
        ratingAvg: 4.6,
        reviewCount: 134,
        visibility: true
      }
    ];

    const insertedProducts = await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: 'Products and categories seeded successfully',
      categoriesCount: categories.length,
      productsCount: insertedProducts.length,
      products: insertedProducts.map(p => ({ id: p._id, title: p.title, slug: p.slug }))
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
