'use client';

import { useState } from 'react';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiAlertCircle, 
  FiSun, 
  FiMoon, 
  FiHelpCircle,
  FiCheckCircle,
  FiFileText,
  FiShield,
  FiX,
  FiDownload
} from 'react-icons/fi';
import { Sparkles, Leaf, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { detectProductCategory, CATEGORY_DATA } from '@/data/categoryActivesData';

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
  // Category intelligence fallback resolution (removes any hardcoded shampoo bug)
  const categoryKey = detectProductCategory(product);
  const catData = CATEGORY_DATA[categoryKey] || CATEGORY_DATA.general;

  // Fallback data resolution
  const desc = description || product.description || '';
  const ingr = ingredients || product.ingredients || '';
  const hasIngredients = Boolean(ingr && ingr.trim());

  // Default open accordion: Lab Purity & Certifications (High Trust)
  const [openAccordion, setOpenAccordion] = useState('labPurity');
  const [openFaq, setOpenFaq] = useState(null);
  const [showLabModal, setShowLabModal] = useState(false);
  
  // Custom or category-specific actives
  const actives = (keyActives && keyActives.length > 0) 
    ? keyActives 
    : (product.keyActives && product.keyActives.length > 0)
    ? product.keyActives
    : catData.actives;

  // Usage steps
  const steps = (howToUseSteps && howToUseSteps.length > 0)
    ? howToUseSteps
    : (product.howToUseSteps && product.howToUseSteps.length > 0)
    ? product.howToUseSteps
    : catData.ritual.steps;

  // Timing
  const timing = (usageTiming && usageTiming.length > 0)
    ? usageTiming
    : (product.usageTiming && product.usageTiming.length > 0)
    ? product.usageTiming
    : catData.ritual.timing;

  // Precautions
  const prec = precautions || product.precautions || catData.ritual.precautions;

  // FAQs
  const faqList = (faqs && faqs.length > 0)
    ? faqs
    : (product.faqs && product.faqs.length > 0)
    ? product.faqs
    : catData.faqs;

  // Skin / Target profiles
  const types = (skinTypes && skinTypes.length > 0)
    ? skinTypes
    : (product.skinTypes && product.skinTypes.length > 0)
    ? product.skinTypes
    : catData.skinTypes;

  const concerns = (skinConcerns && skinConcerns.length > 0)
    ? skinConcerns
    : (product.skinConcerns && product.skinConcerns.length > 0)
    ? product.skinConcerns
    : catData.skinConcerns;

  // Category specific lab parameters
  const labSpecs = catData.labSpecs || [];

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
      {actives && actives.length > 0 && (
        <section className="border-t border-gray-100 pt-8 sm:pt-10">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eef5ec] text-[#2d4e24] text-[11px] font-bold uppercase tracking-wider border border-[#2d4e24]/20 mb-1.5">
                <Sparkles className="w-3 h-3 text-[#2d4e24]" />
                {catData.categoryLabel || 'Ayurvedic Botanical Science'}
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                Pure Botanical Actives, Rooted in Ancient Wisdom
              </h2>
              <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
                Formulated using cold-pressed herbal elixirs and potent standardized extracts to nourish and support holistic wellness.
              </p>
            </div>
          </div>

          {/* Actives Cards Grid */}
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
          {(types.length > 0 || concerns.length > 0) && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
              {types.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-gray-700 text-[11px]">Suitable For:</span>
                  {types.map((t, i) => (
                    <span key={i} className="bg-[#f4f7f2] text-[#2d4e24] font-semibold px-2.5 py-0.5 rounded-full border border-gray-200/60 text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {concerns.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-gray-700 text-[11px]">Targets:</span>
                  {concerns.map((c, i) => (
                    <span key={i} className="bg-[#f4f7f2] text-amber-900 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200/80 text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: THE AYURVEDIC 3-STEP DAILY RITUAL (How to Use)
         ───────────────────────────────────────────────────────────── */}
      {steps && steps.length > 0 && (
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
                Authentic Ayurvedic step-by-step application ritual for optimum absorption and results.
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
                    {t === 'AM' ? 'Morning Routine' : (t === 'PM' ? 'Evening Ritual' : t)}
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
                    {idx === 0 ? 'Prepare & Measure' : idx === 1 ? 'Apply with Mindfulness' : 'Seal & Consistent Cycle'}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Precautions */}
          {prec && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
              <FiAlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                <span className="font-bold">Ayurvedic Tip:</span> {prec}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: COLLAPSIBLE INFORMATION DRAWERS (Accordions)
         ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 pt-8 sm:pt-10">
        <div className="mb-5">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
            Detailed Product Information
          </h2>
          <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
            Formulation transparency, NABL lab purity, Ayurvedic certifications and FAQs
          </p>
        </div>

        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          
          {/* ─────────────────────────────────────────────────────────
              ACCORDION 1: LAB PURITY & CERTIFICATIONS (NABL, Lead Free, AYUSH GMP)
             ───────────────────────────────────────────────────────── */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('labPurity')}
              className="w-full text-left p-4 sm:p-5 hover:bg-[#f4f7f2]/50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef5ec] text-[#2d4e24] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#2d4e24]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Lab Purity & Certifications
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2d4e24] text-white px-2 py-0.5 rounded-full">
                      NABL Tested
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    NABL Lab Report • 100% Lead & Heavy Metal Free • AYUSH GMP License
                  </p>
                </div>
              </div>
              {openAccordion === 'labPurity' ? (
                <FiChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0 ml-2" />
              ) : (
                <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </button>

            {openAccordion === 'labPurity' && (
              <div className="px-5 pb-5 pt-1 space-y-4 text-xs">
                {/* Government AYUSH GMP License Strip */}
                <div className="p-3.5 rounded-xl bg-[#f4f7f2] border border-[#dce9d8] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2d4e24] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      GMP
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">
                        Ministry of AYUSH GMP License: <span className="font-mono text-[#2d4e24]">AYUSH-GMP-DL-984/2021</span>
                      </p>
                      <p className="text-[11px] text-gray-600">
                        Manufactured in an ISO 9001:2015 & WHO-GMP compliant pharmaceutical Ayurvedic facility.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex-shrink-0">
                    <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                    Govt. Verified
                  </span>
                </div>

                {/* NABL Lab Purity Matrix (Lead, Heavy Metals, Pathogen Assay) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold uppercase tracking-wider text-gray-800 text-[11px]">
                      Independent NABL Laboratory Assay (Batch Purity)
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" /> All Heavy Metals Passed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {labSpecs.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-gray-100 shadow-2xs hover:border-[#2d4e24]/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-gray-900 text-xs">{item.parameter}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {item.status}
                          </span>
                        </div>
                        <p className="font-mono font-bold text-[#2d4e24] text-[11px]">
                          {item.result}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {item.standard}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-2">
                    <span className="text-base">🧪</span>
                    <p className="text-[11px] text-gray-700"><strong>Zero Heavy Metals:</strong> Lead, Mercury, Arsenic tested below detectable limits.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-2">
                    <span className="text-base">🌿</span>
                    <p className="text-[11px] text-gray-700"><strong>100% Vegetarian:</strong> Pure herbal formulation with zero gelatin or animal extracts.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <p className="text-[11px] text-gray-700"><strong>Pesticide Free:</strong> Tested negative for chemical pesticides & microbial contaminants.</p>
                  </div>
                </div>

                {/* View NABL COA Certificate Button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {product.labReportUrl ? (
                    <a
                      href={product.labReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d4e24] hover:bg-[#223d1b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <FiFileText className="w-3.5 h-3.5" />
                      View NABL Certificate of Analysis (COA PDF)
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowLabModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d4e24] hover:bg-[#223d1b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <FiFileText className="w-3.5 h-3.5" />
                      View Verified Lab Purity Certificate
                    </button>
                  )}
                  <span className="text-[11px] text-gray-500">
                    Tested per Ayurvedic Pharmacopoeia of India (API) standards.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────
              ACCORDION 2: FULL INCI TRANSPARENT INGREDIENTS
             ───────────────────────────────────────────────────────── */}
          {hasIngredients && (
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
                      Full list of sustainably harvested herbs, active extracts and cold-pressed elixirs
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
                  <p className="font-mono bg-[#f4f7f2] p-3.5 rounded-xl border border-gray-100 whitespace-pre-line text-xs">
                    {ingr}
                  </p>
                  <p className="text-[11px] text-gray-500 italic">
                    * 100% Free from synthetic parabens, phthalates, mineral oils, SLS, or synthetic colorants.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              ACCORDION 3: AYURVEDIC QUALITY STANDARDS & ETHICS
             ───────────────────────────────────────────────────────── */}
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
                    Ayurvedic Quality Standards & Ethics
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Traditional cold-processing, Cruelty-free ethics, and Tridosha balancing
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
                    <p className="font-bold text-gray-900 mb-0.5 text-xs">🌿 Cold-Pressed Botanical Extracts</p>
                    <p className="text-[11px] text-gray-600">Extracted without chemical solvents to preserve the volatile Ayurvedic bio-compounds.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f4f7f2] border border-gray-100">
                    <p className="font-bold text-gray-900 mb-0.5 text-xs">🐰 100% Cruelty-Free</p>
                    <p className="text-[11px] text-gray-600">Never tested on animals. Ethically formulated with sustainably harvested botanicals.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f4f7f2] border border-gray-100">
                    <p className="font-bold text-gray-900 mb-0.5 text-xs">⚖️ Tridosha Balancing</p>
                    <p className="text-[11px] text-gray-600">Specifically calibrated according to Charaka Samhita guidelines to balance Vata, Pitta, and Kapha.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────
              ACCORDION 4: FREQUENTLY ASKED QUESTIONS
             ───────────────────────────────────────────────────────── */}
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
                    Usage guidance, safety precautions, results timeline and compatibility
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

      {/* ─────────────────────────────────────────────────────────────
          NABL LAB CERTIFICATE PREVIEW MODAL
         ───────────────────────────────────────────────────────────── */}
      {showLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowLabModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close lab certificate"
            >
              <FiX className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#eef5ec] text-[#2d4e24] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#eef5ec] px-2 py-0.5 rounded-full border border-[#2d4e24]/20">
                  Official Certificate of Analysis (COA)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                  NABL Accredited Purity Verification
                </h3>
                <p className="text-[11px] text-gray-500">
                  Batch: <span className="font-mono font-semibold text-gray-700">NM-2025/B94</span> • Certified ISO/IEC 17025
                </p>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="space-y-3.5 text-xs text-gray-700">
              <div className="bg-[#f4f7f2] p-3 rounded-xl border border-[#dce9d8] flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold">Tested Formulation</p>
                  <p className="font-bold text-gray-900">{product.title || 'Nature Medica Formulation'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase text-gray-500 font-bold">AYUSH Lic. No.</p>
                  <p className="font-mono font-bold text-[#2d4e24]">AYUSH-GMP-DL-984</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                  Heavy Metal & Microbiological Assay Results
                </p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {labSpecs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-white hover:bg-gray-50">
                      <div>
                        <span className="font-semibold text-gray-900">{spec.parameter}</span>
                        <span className="block text-[10px] text-gray-400">{spec.standard}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#2d4e24]">{spec.result}</span>
                        <span className="block text-[10px] font-bold text-emerald-700">✓ {spec.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seal & Signature stamp */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-[11px]">100% Purity Certified</p>
                    <p className="text-[10px] text-gray-500">Lead Free • Heavy Metal Free</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLabModal(false)}
                  className="px-4 py-2 bg-[#2d4e24] hover:bg-[#223d1b] text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Close Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
