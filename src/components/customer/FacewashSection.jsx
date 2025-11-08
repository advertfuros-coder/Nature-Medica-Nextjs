'use client';

import Link from 'next/link';

export default function FacewashSection() {
  return (
    <section className="relative w-full h-[30vh] md:h-[35vh] overflow-hidden">
      {/* Background Video */}
      <video
        src="/b1.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-3">
        <h2 className="text-xl md:text-3xl font-semibold mb-2">
          Glutathione Brightening Foaming Face Wash
        </h2>
        <p className="max-w-xl mx-auto text-xs md:text-sm mb-4">
          Enriched with Vitamin C, Kojic Acid & Niacinamide for brighter, clearer skin. Gently cleanses and nourishes while reducing dullness and promoting a radiant glow.
        </p>
        <Link
          href="/products/facewash"
          className="bg-white text-black font-semibold px-4 py-1.5 rounded hover:bg-gray-200 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}