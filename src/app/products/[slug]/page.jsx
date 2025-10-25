import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { notFound } from 'next/navigation';
import ProductImages from '@/components/customer/ProductImages';
import ProductInfo from '@/components/customer/ProductInfo';
import ProductTabs from '@/components/customer/ProductTabs';
import ReviewSection from '@/components/customer/ReviewSection';
import ProductGrid from '@/components/customer/ProductGrid';

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
    .limit(4)
    .lean();

  // Serialize all data properly
  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedReviews = JSON.parse(JSON.stringify(reviews));
  const serializedRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-gray-600">
            <li><a href="/" className="hover:text-green-600">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-green-600">Products</a></li>
            <li>/</li>
            <li><a href={`/products?category=${product.category.slug}`} className="hover:text-green-600">
              {product.category.name}
            </a></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">{product.title}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <ProductImages 
            images={serializedProduct.images} 
            title={serializedProduct.title} 
          />
          <ProductInfo product={serializedProduct} />
        </div>

        {/* Product Details Tabs */}
        <ProductTabs
          description={serializedProduct.description}
          ingredients={serializedProduct.ingredients}
          specifications={serializedProduct.specifications}
        />

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewSection
            productId={serializedProduct._id}
            reviews={serializedReviews}
            ratingAvg={serializedProduct.ratingAvg}
            reviewCount={serializedProduct.reviewCount}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <ProductGrid products={serializedRelatedProducts} />
          </div>
        )}
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
