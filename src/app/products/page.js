import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductList from "@/components/customer/ProductList";
import ProductsToolbar from "@/components/customer/ProductsToolbar";
import ClinicalTrustRibbon from "@/components/customer/ClinicalTrustRibbon";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  // Main catalog excludes exclusive 1-click cart bump items (Toothbrush, Toothpaste bump, Lip Balm)
  let query = { 
    visibility: true,
    isCartBumpOnly: { $ne: true },
    tags: { $nin: ['cart-bump-only', 'upsell-only'] }
  };
  let selectedCategory = null;

  // Category filter
  if (searchParams.category) {
    const category = await Category.findOne({ slug: searchParams.category });
    if (category) {
      query.category = category._id;
      selectedCategory = category;
    }
  }

  // Enhanced Search filter
  // Only apply search when NO category is selected (to avoid confusing filters)
  // If user selects a category, they see ALL products in that category
  if (searchParams.search && !searchParams.category) {
    const searchTerm = searchParams.search.trim();
    
    // Use regex search across multiple fields for partial matching
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
      { ingredients: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  // Sort
  let sort = { createdAt: -1 };
  if (searchParams.sort === "price-asc") sort = { price: 1 };
  if (searchParams.sort === "price-desc") sort = { price: -1 };
  if (searchParams.sort === "rating") sort = { ratingAvg: -1 };
  if (searchParams.sort === "bestseller") sort = { reviewCount: -1 };

  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("category")
    .lean();

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  // Get all active categories
  const allCategories = await Category.find({ active: true }).lean();

  // Filter categories to only include those with at least one visible product
  const categoriesWithProducts = await Promise.all(
    allCategories.map(async (category) => {
      const productCount = await Product.countDocuments({
        category: category._id,
        visibility: true,
      });
      return productCount > 0 ? category : null;
    })
  );

  // Remove null entries (categories with no products)
  const categories = categoriesWithProducts.filter((cat) => cat !== null);

  // Generate page title and description
  const pageTitle = selectedCategory
    ? `${selectedCategory.name} - Natural Wellness Products`
    : searchParams.search
    ? `Search Results for "${searchParams.search}"`
    : "All Products - Natural Wellness Solutions";

  const pageDescription = selectedCategory
    ? selectedCategory.description ||
      `Explore our collection of natural ${selectedCategory.name.toLowerCase()} products`
    : "Discover our complete range of natural wellness and Ayurvedic products";

  const heading = selectedCategory
    ? selectedCategory.name
    : searchParams.search
    ? `Results for "${searchParams.search}"`
    : "All Products";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero band */}
      <section className="bg-gradient-to-b from-green-50/60 to-white">
        <div className="px-4 sm:px-6 lg:px-10 pt-5 pb-6 sm:pb-8">
          {/* Breadcrumbs */}
          <nav className="mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="flex items-center text-gray-500 hover:text-[#2d4e24] transition-colors" aria-label="Home">
                  <Home className="w-4 h-4" />
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  href="/products"
                  className={!selectedCategory ? "text-[#2d4e24] font-semibold" : "text-gray-500 hover:text-[#2d4e24] transition-colors"}
                >
                  Products
                </Link>
              </li>
              {selectedCategory && (
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-[#2d4e24] font-semibold">{selectedCategory.name}</span>
                </li>
              )}
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">{heading}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5 max-w-2xl">{pageDescription}</p>
        </div>
      </section>

      <ClinicalTrustRibbon />

      <ProductsToolbar
        categories={JSON.parse(JSON.stringify(categories))}
        totalProducts={totalProducts}
      />

      <div className="px-4 sm:px-6 lg:px-10 pb-12">
        <ProductList
          products={JSON.parse(JSON.stringify(products))}
          currentPage={page}
          totalPages={totalPages}
          totalProducts={totalProducts}
        />
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  await connectDB();

  let title = "Natural Wellness Products | Nature Medica";
  let description =
    "Explore our complete range of natural wellness and Ayurvedic products";

  if (searchParams.category) {
    const category = await Category.findOne({ slug: searchParams.category });
    if (category) {
      title = `${category.name} - Natural Wellness Products | Nature Medica`;
      description =
        category.description ||
        `Shop natural ${category.name.toLowerCase()} products at Nature Medica`;
    }
  }

  if (searchParams.search) {
    title = `Search: ${searchParams.search} | Nature Medica`;
    description = `Search results for "${searchParams.search}" - Natural wellness products`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}
