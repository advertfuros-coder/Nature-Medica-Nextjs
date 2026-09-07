'use client';

import { useState } from 'react';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiAlertCircle, 
  FiSun, 
  FiMoon, 
  FiHelpCircle 
} from 'react-icons/fi';
import { Sparkles, Leaf, Award } from 'lucide-react';

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
  const [openAccordion, setOpenAccordion] = useState('ingredients');
  const [openFaq, setOpenFaq] = useState(null);

  // Fallback data resolution
  const desc = description || product.description || '';
  const ingr = ingredients || product.ingredients || '';
  
  // Custom or Ayurvedic default actives
  const defaultActives = [
    {
      name: 'Bhringraj (Eclipta Alba)',
      percentage: 'Pure Extract',
      role: "Revered as 'Kesharaja' (King of Hair). Stimulates microcirculation to hair follicles and promotes dense growth."
    },
    {
      name: 'Amla (Indian Gooseberry)',
      percentage: 'Cold-Pressed',
      role: "Extremely rich in bio-active Vitamin C and antioxidants that strengthen roots and protect natural hair pigmentation."
    },
    {
      name: 'Shikakai (Acacia Concinna)',
      percentage: 'Natural Saponin',
      role: "Traditional gentle herbal cleanser that removes excess sebum and styling residue without stripping scalp moisture."
    },
    {
      name: 'Hibiscus & Neem Flower',
      percentage: 'Herbal Infusion',
      role: "Balances scalp microbiome, soothes irritation, and conditions hair strands for natural silky luster."
    }
  ];

  const actives = (keyActives && keyActives.length > 0) 
    ? keyActives 
    : (product.keyActives && product.keyActives.length > 0)
    ? product.keyActives
    : defaultActives;

  const defaultSteps = [
    'Take 2-3 pumps of shampoo onto wet palms and rub together to create a light botanical lather.',
    'Gently massage into wet hair and scalp with circular fingertip motions for 2-3 minutes to stimulate follicles.',
    'Rinse thoroughly with lukewarm or cool water. For oiled hair, repeat with a gentle second cleanse.'
  ];

  const steps = (howToUseSteps && howToUseSteps.length > 0)
    ? howToUseSteps
    : (product.howToUseSteps && product.howToUseSteps.length > 0)
    ? product.howToUseSteps
    : defaultSteps;

  const timing = (usageTiming && usageTiming.length > 0)
    ? usageTiming
    : (product.usageTiming && product.usageTiming.length > 0)
    ? product.usageTiming
    : ['AM', 'PM'];

  const prec = precautions || product.precautions || 'For external use only. Patch test recommended on inner elbow 24 hours prior to first full application.';

  const defaultFaqs = [
    {
      question: 'Is this shampoo safe for daily use and color-treated hair?',
      answer: 'Yes! It is 100% free from sulfates, silicones, and harsh surfactants. It gently cleanses while preserving natural scalp moisture and hair color vitality.'
    },
    {
      question: 'How many washes does it take to see visible results?',
      answer: 'Most users experience a cleaner, softer scalp and reduced dryness after the very first wash. Reduction in hair breakage and improved strength are typically noticeable within 3 to 4 weeks of consistent ritual use.'
    },
    {
      question: 'Does this product contain any synthetic fragrance or artificial dyes?',
      answer: 'No synthetic fragrance or parabens. The subtle herbal aroma comes entirely from natural botanical extracts and steam-distilled floral waters.'
    },
    {
      question: 'What is the shelf life and proper storage condition?',
      answer: 'The shelf life is 24 months from the manufacturing date. Store in a cool, dry place away from direct sunlight.'
    }
  ];

  const faqList = (faqs && faqs.length > 0)
    ? faqs
    : (product.faqs && product.faqs.length > 0)
    ? product.faqs
    : defaultFaqs;

  const types = (skinTypes && skinTypes.length > 0)
    ? skinTypes
    : (product.skinTypes && product.skinTypes.length > 0)
    ? product.skinTypes
    : ['All Hair Types', 'Sensitive Scalp', 'Treated Hair'];

  const concerns = (skinConcerns && skinConcerns.length > 0)
    ? skinConcerns
    : (product.skinConcerns && product.skinConcerns.length > 0)
    ? product.skinConcerns
    : ['Hairfall Control', 'Scalp Buildup', 'Dryness & Frizz'];

  const toggleAccordion = (id) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: THE BOTANICAL SCIENCE & STAR ACTIVES
         ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 pt-8 sm:pt-10">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eef5ec] text-[#2d4e24] text-[11px] font-bold uppercase tracking-wider border border-[#2d4e24]/20 mb-1.5">
              <Sparkles className="w-3 h-3 text-[#2d4e24]" />
              Ayurvedic Botanical Science
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              Pure Botanical Actives, Rooted in Ancient Wisdom
            </h2>
            <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
              Formulated using cold-pressed herbal elixirs that nourish hair follicles at the cellular level.
            </p>
          </div>
        </div>

        {/* Actives Cards Grid matching CustomerReviews card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {actives.map((act, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#f4f7f2] text-[#2d4e24] flex items-center justify-center mb-3 border border-gray-100 group-hover:scale-105 transition-transform">
                  <Leaf className="w-4 h-4 text-[#2d4e24]" />
                </div>
                <h3 className="font-bold text-xs sm:text-[13px] text-gray-900 tracking-wide mb-1 leading-snug">
                  {act.name}
                </h3>
                {act.percentage && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#eef5ec] text-[#2d4e24] border border-[#2d4e24]/20 mb-2">
                    {act.percentage}
                  </span>
                )}
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                  {act.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Target Profile Tags */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold uppercase tracking-wider text-gray-700 text-[11px]">Suitable For:</span>
            {types.map((t, i) => (
              <span key={i} className="bg-[#f4f7f2] text-[#2d4e24] font-semibold px-2.5 py-0.5 rounded-full border border-gray-200/60 text-[11px]">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold uppercase tracking-wider text-gray-700 text-[11px]">Targets:</span>
            {concerns.map((c, i) => (
              <span key={i} className="bg-[#f4f7f2] text-amber-900 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200/80 text-[11px]">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: THE AYURVEDIC 3-STEP DAILY RITUAL (How to Use)
         ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 pt-8 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eef5ec] text-[#2d4e24] text-[11px] font-bold uppercase tracking-wider border border-[#2d4e24]/20 mb-1.5">
              <Sparkles className="w-3 h-3 text-[#2d4e24]" />
              The Daily Ritual
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              How to Experience Maximum Efficacy
            </h2>
            <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
              Step-by-step Ayurvedic application guide for deep follicular nourishment.
            </p>
          </div>

          {/* Timing indicators */}
          {timing.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 text-[11px]">Timing:</span>
              {timing.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#2d4e24] text-white px-2.5 py-0.5 rounded-full shadow-2xs"
                >
                  {t === 'AM' ? <FiSun className="w-3 h-3 text-amber-300" /> : <FiMoon className="w-3 h-3 text-blue-200" />}
                  {t === 'AM' ? 'Morning Cleanse' : (t === 'PM' ? 'Evening Ritual' : t)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-7 h-7 rounded-full bg-[#2d4e24] text-white font-bold text-xs flex items-center justify-center mb-3 shadow-2xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-xs sm:text-[13px] text-gray-900 mb-1 leading-snug">
                  {idx === 0 ? 'Dispense & Emulsify' : idx === 1 ? 'Follicle Stimulation (Champi)' : 'Rinse with Cool Water'}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Precautions */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
          <FiAlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-950 leading-relaxed font-medium">
            <span className="font-bold">Ayurvedic Tip:</span> {prec}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: COLLAPSIBLE INFORMATION DRAWERS (Accordions)
         ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 pt-8 sm:pt-10">
        <div className="mb-5">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
            Detailed Product Information
          </h2>
          <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
            Formulation transparency, Ayurvedic certifications and FAQs
          </p>
        </div>

        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {/* Accordion 1: Full INCI Transparent Ingredients */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('ingredients')}
              className="w-full text-left p-4 sm:p-5 hover:bg-[#f4f7f2]/50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4f7f2] text-[#2d4e24] flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Complete Transparent Formulation (INCI)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Full list of sustainably sourced herbal extracts and naturally derived cleansers
                  </p>
                </div>
              </div>
              {openAccordion === 'ingredients' ? (
                <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0 ml-2" />
              ) : (
                <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </button>

            {openAccordion === 'ingredients' && (
              <div className="px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed space-y-3">
                {ingr ? (
                  <p className="font-mono bg-[#f4f7f2] p-3.5 rounded-xl border border-gray-100 whitespace-pre-line text-xs">
                    {ingr}
                  </p>
                ) : (
                  <p className="font-mono bg-[#f4f7f2] p-3.5 rounded-xl border border-gray-100 text-xs">
                    Aqua (Purified Spring Water), Sodium Lauroyl Methyl Isethionate (Coconut Derived), Glycerin, Eclipta Alba (Bhringraj) Extract, Phyllanthus Emblica (Amla) Fruit Extract, Acacia Concinna (Shikakai) Extract, Hibiscus Rosa-Sinensis (Hibiscus) Flower Extract, Melia Azadirachta (Neem) Leaf Extract, Sapindus Mukorossi (Reetha) Extract, Panthenol (Pro-Vitamin B5), Tocopheryl Acetate (Vitamin E), Citric Acid, Potassium Sorbate, Sodium Benzoate.
                  </p>
                )}
                <p className="text-[11px] text-gray-500 italic">
                  * Zero synthetic parabens, phthalates, mineral oils, or artificial colorants.
                </p>
              </div>
            )}
          </div>

          {/* Accordion 2: AYUSH & Clinical Safety Certifications */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('certifications')}
              className="w-full text-left p-4 sm:p-5 hover:bg-[#f4f7f2]/50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4f7f2] text-[#2d4e24] flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Ayurvedic Quality, Testing & Certifications
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    AYUSH Certified GMP manufacturing and dermatologically assessed standards
                  </p>
                </div>
              </div>
              {openAccordion === 'certifications' ? (
                <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0 ml-2" />
              ) : (
                <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </button>

            {openAccordion === 'certifications' && (
              <div className="px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#f4f7f2] border border-gray-100">
                    <p className="font-bold text-gray-900 mb-0.5 text-xs">🌿 AYUSH GMP Certified</p>
                    <p className="text-[11px] text-gray-600">Manufactured under strict Ministry of AYUSH pharmaceutical quality guidelines.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f4f7f2] border border-gray-100">
                    <p className="font-bold text-gray-900 mb-0.5 text-xs">🐰 100% Cruelty-Free</p>
                    <p className="text-[11px] text-gray-600">Never tested on animals. 100% vegetarian formulation with natural actives.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f4f7f2] border border-gray-100">
                    <p className="font-bold text-gray-900 mb-0.5 text-xs">⚖️ Tridosha Balancing</p>
                    <p className="text-[11px] text-gray-600">Specifically calibrated to pacify aggravated Pitta and Vata scalp conditions.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Frequently Asked Questions */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('faqs')}
              className="w-full text-left p-4 sm:p-5 hover:bg-[#f4f7f2]/50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4f7f2] text-[#2d4e24] flex items-center justify-center flex-shrink-0">
                  <FiHelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Frequently Asked Questions ({faqList.length})
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Usage advice, safety, expiry and compatibility answers
                  </p>
                </div>
              </div>
              {openAccordion === 'faqs' ? (
                <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0 ml-2" />
              ) : (
                <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </button>

            {openAccordion === 'faqs' && (
              <div className="px-5 pb-5 pt-1 space-y-2">
                {faqList.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full text-left p-3 bg-[#f4f7f2] hover:bg-[#eef5ec] flex items-center justify-between text-xs font-bold text-gray-900 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0 ml-2" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-3 bg-white text-xs text-gray-700 leading-relaxed border-t border-gray-100">
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
      </section>
    </div>
  );
}
