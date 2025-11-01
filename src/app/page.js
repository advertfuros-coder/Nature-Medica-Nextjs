import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import Product from "@/models/Product";
import Category from "@/models/Category";
import HeroBanner from "@/components/customer/HeroBanner";
import CategorySection from "@/components/customer/CategorySection";
import BestSellerSectionWrapper from "@/components/customer/BestSellerSectionWrapper";
import NewArrivalSectionWrapper from "@/components/customer/NewArrivalSectionWrapper";
import FeaturedSectionWrapper from "@/components/customer/FeaturedSectionWrapper";
import FAQ from "@/components/customer/FAQ";
import ReviewSection from "@/components/customer/ReviewSection";
import WhyChooseNatureMedica from "@/components/customer/WhyChooseNatureMedica";
import TrustedBySection from "@/components/customer/TrustedBySection";
import CustomerReviews from "@/components/customer/CustomerReviews";
import Link from "next/link";
import HomeBlogCarousel from "@/components/customer/HomeBlogCarousel";

export default async function HomePage() {
  await connectDB();

  const homeBanners = await Banner.find({ type: "home", active: true })
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
    .populate("category")
    .lean();

  const hotsellingProducts = await Product.find({ visibility: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("category")
    .lean();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative">
        <HeroBanner banners={JSON.parse(JSON.stringify(homeBanners))} />
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight mb-1">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Explore our curated selection of natural health products
          </p>
        </div>
        <CategorySection categories={JSON.parse(JSON.stringify(categories))} />
      </section>
      <BestSellerSectionWrapper />
      <NewArrivalSectionWrapper />
      <FeaturedSectionWrapper />

      {/* Why Choose Section */}
      <WhyChooseNatureMedica
        categories={JSON.parse(JSON.stringify(categories))}
      />

      {/* Trusted By Section */}
      <section className="py-8 lg:py-12 bg-white border-y border-gray-100">
        <TrustedBySection />
      </section>

      {/* Customer Reviews */}
      <section className="py-8 lg:py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CustomerReviews />
        </div>
      </section>

      {/* <HomeBlogCarousel/> */}


      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight mb-1">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Everything you need to know about our products and services
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <FAQ products={JSON.parse(JSON.stringify(hotsellingProducts))} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#415f2d] to-[#344b24] py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl lg:text-2xl font-semibold text-white mb-1">
              Start Your Wellness Journey Today
            </h2>
            <p className="text-white text-sm mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of satisfied customers who trust NatureMedica for
              their health needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#415f2d] px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Shop Now
                <svg
                  className="w-5 h-5"
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
              <a
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl hover:bg-white hover:text-[#415f2d] transition-all duration-300 font-semibold text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
