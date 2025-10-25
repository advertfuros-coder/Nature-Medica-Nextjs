import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';
import Product from '@/models/Product';
import Category from '@/models/Category';
import HeroBanner from '@/components/customer/HeroBanner';
import CategorySection from '@/components/customer/CategorySection';
import ProductGrid from '@/components/customer/ProductGrid';
import BestsellerSection from '@/components/customer/BestsellerSection';
import HotSellingSection from '@/components/customer/HotSellingSection';
import FAQ from '@/components/customer/FAQ';
import ReviewSection from '@/components/customer/ReviewSection';

export default async function HomePage() {
  await connectDB();

  const homeBanners = await Banner.find({ type: 'home', active: true })
    .sort({ order: 1 })
    .limit(5)
    .lean();

  const categories = await Category.find({ active: true })
    .sort({ name: 1 })
    .limit(8)
    .lean();

  const bestsellerProducts = await Product.find({ visibility: true })
    .sort({ reviewCount: -1 })
    .limit(8)
    .populate('category')
    .lean();

  const hotsellingProducts = await Product.find({ visibility: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('category')
    .lean();

  return (
    <main className="min-h-screen">
      <HeroBanner banners={JSON.parse(JSON.stringify(homeBanners))} />
      
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <CategorySection categories={JSON.parse(JSON.stringify(categories))} />
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Bestsellers</h2>
          <BestsellerSection products={JSON.parse(JSON.stringify(bestsellerProducts))} />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Hot Selling Products</h2>
        <HotSellingSection products={JSON.parse(JSON.stringify(hotsellingProducts))} />
      </section>
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Reviews</h2>
        <ReviewSection />
      </section>


        <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose NatureMedica?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-green-600 text-4xl mb-4">🌿</div>
              <h3 className="font-bold text-xl mb-2">100% Natural</h3>
              <p className="text-gray-600">All products are natural and ayurvedic</p>
            </div>
            <div>
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <h3 className="font-bold text-xl mb-2">Lab Tested</h3>
              <p className="text-gray-600">Every product is lab tested and certified</p>
            </div>
            <div>
              <div className="text-green-600 text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Free shipping on orders above ₹499</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">FAQ</h2>
        <FAQ products={JSON.parse(JSON.stringify(hotsellingProducts))} />
      </section>




    
    </main>
  );
}
