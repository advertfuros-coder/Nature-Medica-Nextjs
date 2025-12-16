"use client";

import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
    return (
        <section className="relative w-full group max-w-7xl mx-auto">
            <div className="relative w-full md:h-[90vh] h-[30vh]">
                {/* Background Image */}
                <Image
                    src="/3.jpg"
                    alt="Nature Medica Promotion"
                    fill
                    className="object-cover h-full object-center"
                    priority={false}
                    sizes="100vw"
                />

                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 md:bg-gradient-to-r md:from-black/40 md:via-black/20 md:to-transparent pointer-events-none"></div>

                {/* Decorative Elements - Behind content */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-tr from-[#2d4a22]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                {/* Content Container */}
                <div className="absolute inset-0 flex items-end md:items-center pb-12 sm:pb-16 md:pb-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
                        <div className="max-w-xl">
                            {/* Optional: Add text content here if needed */}
                            {/* <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
                Discover Natural Wellness
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8">
                Premium Ayurvedic products for your health
              </p> */}

                            {/* Shop Now Button */}
                            <Link href="/products" className="relative inline-block z-20">
                                <button className="px-5 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 bg-white text-[#2d4a22] font-bold text-xs sm:text-sm md:text-base rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 flex items-center gap-2 sm:gap-3 group-hover:gap-4 hover:bg-[#2d4a22] hover:text-white border-2 border-transparent hover:border-white">
                                    Shop Now
                                    <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
