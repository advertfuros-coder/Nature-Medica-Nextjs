import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImages from '@/components/customer/ProductImages';
import ProductInfo from '@/components/customer/ProductInfo';
import ProductTabs from '@/components/customer/ProductTabs';
import ReviewSection from '@/components/customer/ReviewSection';
import ProductGrid from '@/components/customer/ProductGrid';
import { FiHome, FiChevronRight } from 'react-icons/fi';

export default async function ProductDetailPage({ params }) {
  await connectDB();

  const product = await Product.findOne({ slug: params.slug })
    .populate('category')
    .lean();

  if (!product) {
    notFound();
  }

  // Get reviews for this product
  const reviews = await Review.find({ 
    product: product._id, 
    approved: true 
  })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Get related products (same category)
  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    visibility: true
  })
    .limit(8)
    .lean();

  // Serialize all data properly
  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedReviews = JSON.parse(JSON.stringify(reviews));
  const serializedRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs">
            <Link href="/" className="text-gray-500 hover:text-[#415f2d] transition-colors flex items-center gap-1 text-[11px]">
              <FiHome className="w-3.5 h-3.5" />
              Home
            </Link>
            <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/products" className="text-gray-500 hover:text-[#415f2d] transition-colors text-[11px]">
              Products
            </Link>
            <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
            {/* <Link 
              href={`/products?category=${product.category.slug}`} 
              className="text-gray-500 hover:text-[#415f2d] transition-colors text-[11px]"
            >
              {product.category.name}
            </Link>
            <FiChevronRight className="w-3.5 h-3.5 text-gray-400" /> */}
            <span className="text-gray-900 font-medium line-clamp-1 text-[11px]">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-1">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
          <ProductImages 
            images={serializedProduct.images} 
            title={serializedProduct.title} 
          />
          <ProductInfo product={serializedProduct} />
        </div>

        {/* Product Details Tabs */}
        <div className="mb-6">
          <ProductTabs
            description={serializedProduct.description}
            ingredients={serializedProduct.ingredients}
            specifications={serializedProduct.specifications}
          />
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <ReviewSection
            productId={serializedProduct._id}
            reviews={serializedReviews}
            ratingAvg={serializedProduct.ratingAvg}
            reviewCount={serializedProduct.reviewCount}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight mb-2">
                  You May Also Like
                </h2>
                <p className="text-gray-600">
                  Similar products from {product.category.name}
                </p>
              </div>
              <Link 
                href={`/products?category=${product.category.slug}`}
                className="hidden sm:inline-flex items-center gap-2 text-[#415f2d] hover:text-[#344b24] font-medium transition-colors group"
              >
                View All
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ProductGrid products={serializedRelatedProducts} />
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="bg-gradient-to-br from-[#415f2d] to-[#344b24] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white opacity-90">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-sm font-semibold mb-1 leading-tight">100% Authentic</h3>
              <p className="text-[12px] opacity-80 leading-tight">Guaranteed genuine products</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-sm font-semibold mb-1 leading-tight">Free Shipping</h3>
              <p className="text-[12px] opacity-80 leading-tight">On orders above ₹999</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <h3 className="text-sm font-semibold mb-1 leading-tight">Easy Returns</h3>
              <p className="text-[12px] opacity-80 leading-tight">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  await connectDB();
  
  const product = await Product.findOne({ slug: params.slug }).lean();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} - NatureMedica`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.images[0]?.url],
    },
  };
}
