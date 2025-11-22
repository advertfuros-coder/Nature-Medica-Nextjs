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

      <CategoryGrid/>

      <BrandMarquee />

      <WellnessGoalCarousel />

      {/* Shop by Category */}

      <BestSellerSectionWrapper />
      <FacewashSection />

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
