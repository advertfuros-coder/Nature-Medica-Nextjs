"use client"
import { Check, ShoppingBag, DollarSign } from 'lucide-react';
import Image from 'next/image';
import serum from "@/assets/serum.png"
export default function WellnessSection() {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Left Content */}
        <div className="lg:col-span-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-green-900 leading-tight mb-3">
            INSPIRED BY NATURE,<br />
            DRIVEN BY WELLNESS
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Blending nature's purity with Ayurveda to create holistic wellness solutions.
          </p>
          
          <div className="space-y-2 mb-5">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-gray-700">100% Ayurvedic and natural ingredients.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-gray-700">Safe, chemical-free, and skin-friendly.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-gray-700">Promotes holistic health and wellness.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-gray-700">Inspired by nature for daily nourishment.</p>
            </div>
          </div>
          
          <button className="bg-green-800 hover:bg-green-900 text-white text-xs sm:text-sm font-semisemibold px-5 py-2 rounded transition-colors duration-300">
            Explorer Our Product
          </button>
        </div>
        
        {/* Center - Product Image */}
        <div className="lg:col-span-1 flex justify-center my-6 lg:my-0">
          <div className="relative h-80 w-80 -my-10 ">
            <Image 
              src={serum}
              alt="24K Gold Face Serum" 
              fill
              className="object-contain animate-[float-slow_10s_ease-in-out_infinite]"
            />
          </div>
        </div>
        
        {/* Right Content - Features */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-start gap-3">
            <div className="bg-green-800 rounded-full p-2.5 flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                100% Ayurvedic Formulas
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Crafted from pure, natural ingredients.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-800 rounded-full p-2.5 flex-shrink-0">
              <DollarSign className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Sustainable Wellness
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Inspired by nature, made for everyday nourishment.
              </p>
            </div>
          </div>
        </div>
        
      </div>
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) scale(1) rotate(0deg);
            animation-timing-function: ease-in-out;
          }
          25% {
            transform: translateY(-10px) scale(1.05) rotate(2deg);
            animation-timing-function: ease-in-out;
          }
          50% {
            transform: translateY(-15px) scale(1.1) rotate(-2deg);
            animation-timing-function: ease-in-out;
          }
          75% {
            transform: translateY(-10px) scale(1.05) rotate(2deg);
            animation-timing-function: ease-in-out;
          }
        }
      `}</style>
    </section>
  );
}
