import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import Category from '@/models/Category';
import User from '@/models/User'; // Add this import
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImages from '@/components/customer/ProductImages';
import ProductInfo from '@/components/customer/ProductInfo';
import ProductTabs from '@/components/customer/ProductTabs';
import ReviewSection from '@/components/customer/ReviewSection';
import ProductGrid from '@/components/customer/ProductGrid';
import { FiHome, FiChevronRight } from 'react-icons/fi';

// Add this to make it dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  try {
    await connectDB();

    // Await params (Next.js 15 requirement)
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
          .limit(8)
          .lean()
      : [];

    // Serialize all data
    const serializedProduct = JSON.parse(JSON.stringify(product));
    const serializedReviews = JSON.parse(JSON.stringify(reviews));
    const serializedRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

    return (
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-xs">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-[#415f2d] transition-colors flex items-center gap-1 text-[11px]"
              >
                <FiHome className="w-3.5 h-3.5" />
                Home
              </Link>
              <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <Link 
                href="/products" 
                className="text-gray-500 hover:text-[#415f2d] transition-colors text-[11px]"
              >
                Products
              </Link>
              {serializedProduct.category && (
                <>
                  <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <Link 
                    href={`/products?category=${serializedProduct.category.slug}`} 
                    className="text-gray-500 hover:text-[#415f2d] transition-colors text-[11px]"
                  >
                    {serializedProduct.category.name}
                  </Link>
                </>
              )}
              <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-900 font-medium line-clamp-1 text-[11px]">
                {serializedProduct.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            <ProductImages 
              images={serializedProduct.images || []} 
              title={serializedProduct.title} 
            />
            <ProductInfo product={serializedProduct} />
          </div>

          {/* Product Details Tabs */}
          <div className="mb-12">
            <ProductTabs
              description={serializedProduct.description || ''}
              ingredients={serializedProduct.ingredients || []}
              specifications={serializedProduct.specifications || {}}
            />
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <ReviewSection
              productId={serializedProduct._id}
              reviews={serializedReviews}
              ratingAvg={serializedProduct.ratingAvg || 0}
              reviewCount={serializedProduct.reviewCount || 0}
            />
          </div>

          {/* Related Products */}
          {serializedRelatedProducts.length > 0 && serializedProduct.category && (
            <div className="py-12 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight mb-2">
                    You May Also Like
                  </h2>
                  <p className="text-gray-600">
                    Similar products from {serializedProduct.category.name}
                  </p>
                </div>
                <Link 
                  href={`/products?category=${serializedProduct.category.slug}`}
                  className="hidden sm:inline-flex items-center gap-2 text-[#415f2d] hover:text-[#344b24] font-medium transition-colors group"
                >
                  View All
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
              </div>
              <ProductGrid products={serializedRelatedProducts} />
            </div>
          )}
        </div>

        {/* Trust Section */}
        <div className="bg-gradient-to-br from-[#415f2d] to-[#344b24] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">100% Authentic</h3>
                <p className="text-sm opacity-90">Guaranteed genuine products</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
                <p className="text-sm opacity-90">On orders above ₹499</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
                <p className="text-sm opacity-90">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>
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
    const price = product.salePrice || product.price;

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
        type: 'website', // Changed from 'product' to 'website'
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

