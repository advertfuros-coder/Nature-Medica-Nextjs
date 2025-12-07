"use client";

import { Shield, Award, Leaf, Heart, TruckIcon, Package } from 'lucide-react';

export default function TrustBadgesSection() {
    const badges = [
        {
            icon: Leaf,
            title: "100% Natural",
            description: "Pure botanical extracts"
        },
        {
            icon: Shield,
            title: "Lab Tested",
            description: "Quality guaranteed"
        },
        {
            icon: Award,
            title: "Certified Organic",
            description: "No harmful chemicals"
        },
        {
            icon: Heart,
            title: "5000+ Happy Customers",
            description: "Join our wellness family"
        },
        {
            icon: TruckIcon,
            title: "Fast Delivery",
            description: "Pan-India shipping"
        },
        {
            icon: Package,
            title: "COD Available",
            description: "Pay on delivery option"
        }
    ];

    return (
        <section className="py-12 bg-gradient-to-b from-white to-green-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Why Choose Nature Medica?
                    </h2>
                    <p className="text-gray-600">
                        Trusted by thousands for genuine wellness solutions
                    </p>
                </div>

                {/* Trust Badges Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-green-100 hover:border-[#4D6F36] hover:shadow-md transition-all duration-300 group"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3 group-hover:bg-[#4D6F36] transition-colors">
                                    <Icon className="w-6 h-6 text-[#4D6F36] group-hover:text-white transition-colors" />
                                </div>

                                {/* Title */}
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                    {badge.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-gray-600">
                                    {badge.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 flex flex-wrap justify-center items-center gap-8 text-center">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className="w-5 h-5 text-yellow-400 fill-current"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                            4.8 from 2,000+ reviews
                        </span>
                    </div>

                    <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">
                            100% Secure Checkout
                        </span>
                    </div>

                    <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">
                            Certified & Verified Products
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
