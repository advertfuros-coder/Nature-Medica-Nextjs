'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-[#415f2d] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl lg:text-3xl font-light text-white mb-6">
          Ready to explore wellness?
        </h2>
        <Link
          href="/products"
          className="inline-block bg-white text-[#415f2d] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
