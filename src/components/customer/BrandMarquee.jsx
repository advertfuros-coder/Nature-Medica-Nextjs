'use client';

export default function BrandMarquee() {
  const brands = [
    'GRAZIA',
    'The Telegraph',
    'VOGUE',
    "Women's Health",
    'GRAZIA',
    'The Telegraph',
    'VOGUE',
    "Women's Health",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#618449] border-t border-b border-gray-200">
      <div className="flex w-full overflow-hidden">
        {/* Container for both tracks */}
        <div className="flex w-[200%]">
          {/* Track 1 */}
          <div className="flex whitespace-nowrap animate-marquee py-3 w-max gap-20">
            {brands.map((brand, index) => (
              <span
                key={index}
                className="text-gray-50 font-serif text-lg md:text-xl tracking-wide"
              >
                {brand}
              </span>
            ))}
          </div>

          {/* Track 2 for seamless loop */}
          <div className="flex whitespace-nowrap animate-marquee2 py-3 w-max gap-20">
            {brands.map((brand, index) => (
              <span
                key={`dup-${index}`}
                className="text-gray-800 font-serif text-lg md:text-xl tracking-wide"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee2 {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: max-content;
        }
        .animate-marquee2 {
          animation: marquee2 20s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}