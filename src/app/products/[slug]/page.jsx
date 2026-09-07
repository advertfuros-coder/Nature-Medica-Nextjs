import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import Category from '@/models/Category';
import User from '@/models/User';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImages from '@/components/customer/ProductImages';
import ProductInfo from '@/components/customer/ProductInfo';
import ProductTabs from '@/components/customer/ProductTabs';
import ReviewSection from '@/components/customer/ReviewSection';
import ProductGrid from '@/components/customer/ProductGrid';
import MobileStickyBar from '@/components/customer/MobileStickyBar';
import { FiHome, FiChevronRight, FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Fetch product with category populated
    const product = await Product.findOne({ slug: slug })
      .populate('category')
      .lean();

    if (!product) {
      notFound();
    }

    // Get reviews with user populated
    const reviews = await Review.find({ 
      product: product._id, 
      approved: true 
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Get related products
    const relatedProducts = product.category 
      ? await Product.find({
          category: product.category._id,
          _id: { $ne: product._id },
          visibility: true
        })
          .limit(4)
          .lean()
      : [];

    // Serialize all data
    const serializedProduct = JSON.parse(JSON.stringify(product));
    const serializedReviews = JSON.parse(JSON.stringify(reviews));
    const serializedRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

    return (
      <div className="bg-white min-h-screen text-gray-900 selection:bg-[#2d4e24] selection:text-white">
        {/* Subtle Minimalist Breadcrumb */}
        <div className="border-b border-gray-100 bg-[#FAF8F5]/60">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto no-scrollbar font-medium">
              <Link 
                href="/" 
                className="hover:text-[#2d4e24] transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <FiHome className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <FiChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <Link 
                href="/products" 
                className="hover:text-[#2d4e24] transition-colors flex-shrink-0"
              >
                Products
              </Link>
              {serializedProduct.category && (
                <>
                  <FiChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <Link 
                    href={`/products?category=${serializedProduct.category.slug}`} 
                    className="hover:text-[#2d4e24] transition-colors flex-shrink-0"
                  >
                    {serializedProduct.category.name}
                  </Link>
                </>
              )}
              <FiChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
                {serializedProduct.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Product Container */}
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Top Section: Gallery (Col 7) + Buy Box (Col 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-10 items-start">
            <div className="lg:col-span-7">
              <ProductImages 
                images={serializedProduct.images || []} 
                title={serializedProduct.title}
                customBadge={serializedProduct.customBadge}
              />
            </div>

            <div className="lg:col-span-5">
              <ProductInfo product={serializedProduct} />
            </div>
          </div>

          {/* Botanical Science & Daily Ritual Section */}
          <div className="mb-10">
            <ProductTabs
              product={serializedProduct}
              description={serializedProduct.description || ''}
              ingredients={serializedProduct.ingredients || ''}
              specifications={serializedProduct.specifications || {}}
              keyActives={serializedProduct.keyActives || []}
              howToUseSteps={serializedProduct.howToUseSteps || []}
              usageTiming={serializedProduct.usageTiming || []}
              precautions={serializedProduct.precautions}
              faqs={serializedProduct.faqs || []}
              skinTypes={serializedProduct.skinTypes || []}
              skinConcerns={serializedProduct.skinConcerns || []}
              trustBadges={serializedProduct.trustBadges || []}
            />
          </div>

          {/* Customer Reviews Section */}
          <div className="mb-10">
            <ReviewSection
              productId={serializedProduct._id}
              reviews={serializedReviews}
              ratingAvg={serializedProduct.ratingAvg || 4.9}
              reviewCount={serializedProduct.reviewCount || (serializedReviews.length > 0 ? serializedReviews.length : 128)}
            />
          </div>

          {/* Complete the Ritual / Related Products */}
          {serializedRelatedProducts.length > 0 && (
            <div className="pt-10 pb-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2d4e24] bg-[#F2F7EF] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/15 inline-block mb-1.5">
                    Complete The Ritual
                  </span>
                  <h2 className="text-xl sm:text-2xl  font-bold text-gray-900 tracking-tight">
                    Pairs Beautifully With
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Complementary botanical formulations to elevate your daily Ayurvedic regimen.
                  </p>
                </div>
                {serializedProduct.category && (
                  <Link 
                    href={`/products?category=${serializedProduct.category.slug}`}
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#2d4e24] hover:text-[#1e3418] transition-colors group"
                  >
                    View All
                    <FiChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
              <ProductGrid products={serializedRelatedProducts} />
            </div>
          )}
        </div>

        {/* Global Luxury Trust Strip */}
        <div className="bg-[#2d4e24] text-white py-10 border-t border-[#233d1c]">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">100% Ayurvedic</h3>
                  <p className="text-[11px] text-white/70 mt-0.5">Potent cold-pressed botanicals</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">AYUSH GMP Certified</h3>
                  <p className="text-[11px] text-white/70 mt-0.5">Rigorous pharmaceutical testing</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                  <FiTruck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">Free Express Shipping</h3>
                  <p className="text-[11px] text-white/70 mt-0.5">All India delivery on ₹499+</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                  <FiRefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">7-Day Easy Returns</h3>
                  <p className="text-[11px] text-white/70 mt-0.5">Hassle-free guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Floating Buy Bar */}
        <MobileStickyBar product={serializedProduct} />
      </div>
    );
  } catch (error) {
    console.error('Product page error:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    await connectDB();
    
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    const product = await Product.findOne({ slug: slug })
      .populate('category')
      .lean();

    if (!product) {
      return {
        title: 'Product Not Found | Nature Medica',
        description: 'The product you are looking for could not be found.'
      };
    }

    const categoryName = product.category?.name || 'Products';
    const description = product.description?.substring(0, 160) || `Buy ${product.title} online at Nature Medica`;

    return {
      title: `${product.title} - ${categoryName} | Nature Medica`,
      description: description,
      keywords: `${product.title}, ${categoryName}, ayurvedic, natural products, wellness`,
      openGraph: {
        title: product.title,
        description: description,
        images: product.images?.[0]?.url ? [{ 
          url: product.images[0].url,
          width: 800,
          height: 800,
          alt: product.title
        }] : [],
        type: 'website',
        siteName: 'Nature Medica',
        locale: 'en_IN'
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: description,
        images: product.images?.[0]?.url ? [product.images[0].url] : []
      },
      alternates: {
        canonical: `/products/${slug}`
      }
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Nature Medica',
      description: 'Premium Ayurvedic and Natural Wellness Products'
    };
  }
}
