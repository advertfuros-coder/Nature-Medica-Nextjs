import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function QuizBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/quiz"
          className="group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#2d4e24] to-[#3C5D27] p-6 sm:p-8 text-white shadow-[0_6px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Ayurvedic Quiz</span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">Confused what to choose?</h2>
            <p className="text-sm text-emerald-100 mt-1">Answer 2 quick questions and get a starting point.</p>
          </div>
          <span className="inline-flex items-center gap-2 bg-white text-[#2d4e24] px-5 py-2.5 rounded-xl text-sm font-bold group-hover:bg-[#eef5ec] transition-colors flex-shrink-0">
            Take the 2-min quiz
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  );
}
