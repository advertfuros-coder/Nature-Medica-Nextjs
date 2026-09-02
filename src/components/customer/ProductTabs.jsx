'use client';

import { useState } from 'react';
import { FiClock, FiCheck, FiAlertCircle, FiChevronDown, FiChevronUp, FiShield } from 'react-icons/fi';

export default function ProductTabs({ 
  product = {},
  description, 
  ingredients, 
  specifications,
  keyActives = [],
  howToUseSteps = [],
  usageTiming = [],
  precautions,
  faqs = [],
  skinTypes = [],
  skinConcerns = [],
  trustBadges = []
}) {
  const [activeTab, setActiveTab] = useState('description');
  const [openFaq, setOpenFaq] = useState(null);

  // Fallbacks from product object if passed directly
  const desc = description || product.description || '';
  const ingr = ingredients || product.ingredients || '';
  const actives = (keyActives && keyActives.length > 0) ? keyActives : (product.keyActives || []);
  const steps = (howToUseSteps && howToUseSteps.length > 0) ? howToUseSteps : (product.howToUseSteps || []);
  const timing = (usageTiming && usageTiming.length > 0) ? usageTiming : (product.usageTiming || []);
  const prec = precautions || product.precautions || '';
  const faqList = (faqs && faqs.length > 0) ? faqs : (product.faqs || []);
  const types = (skinTypes && skinTypes.length > 0) ? skinTypes : (product.skinTypes || []);
  const concerns = (skinConcerns && skinConcerns.length > 0) ? skinConcerns : (product.skinConcerns || []);
  const badges = (trustBadges && trustBadges.length > 0) ? trustBadges : (product.trustBadges || []);

  const hasHowToUse = steps.length > 0 || timing.length > 0;
  const hasActives = actives.length > 0 || !!ingr;
  const hasFaqs = faqList.length > 0;

  const toggleFaq = (index) => {
    setOpenFaq(prev => prev === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100 gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-3 px-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'description'
              ? 'border-b-2 border-[#2d4e24] text-[#2d4e24]'
              : 'text-gray-500 hover:text-gray-900 border-transparent'
          }`}
        >
          Product Overview
        </button>

        {hasActives && (
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'border-b-2 border-[#2d4e24] text-[#2d4e24]'
                : 'text-gray-500 hover:text-gray-900 border-transparent'
            }`}
          >
            Formula & Actives
          </button>
        )}

        {hasHowToUse && (
          <button
            onClick={() => setActiveTab('howToUse')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'howToUse'
                ? 'border-b-2 border-[#2d4e24] text-[#2d4e24]'
                : 'text-gray-500 hover:text-gray-900 border-transparent'
            }`}
          >
            How to Use (Ritual)
          </button>
        )}

        {hasFaqs && (
          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'border-b-2 border-[#2d4e24] text-[#2d4e24]'
                : 'text-gray-500 hover:text-gray-900 border-transparent'
            }`}
          >
            FAQs ({faqList.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {/* ── OVERVIEW ── */}
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {desc}
            </div>

            {/* Target Skin Types & Concerns Pills */}
            {(types.length > 0 || concerns.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {types.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Suitable Skin Types
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {types.map((t, i) => (
                        <span key={i} className="text-xs bg-[#eef5ec] text-[#2d4e24] font-medium px-2.5 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {concerns.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                      Target Concerns Addressed
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {concerns.map((c, i) => (
                        <span key={i} className="text-xs bg-amber-50 text-amber-900 font-medium px-2.5 py-1 rounded-full border border-amber-200/50">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Trust Badges */}
            {badges.length > 0 && (
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                {badges.map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                    <FiShield className="text-[#2d4e24] w-3.5 h-3.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FORMULA & ACTIVES ── */}
        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            {/* Key Actives Cards */}
            {actives.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                  Key Active Botanicals & Ingredients
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {actives.map((act, i) => (
                    <div key={i} className="p-3.5 bg-[#f4f7f2] rounded-xl border border-[#dce9d8]">
                      <div className="flex items-baseline justify-between mb-1">
                        <h5 className="text-xs font-bold text-[#2d4e24]">{act.name}</h5>
                        {act.percentage && (
                          <span className="text-[11px] font-black text-[#2d4e24] bg-white px-2 py-0.5 rounded-full border border-[#2d4e24]/20">
                            {act.percentage}
                          </span>
                        )}
                      </div>
                      {act.role && (
                        <p className="text-[11px] text-gray-600 leading-snug">{act.role}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full INCI Ingredients */}
            {ingr && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                  Full Ingredient List (INCI)
                </h4>
                <p className="text-xs font-mono text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 leading-relaxed whitespace-pre-line">
                  {ingr}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── HOW TO USE ── */}
        {activeTab === 'howToUse' && (
          <div className="space-y-6">
            {/* Timing */}
            {timing.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Suggested Timing:</span>
                {timing.map((time, i) => (
                  <span key={i} className="text-xs bg-[#2d4e24] text-white font-bold px-2.5 py-0.5 rounded-full">
                    {time === 'AM' ? 'Morning (AM)' : (time === 'PM' ? 'Night (PM)' : time)}
                  </span>
                ))}
              </div>
            )}

            {/* Steps */}
            {steps.length > 0 && (
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2d4e24] text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-700 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Precautions */}
            {prec && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                <FiAlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>{prec}</p>
              </div>
            )}
          </div>
        )}

        {/* ── FAQs ── */}
        {activeTab === 'faqs' && (
          <div className="space-y-2.5">
            {faqList.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full text-left p-3.5 bg-gray-50/50 hover:bg-gray-100 flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900 transition"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 bg-white border-t border-gray-100 text-xs text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
