import { Package, Clock, Leaf, Award, FlaskConical, Heart } from 'lucide-react';

// Icon-led "at a glance" row for the product page, built from the product's own fields
export default function PdpHighlightStrip({ product = {} }) {
  // Shelf life is free text on some products ("17 months from the manufacturing date...")
  const months = /(\d+)\s*months?/i.exec(product.shelfLife || '');
  const shelfLife = months ? `${months[1]} Months` : (product.shelfLife || '').slice(0, 24);

  const items = [
    product.netQuantity && { icon: Package, value: product.netQuantity, label: 'Pack size' },
    shelfLife && { icon: Clock, value: shelfLife, label: 'Shelf life' },
    { icon: Leaf, value: '100% Ayurvedic', label: 'Botanical formula' },
    { icon: Award, value: 'AYUSH GMP', label: 'Certified making' },
    { icon: FlaskConical, value: 'Lab Tested', label: 'Quality checked' },
    { icon: Heart, value: 'Cruelty-Free', label: 'Never tested on animals' },
  ].filter(Boolean);

  return (
    <section aria-label="Product highlights" className="mb-10">
      <ul className="grid grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {items.map(({ icon: Icon, value, label }) => (
          <li
            key={label}
            className="group flex flex-col items-center text-center gap-2 rounded-2xl bg-white border border-gray-100 px-2 py-3.5 sm:px-3 sm:py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#2d4e24] to-[#3C5D27] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Icon className="w-5 h-5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">{value}</span>
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide sm:tracking-wider text-gray-500">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
