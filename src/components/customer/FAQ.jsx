'use client';

import { useState } from 'react';
import { Plus, Minus, ChevronUp } from 'lucide-react';

const defaultFaqs = [
  {
    question: "Description & Botanical Science",
    answer: `Your daily Ayurvedic wellness ritual, crafted without compromises.
    
Meet Nature Medica Botanical Care—an authentic synergy of time-honored Vedic herbs and pure cold-pressed botanical extracts designed to restore natural vitality.

Every formulation opens with pure cold-pressed botanicals, herbal infusions, and therapeutic essential oils that deeply nourish the skin barrier and hair roots from within.

Sure, our formulations feel exceptionally gentle and luxurious—but that's not all they do. Infused with standardized botanical actives and essential vitamins, every bottle helps rejuvenate, protect against environmental stressors, and deliver long-lasting visible results.

And the best part? All Nature Medica formulations are 100% AYUSH certified, cruelty-free, and free of sulfates, parabens, and mineral oils.`
  },
  {
    question: "Experience Nature Medica Ayurvedic Formulations",
    answer: "Crafted with pure whole-plant extracts including Bhringraj, Organic Amla, Hibiscus, Shikakai, and cold-pressed Virgin Coconut Oil. Experience deep hydration, root strengthening, and natural radiance without any synthetic residue or heavy silicones."
  },
  {
    question: "Who Is It Best For?",
    answer: "Our formulations are pH-balanced, dermatologically tested, and suitable for all hair and skin types—including sensitive skin, colored hair, and treated scalp. Perfect for anyone seeking clean, restorative, authentic Ayurvedic care."
  },
  {
    question: "How to Use in Your Daily Ritual",
    answer: "Step 1: Dispense a coin-sized amount into damp hands.\nStep 2: Gently massage onto scalp or skin using upward circular motions for 2-3 minutes to stimulate circulation.\nStep 3: Allow the botanical actives to absorb before rinsing thoroughly with cool or lukewarm water. For best results, use 2-3 times weekly."
  },
  {
    question: "100% Transparent Ingredients List",
    answer: "Key Actives: Eclipta Alba (Bhringraj) Extract, Phyllanthus Emblica (Amla) Fruit Extract, Hibiscus Rosa-Sinensis Flower Extract, Acacia Concinna (Shikakai) Extract, Aloe Barbadensis Leaf Juice, Cold-Pressed Cocos Nucifera (Coconut) Oil, Rosmarinus Officinalis (Rosemary) Leaf Oil, Vegetable Glycerin, Purified Aqua. Zero Sulfates (SLS/SLES), Zero Parabens, Zero Mineral Oils, Zero Artificial Colors."
  },
  {
    question: "Shipping Timelines & Free Delivery",
    answer: "We offer Free Pan-India Shipping on all orders above ₹499. Orders placed before 2 PM are dispatched the same day. Standard delivery takes 2-4 business days for metro cities and 4-6 business days for the rest of India with end-to-end SMS tracking."
  },
  {
    question: "Returns, Replacements & Guarantee",
    answer: "We offer a hassle-free 7-day return policy for unopened products. In the unlikely event of transit damage or missing items, contact our support team at naturemedica09@gmail.com within 48 hours for immediate priority replacement."
  }
];

export default function FAQ({ 
  badge = "MORE INFO",
  title = "Everything about Nature Medica",
  subtitle = "Frequently asked questions about our formulas, rituals and orders",
  faqs = defaultFaqs
}) {
  // Initialize with the first item open to match the reference UI
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-white">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="  mx-auto">
          {/* Section Header matching homepage components */}
          <div className="flex items-start justify-between mb-6 sm:mb-8 pb-3 border-b border-gray-100">
            <div>
              
              <h2 className="text-lg sm:text-xl   font-bold text-gray-900 tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600 text-[12px] sm:text-[13px] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <button 
              onClick={() => setOpenIndex((prev) => (prev === null ? 0 : null))}
              aria-label="Toggle all FAQ items"
              className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
            </button>
          </div>

          {/* FAQ Accordion List */}
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="transition-colors">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full py-3.5 sm:py-4 flex items-center justify-between text-left group transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[13px] sm:text-sm font-bold text-gray-900 group-hover:text-black transition-colors pr-6">
                      {faq.question}
                    </span>

                    <span className="flex-shrink-0 text-gray-800 transition-transform duration-200">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                      )}
                    </span>
                  </button>

                  {/* Expanded Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[800px] opacity-100 pb-4' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-l-2 border-gray-300 pl-3.5 sm:pl-4 my-1 text-[12px] sm:text-[13px] text-gray-600 leading-relaxed font-normal space-y-2.5">
                      {faq.answer.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
