import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import Product from "@/models/Product";
import Category from "@/models/Category";
import HeroBanner from "@/components/customer/HeroBanner";
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
import ChristmasPromoBanner from "@/components/customer/ChristmasPromoBanner";
import WellnessGoalCarousel from "@/components/customer/WellnessGoalCarousel";
import CTASection from "@/components/customer/CTASection";
import BrandMarquee from "@/components/customer/BrandMarquee";
import FacewashSection from "@/components/customer/FacewashSection";
import WellnessSection from "@/components/customer/WellnessSection";
import LearnWellness from "@/components/customer/LearnWellness";
import InfoStrip from "@/components/customer/InfoStrip";
import PromoStripSimple from "@/components/customer/PromoStripSimple";
import CategoryGrid from "@/components/customer/CategoryGrid";
import NewsletterPopup from "@/components/customer/NewsletterPopup";
import TrustBadgesSection from "@/components/customer/TrustBadgesSection";
import PromoBanner from "@/components/customer/PromoBanner";

// Force dynamic rendering to avoid build-time DB queries
export const dynamic = "force-dynamic";

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

      <CategoryGrid />


      {/* <TrustBadgesSection /> */}

      <BrandMarquee />

      <WellnessGoalCarousel />

      {/* Shop by Category */}

      <BestSellerSectionWrapper />
      {/* <FacewashSection /> */}
      <PromoBanner />

      <NewArrivalSectionWrapper />
      <FeaturedSectionWrapper />

      <WellnessSection />

      {/* Why Choose Section */}
      {/* <WhyChooseNatureMedica
        categories={JSON.parse(JSON.stringify(categories))}
      /> */}

      {/* Trusted By Section */}
      <section className=" bg-white border-y border-gray-100">
        <TrustedBySection />
      </section>

      {/* Customer Reviews */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CustomerReviews />
        </div>
      </section>

      {/* <HomeBlogCarousel/> */}
      <LearnWellness />
      <InfoStrip />

      {/* Product Banner */}
      <section className="relative w-full overflow-hidden group  ">
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
          <img
            src="/nature-medica-producsts-banner.jpg"
            alt="Nature Medica Products"
            className="w-full h-full object-contain"
          />

          {/* Shop Now Button - Left Bottom */}
          <Link href="/products">
            <button className="absolute bottom-6 left-6 md:bottom-12 md:left-12 px-6 md:px-8 py-3 md:py-4 bg-white text-[#415f2d] font-semibold text-sm md:text-base rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center gap-2 group-hover:gap-3">
              Shop Now
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className=" ">
        <div className="max-w-3xl mx-auto">
          <FAQ products={JSON.parse(JSON.stringify(hotsellingProducts))} />
        </div>
      </section>

      {/* <CTASection/> */}
    </main>
  );
}
