import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductList from "@/components/customer/ProductList";
import FilterSidebar from "@/components/customer/FilterSidebar";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default async function ProductsPage({ searchParams }) {
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  let query = { visibility: true };
  let selectedCategory = null;

  // Category filter
  if (searchParams.category) {
    const category = await Category.findOne({ slug: searchParams.category });
    if (category) {
      query.category = category._id;
      selectedCategory = category;
    }
  }

  // Search filter
  if (searchParams.search) {
    query.$text = { $search: searchParams.search };
  }

  // Sort
  let sort = { createdAt: -1 };
  if (searchParams.sort === "price-asc") sort = { price: 1 };
  if (searchParams.sort === "price-desc") sort = { price: -1 };
  if (searchParams.sort === "rating") sort = { ratingAvg: -1 };

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {/* Breadcrumbs */}
        <nav className="mb-4 lg:mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="flex items-center text-gray-500 hover:text-[#4D6F36] transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                href="/products"
                className={`ml-2 ${
                  !selectedCategory
                    ? "text-[#4D6F36] font-semibold"
                    : "text-gray-500 hover:text-[#4D6F36]"
                } transition-colors`}
              >
                Products
              </Link>
            </li>
            {selectedCategory && (
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-2 text-[#4D6F36] font-semibold">
                  {selectedCategory.name}
                </span>
              </li>
            )}
          </ol>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {/* Sidebar - Hidden on mobile, shows as drawer */}
          <aside className="lg:col-span-1">
            <FilterSidebar
              categories={JSON.parse(JSON.stringify(categories))}
              currentFilters={searchParams}
            />
          </aside>

          {/* Main Product Grid */}
          <main className="lg:col-span-3">
            <ProductList
              products={JSON.parse(JSON.stringify(products))}
              currentPage={page}
              totalPages={totalPages}
              totalProducts={totalProducts}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }) {
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
