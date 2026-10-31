'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  {
    question: 'Are Nature Medica products AYUSH certified?',
    answer:
      'Our formulations are made under AYUSH GMP guidelines using traditional botanical ingredients, and are free of parabens and sulfates.',
  },
  {
    question: 'How long before I see results?',
    answer:
      'Ayurvedic and botanical products work gradually. Use a product consistently for at least 4 to 8 weeks, along with a balanced diet and healthy routine.',
  },
  {
    question: 'Can I use these products with my medication?',
    answer:
      'Our wellness supplements are not a substitute for medical treatment. If you are pregnant, have a medical condition or take regular medication, talk to your doctor before starting.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer:
      'Yes. You can also pay online by UPI, card or net banking and get an instant ₹50 discount. Orders above ₹499 ship free.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Use the Track Order page with your AWB number to see live shipment status.',
  },
];

export default function HomeFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Common Doubts, Cleared</h2>
          <p className="text-sm text-gray-600">
            More answers in our <Link href="/faq" className="font-bold text-[#2d4e24] underline">FAQ</Link>
          </p>
        </div>

        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {faqs.map((f, i) => (
            <div key={f.question}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full text-left p-4 sm:p-5 hover:bg-[#f4f7f2]/50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <span className="text-sm font-bold text-gray-900">{f.question}</span>
                {open === i ? (
                  <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-sm text-gray-700 leading-relaxed">{f.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
