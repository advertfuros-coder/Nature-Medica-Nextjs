'use client';

import { useEffect, useRef } from 'react';

// Vertical reels. Add more entries (9:16 mp4 files in /public) to extend the row;
// swap in real customer clips here when available.
const reels = [
  { src: '/gt.mp4', caption: 'Glutathione glow ritual' },
  { src: '/sleep.mp4', caption: 'Wind down naturally' },
];

function Reel({ src, caption }) {
  const ref = useRef(null);

  // Play only while on screen to keep data use and CPU low
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex-shrink-0 w-44 sm:w-56">
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#f4f7f2] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <p className="mt-2 text-xs font-semibold text-gray-900 text-center">{caption}</p>
    </div>
  );
}

export default function ReelShowcase() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">See It in Action</h2>
          <p className="text-sm text-gray-600">Short looks at the rituals behind our formulations</p>
        </div>
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {reels.map((reel) => (
            <Reel key={reel.src} {...reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
