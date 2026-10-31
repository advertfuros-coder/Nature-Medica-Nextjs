import Link from 'next/link';
import { Sparkles, Zap, Scissors, ShieldPlus, Leaf } from 'lucide-react';

const concerns = [
  { title: 'Pigmentation & Glow', href: '/products?category=face-wash', icon: Sparkles },
  { title: 'Stamina & Energy', href: '/products?category=men-s-wellness', icon: Zap },
  { title: 'Piles Relief', href: '/products?search=piles', icon: Leaf },
  { title: 'Hair Fall', href: '/products?category=shampoo', icon: Scissors },
  { title: 'Immunity', href: '/products?category=effervescent-tablets', icon: ShieldPlus },
];

export default function ShopByConcern() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shop by Concern</h2>
          <p className="text-sm text-gray-600">Start with what you want to improve</p>
        </div>

        <div className="flex justify-start sm:justify-center gap-5 sm:gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {concerns.map(({ title, href, icon: Icon }) => (
            <Link key={title} href={href} className="group flex flex-col items-center gap-2.5 flex-shrink-0 w-20 sm:w-28">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#f4f7f2] text-[#2d4e24] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-center group-hover:bg-[#2d4e24] group-hover:text-white group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
                <Icon className="w-6 h-6 sm:w-9 sm:h-9" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-bold text-gray-900 text-center leading-snug">{title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
