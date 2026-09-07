'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const reviewsData = [
  {
    id: 1,
    name: 'MEGHA PARASHAR',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Just Love It!',
    review: "I've been using Nature Medica Glutathione Foaming Face Wash for 6 months now. It's lightweight, non-drying, and removes all dullness with an instant dewy glow. A must-buy!",
    productName: 'Glutathione Foaming Face Wash',
    productImage: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788354406/naturemedica/products/kfhqkyk2nj3uzgn5on23.jpg',
    productLink: '/products/nature-medica-glutathione-brightening-foaming-facewash-120ml',
    recommendedBy: 'Megha'
  },
  {
    id: 2,
    name: 'RESHMA SATHEESH',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Blends In No Time',
    review: 'This is my third bottle of 24K Gold Face Serum. Absorbs instantly into the skin, deeply hydrating with zero sticky feeling. My skin texture feels velvet smooth... just love it!',
    productName: '24K Gold Face Serum - 30ml',
    productImage: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788354339/naturemedica/products/cp8rszebcdyis74noisx.jpg',
    productLink: '/products/24k-gold-face-serum-30ml',
    recommendedBy: 'Reshma'
  },
  {
    id: 3,
    name: 'MUSKAN CHOWDHURY',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'No More Dry Skin',
    review: 'The Aloe Vera Hydrating Night Gel calms and protects my skin barrier while deeply moisturizing overnight. It also soothes all redness and dry patches completely.',
    productName: 'Aloe Vera Hydrating Night Face Gel',
    productImage: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788354458/naturemedica/products/hy6zihwujtus1f4sfeqp.jpg',
    productLink: '/products/aloe-vera-hydrating-night-face-gel-100g',
    recommendedBy: 'Muskan'
  },
  {
    id: 4,
    name: 'SONALI SHARMA',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'It Actually Works!',
    review: 'I have been using Green Apple Cold Cream for almost 3 months now. It feels so lightweight, non-greasy, and keeps my skin supple and brightened all day long.',
    productName: 'Green Apple Moisturizing Cold Cream',
    productImage: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1764666741/naturemedica/products/rb16cflr9j3hqxmycs1t.jpg',
    productLink: '/products/green-apple-moisturizing-cold-cream-100gm',
    recommendedBy: 'Sonali'
  },
  {
    id: 5,
    name: 'PRIYA PATEL',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Authentic Ayurvedic Purity',
    review: 'The Pure Shilajit Resin gave me noticeable stamina and energy boost within 10 days. 100% authentic and lab-tested quality. Highly impressed with Nature Medica!',
    productName: 'Nature Medica Pure Shilajit Resin',
    productImage: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1763870995/naturemedica/products/yy38nxibxzzh7begygdm.jpg',
    productLink: '/products/nature-medica-pure-shilajit-resin-20g',
    recommendedBy: 'Priya'
  },
  {
    id: 6,
    name: 'ANANYA DESHMUKH',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Softest Skin Ever!',
    review: 'The Mango Cold Cream smells divine and leaves the skin feeling baby-soft without clogging pores. Even my sensitive skin loves this completely natural formula.',
    productName: 'Mango Moisturizing Cold Cream',
    productImage: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788354531/naturemedica/products/elrtj4ni5pexirzyxxin.jpg',
    productLink: '/products/mango-moisturizing-cold-cream-100gm',
    recommendedBy: 'Ananya'
  }
];

export default function CustomerReviews() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 300);
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-white">
      <div className="  mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching homepage components */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-lg sm:text-xl   font-bold text-gray-900 tracking-tight">
              Love That Keeps Us Going
            </h2>
            <p className="text-gray-600 text-[12px] sm:text-[13px] mt-0.5">
              Real experiences and transformations from verified buyers
            </p>
          </div>
          
          {/* Desktop Navigation Arrows matching NewArrivals & Bestsellers style */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-full border-2 transition-all ${
                canScrollLeft 
                  ? 'border-[#2d4e24] text-[#2d4e24] hover:bg-[#2d4e24] hover:text-white shadow-xs cursor-pointer active:scale-95' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-60'
              }`}
              aria-label="Previous review"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-full border-2 transition-all ${
                canScrollRight 
                  ? 'border-[#2d4e24] text-[#2d4e24] hover:bg-[#2d4e24] hover:text-white shadow-xs cursor-pointer active:scale-95' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-60'
              }`}
              aria-label="Next review"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reviews Carousel Container */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="w-[280px] sm:w-[310px] md:w-[330px] shrink-0 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between snap-start"
            >
              <div>
                {/* Top Profile Header (Avatar + Name + Verified Badge) */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-2xs bg-gray-100">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-xs sm:text-[13px] text-gray-900 tracking-wide uppercase truncate">
                        {review.name}
                      </h3>
                      {review.verified && (
                        <svg className="w-3.5 h-3.5 text-[#1877F2] shrink-0 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5 Bright Green Rating Stars */}
                <div className="flex items-center gap-1 mb-2.5 text-[#6db62f]">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review Headline & Body */}
                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-1.5 leading-snug">
                  {review.title}
                </h4>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal mb-5 line-clamp-4">
                  {review.review}
                </p>
              </div>

              {/* Bottom Recommended Product Pill */}
              <Link
                href={review.productLink}
                className="pt-3.5 border-t border-gray-100 flex items-center gap-3 group/prod mt-auto cursor-pointer"
              >
                <div className="relative w-11 h-11 rounded-xl bg-[#FFF9F2] p-1 shrink-0 border border-amber-100/70 shadow-2xs flex items-center justify-center overflow-hidden">
                  <Image
                    src={review.productImage}
                    alt={review.productName}
                    width={38}
                    height={38}
                    className="object-contain w-full h-full transform group-hover/prod:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-800 font-medium truncate mb-0.5">
                    {review.recommendedBy} Recommends This Product
                  </p>
                  <span className="text-[11px] font-bold text-[#E11D48] tracking-wider flex items-center gap-0.5 group-hover/prod:translate-x-1 transition-transform">
                    SHOP NOW &gt;&gt;
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Dots / Swipe Hint */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 mt-3">
          <span className="text-[11px] text-gray-400 font-medium">← Swipe to explore more reviews →</span>
        </div>

      </div>
    </section>
  );
}


