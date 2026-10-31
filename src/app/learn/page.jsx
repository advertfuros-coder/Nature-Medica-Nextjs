import Link from 'next/link';
import { FiClock, FiChevronRight } from 'react-icons/fi';
import { articles } from '@/data/articles';

export const metadata = {
  title: 'Wellness Guides | Nature Medica',
  description:
    'Practical Ayurvedic guides on shilajit, skin care, daily rituals and oral care from Nature Medica.',
  alternates: { canonical: '/learn' },
};

export default function LearnHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-green-50/60 to-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2d4e24] bg-[#F2F7EF] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/15 inline-block mb-2">
            Learn Wellness
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Ayurvedic Wellness Guides
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl mx-auto">
            Honest, practical reading on the ingredients and rituals behind our products.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
            >
              <span className="self-start text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#eef5ec] text-[#2d4e24] border border-[#2d4e24]/20 mb-3">
                {a.category}
              </span>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1.5 group-hover:text-[#2d4e24] transition-colors">
                {a.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{a.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <FiClock className="w-3.5 h-3.5" /> {a.readTime} min read
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-[#2d4e24]">
                  Read guide
                  <FiChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
