'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiRotateCcw } from 'react-icons/fi';

const concerns = [
  { id: 'glow', label: 'Dull skin or pigmentation' },
  { id: 'energy', label: 'Low energy or stamina' },
  { id: 'hair', label: 'Hair fall or dandruff' },
  { id: 'immunity', label: 'Everyday immunity' },
  { id: 'oral', label: 'Oral care' },
];

const styles = [
  { id: 'simple', label: 'One simple product to start' },
  { id: 'routine', label: 'A complete daily routine' },
];

const results = {
  glow: {
    simple: { title: 'Start with a Face Wash', href: '/products?category=face-wash', guide: '/learn/glutathione-vs-vitamin-c-for-indian-skin' },
    routine: { title: 'Build a Face Care Ritual', href: '/products?category=face-serum', guide: '/learn/simple-ayurvedic-daily-skin-care-routine' },
  },
  energy: {
    simple: { title: "Try Men's Wellness", href: '/products?category=men-s-wellness', guide: '/learn/how-to-choose-pure-himalayan-shilajit-resin' },
    routine: { title: 'Explore Ayurvedic Remedies', href: '/products?category=ayurvedic-remedies', guide: '/learn/how-to-choose-pure-himalayan-shilajit-resin' },
  },
  hair: {
    simple: { title: 'Start with a Herbal Shampoo', href: '/products?category=shampoo', guide: '/learn' },
    routine: { title: 'Explore Hair Care', href: '/products?category=shampoo', guide: '/learn' },
  },
  immunity: {
    simple: { title: 'Try Effervescent Tablets', href: '/products?category=effervescent-tablets', guide: '/learn' },
    routine: { title: 'Explore Ayurvedic Remedies', href: '/products?category=ayurvedic-remedies', guide: '/learn' },
  },
  oral: {
    simple: { title: 'Start with Herbal Toothpaste', href: '/products?category=oral-care', guide: '/learn/why-switch-to-herbal-toothpaste' },
    routine: { title: 'Complete Oral Care', href: '/products?category=oral-care', guide: '/learn/why-switch-to-herbal-toothpaste' },
  },
};

export default function QuizPage() {
  const [concern, setConcern] = useState(null);
  const [style, setStyle] = useState(null);

  const result = concern && style ? results[concern][style] : null;
  const step = !concern ? 1 : !style ? 2 : 3;

  const reset = () => {
    setConcern(null);
    setStyle(null);
  };

  const optionClass =
    'w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#2d4e24] hover:bg-[#f4f7f2] text-sm font-semibold text-gray-900 transition-all cursor-pointer';

  return (
    <main className="min-h-[70vh] bg-white">
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2d4e24] bg-[#F2F7EF] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/15 inline-block mb-2">
          Ayurvedic Quiz · Step {step} of 3
        </span>

        {step === 1 && (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-5">
              What would you like to improve?
            </h1>
            <div className="space-y-3">
              {concerns.map((c) => (
                <button key={c.id} type="button" onClick={() => setConcern(c.id)} className={optionClass}>
                  {c.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-5">
              How do you like to start?
            </h1>
            <div className="space-y-3">
              {styles.map((s) => (
                <button key={s.id} type="button" onClick={() => setStyle(s.id)} className={optionClass}>
                  {s.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && result && (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">{result.title}</h1>
            <p className="text-sm text-gray-600 mb-6">
              This is a starting point based on your answers, not medical advice. Read the guide first if you want
              to know what to look for.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={result.href}
                className="inline-flex items-center justify-center gap-2 bg-[#2d4e24] hover:bg-[#223d1b] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Shop now <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={result.guide}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#2d4e24] text-[#2d4e24] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#eef5ec] transition-colors"
              >
                Read the guide
              </Link>
            </div>
          </>
        )}

        {concern && (
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#2d4e24] cursor-pointer"
          >
            <FiRotateCcw className="w-3.5 h-3.5" /> Start over
          </button>
        )}
      </section>
    </main>
  );
}
