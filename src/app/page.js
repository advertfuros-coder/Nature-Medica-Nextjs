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
import TrustBadgesSection from "@/components/customer/TrustBadgesSection";
import PromoBanner from "@/components/customer/PromoBanner";
import SnowfallWrapper from "@/components/customer/SnowfallWrapper";

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
    <main className="min-h-screen bg-white relative">
    
    

      {/* Hero Banner */}
      <section className="relative">
        <HeroBanner banners={JSON.parse(JSON.stringify(homeBanners))} />
      </section>

            <BrandMarquee />


      <CategoryGrid />

      {/* <TrustBadgesSection /> */}


      {/* <WellnessGoalCarousel /> */}

      {/* Shop by Category */}

      <BestSellerSectionWrapper />
      {/* <FacewashSection /> */}
      {/* <PromoBanner /> */}
            <LearnWellness />


      <NewArrivalSectionWrapper />
      <FeaturedSectionWrapper />

      {/* <WellnessSection /> */}

      {/* Why Choose Section */}
      {/* <WhyChooseNatureMedica
        categories={JSON.parse(JSON.stringify(categories))}
      /> */}

      {/* Trusted By Section */}
      <section className=" bg-white border-y border-gray-100">
        <TrustedBySection />
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />


      {/* <HomeBlogCarousel/> */}
      {/* <InfoStrip /> */}

      {/* Product Banner */}
      <section className="relative w-full overflow-hidden group  ">
        <div className="relative w-full h-[200px] lg:h-[600px]  ">
          <img
            src="/2027/image.png"
            alt="Nature Medica Products"
            className="w-full h-full object-contain"
          />
 
        </div>
      </section>

      {/* FAQ Section */}
      <section className=" ">
        <div className="  mx-auto">
          <FAQ products={JSON.parse(JSON.stringify(hotsellingProducts))} />
        </div>
      </section>

      {/* <CTASection/> */}
    </main>
  );
}
