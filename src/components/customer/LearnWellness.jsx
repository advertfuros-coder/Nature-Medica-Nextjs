'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'Energy',
    description: 'Fatigue-supporting products & advice to help you get through the day',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Immunity',
    description: 'Keep everyone protected with science-backed support',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Gut health',
    description: 'Support to help you maintain a happy & healthy gut',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: "Women's health",
    description: 'Keep track of your cycles and hormone health',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop',
  },
];

export default function LearnWellnessOverlay() {
  const duplicatedCategories = [...categories, ...categories];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Learn about wellness
        </h2>

        <div className="overflow-hidden">
          <div className="flex  animate-marquee">
            {duplicatedCategories.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="group cursor-pointer relative h-64 rounded-xl overflow-hidden flex-shrink-0 w-64 mr-4"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-[14px] font-semibold mb-1">
                    {category.title}
                  </h3>
                  <p className="text-[10px] text-white/90 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
