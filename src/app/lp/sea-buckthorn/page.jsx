import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SeaBuckthornLanding from './SeaBuckthornLanding';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Raw Himalayan Sea Buckthorn Juice | Rare Omega-7 & 12x Vitamin C | Nature Medica',
  description: 'Pure, wild-harvested Himalayan Sea Buckthorn juice from Ladakh. Earth\'s rarest source of Omega-7, full-spectrum Omegas 3-6-9, and 190+ bio-active nutrients for luminous skin and gut healing.',
  openGraph: {
    title: 'Raw Himalayan Sea Buckthorn Juice | Nature Medica',
    description: 'Wild-harvested cold-pressed Sea Buckthorn from 14,000+ ft. 100% raw pulp, zero added water or sugar.',
    images: [
      {
        url: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040367/naturemedica/products/oszz5by9uihtzraq9etb.jpg',
        width: 1200,
        height: 630,
        alt: 'Nature Medica Raw Himalayan Sea Buckthorn Juice with fresh berries',
      },
    ],
  },
  alternates: {
    canonical: '/lp/sea-buckthorn',
  },
};

export default async function SeaBuckthornPage() {
  let product = null;

  try {
    await connectDB();
    const dbProduct = await Product.findOne({
      slug: 'sea-buckthorn-juice-500ml-nature-medica',
    }).lean();

    if (dbProduct) {
      product = JSON.parse(JSON.stringify(dbProduct));
    }
  } catch (err) {
    console.error('Failed to fetch product for LP:', err);
  }

  // Fallback product data if database connection is pending
  if (!product) {
    product = {
      _id: 'sea-buckthorn-juice-500ml-nature-medica',
      title: 'Sea Buckthorn Juice 500ml – Nature Medica',
      slug: 'sea-buckthorn-juice-500ml-nature-medica',
      price: 799,
      mrp: 1299,
      stock: 1000,
      featuredImage:
        'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040356/naturemedica/products/xstvz55avuw882sc6yyb.jpg',
      images: [
        {
          url: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040356/naturemedica/products/xstvz55avuw882sc6yyb.jpg',
          altText: 'Nature Medica Sea Buckthorn Juice 500ml front packaging',
        },
        {
          url: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040367/naturemedica/products/oszz5by9uihtzraq9etb.jpg',
          altText: 'Wild Himalayan Sea Buckthorn berries with pure juice bottle',
        },
        {
          url: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040362/naturemedica/products/xykxhfyvqg5a7m7tqjfh.jpg',
          altText: 'Nutritional facts and certified ingredients label',
        },
      ],
    };
  }

  return <SeaBuckthornLanding product={product} />;
}
