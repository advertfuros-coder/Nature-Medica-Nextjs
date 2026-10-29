'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/store/slices/cartSlice';
import Link from 'next/link';
import {
  FiCheck,
  FiShield,
  FiTruck,
  FiAward,
  FiArrowRight,
  FiStar,
  FiPhoneCall,
  FiDroplet,
  FiSun,
  FiHeart,
  FiActivity,
  FiLayers,
  FiClock,
  FiCheckCircle,
  FiX,
  FiSliders,
} from 'react-icons/fi';
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Flame,
  Zap,
  Leaf,
  Check,
  Award,
  CircleDot,
  TrendingUp,
} from 'lucide-react';

export default function SeaBuckthornLanding({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Curated Cloudinary imagery with rich metadata
  const gallery = [
    {
      id: 0,
      url: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040356/naturemedica/products/xstvz55avuw882sc6yyb.jpg',
      caption: 'Pure 500ml Cold-Pressed Pulp',
      sub: 'Amber bottle preserves light-sensitive bio-flavonoids',
    },
    {
      id: 1,
      url: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040367/naturemedica/products/oszz5by9uihtzraq9etb.jpg',
      caption: 'Wild Himalayan Harvest • Ladakh (14,000+ ft)',
      sub: 'Hand-picked from sub-zero thorny mountain shrub forests',
    },
    {
      id: 2,
      url: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792040362/naturemedica/products/xykxhfyvqg5a7m7tqjfh.jpg',
      caption: 'Certified Nutrition & Active Profile',
      sub: 'NABL Accredited • Zero heavy metals • Zero added sugar',
    },
  ];

  const [activeImg, setActiveImg] = useState(0);

  // Active Hotspot tooltip state on the product bottle
  const [activeHotspot, setActiveHotspot] = useState(null);

  // The Difference Engine Tab State
  const [diffTab, setDiffTab] = useState('supermarket'); // 'supermarket' | 'synthetic' | 'antacids'

  // Dynamic Transformation Goal tabs
  const goals = [
    {
      id: 'skin',
      title: 'Dewy Skin Glow & Collagen',
      headline: 'Drink Your Skincare From Within',
      badge: 'Omega-7 Cellular Repair',
      desc: 'Most skin issues (chronic dryness, dullness, early fine lines) stem from depleted cell membranes. Rare Omega-7 (Palmitoleic acid) penetrates dermal epithelial tissue directly, boosting natural collagen synthesis and locking in moisture from within.',
      metric: '+88% Deep Hydration',
      submetric: 'Noticeable dewy skin bounce in 14 days',
    },
    {
      id: 'gut',
      title: 'Acidity, GERD & Gut Healing',
      headline: 'Natural Shield for the Stomach Mucosa',
      badge: 'Mucosal Barrier Defense',
      desc: 'Synthetic antacids only neutralize acid temporarily while disrupting gut flora. The natural lipid matrix in raw Sea Buckthorn coats and soothes inflamed stomach linings, relieving fiery burning sensations and morning acid reflux naturally.',
      metric: '92% Acid Relief',
      submetric: 'Calms heartburn without rebound acidity',
    },
    {
      id: 'immunity',
      title: 'Himalayan Immunity & Vitality',
      headline: '12x More Vitamin C Than Fresh Oranges',
      badge: '190+ Phytonutrients',
      desc: 'Thriving in extreme -40°C high-altitude Ladakh winds forces this super-berry to produce unmatched antioxidant concentrations. A daily 20ml shot supplies full-spectrum Omegas 3, 6, 9 & 7 plus natural carotenoids for robust immunity.',
      metric: '12x Bio-Vitamin C',
      submetric: 'Superior bio-absorption vs synthetic pills',
    },
  ];

  const [activeGoal, setActiveGoal] = useState('skin');

  // The 5 Raw Differences by category
  const differencesData = {
    supermarket: {
      tag: 'Nature Medica vs Commercial Supermarket Juices',
      rows: [
        {
          label: 'Pulp Content & Density',
          nm: '100% whole berry raw pulp with golden berry oil suspended naturally. Thick, undiluted nectar.',
          other: 'Diluted with 60–80% water and reconstituted apple/pear syrup concentrate.',
        },
        {
          label: 'Omega-7 Fatty Acids',
          nm: 'Verified high concentration of natural Palmitoleic acid retained from whole berry cold pressing.',
          other: 'Zero or trace amounts. Berry oils are skimmed off and sold as separate expensive cosmetics.',
        },
        {
          label: 'Origin & Altitude',
          nm: 'Wild harvested at 14,000+ ft in Ladakh cold desert. Maximum natural antioxidant density.',
          other: 'Lowland farmed berries with synthetic fertilizers and diminished therapeutic potency.',
        },
        {
          label: 'Extraction Temperature',
          nm: 'Gentle slow cold-press extraction preserving fragile enzymes and Vitamin C.',
          other: 'High-heat pasteurization (90°C+) that destroys delicate bioflavonoids and nutrients.',
        },
      ],
    },
    synthetic: {
      tag: 'Raw Botanical Pulp vs Synthetic Vitamin C & Collagen Pills',
      rows: [
        {
          label: 'Bio-Availability',
          nm: 'Natural food-matrix nutrients surrounded by bioflavonoids for immediate cellular uptake.',
          other: 'Isolated chemical ascorbic acid synthesized from corn syrup; up to 70% excreted in urine.',
        },
        {
          label: 'Skin Collagen Pathway',
          nm: 'Omega-7 signals epithelial cells to naturally produce collagen from within without bovine animal hides.',
          other: 'Animal collagen peptides that often trigger breakouts or fail to cross the intestinal wall intact.',
        },
        {
          label: 'Holistic Nutrient Count',
          nm: '190+ synergistic bio-active compounds, vitamins A, B1, B2, C, E, and 84+ ionic trace minerals.',
          other: 'Single isolated synthetic molecules without the natural catalytic co-factors required for absorption.',
        },
      ],
    },
    antacids: {
      tag: 'Raw Botanical Pulp vs Chemical Antacids',
      rows: [
        {
          label: 'Mechanism of Action',
          nm: 'Omega-7 and natural lipids coat and actively repair micro-ulcerations in the gastric mucosal wall.',
          other: 'Aluminium/Magnesium hydroxides chemically suppress stomach acid, crippling digestive enzymes.',
        },
        {
          label: 'Rebound Acidity',
          nm: 'Zero rebound acid. Balances stomach pH naturally and soothes digestive fire (Pitta dosha).',
          other: 'Severe acid rebound once medication wears off, leading to long-term chronic dependency.',
        },
        {
          label: 'Nutrient Assimilation',
          nm: 'Promotes healthy peristalsis and enhances iron and nutrient uptake across the duodenum.',
          other: 'Chronically low stomach acid blocks Vitamin B12 and calcium absorption.',
        },
      ],
    },
  };

  // High-AOV Luxury Bundle Tiers
  const bundles = [
    {
      id: 1,
      qty: 1,
      name: 'Starter Trial',
      packText: '1 Bottle (500ml)',
      supply: '20–25 Days Supply',
      price: 799,
      mrp: 1299,
      perBottle: '₹799 / bottle',
      saveText: 'Save ₹500 (38% OFF)',
      shipping: 'Standard Express Shipping (₹50)',
      isBest: false,
      tag: 'Trial Size',
      inclusions: ['1x 500ml Himalayan Sea Buckthorn Juice', 'Standard Doorstep Delivery'],
    },
    {
      id: 2,
      qty: 2,
      name: '30-Day Cellular Renewal',
      packText: '2 Bottles (1,000ml)',
      supply: '45–50 Days Complete Regimen',
      price: 1399,
      mrp: 2598,
      perBottle: '₹699 / bottle',
      saveText: 'Save ₹1,199 (46% OFF)',
      shipping: 'FREE Express Air Delivery',
      isBest: true,
      tag: '★ MOST POPULAR (Chosen by 84% of Customers)',
      inclusions: [
        '2x 500ml Himalayan Sea Buckthorn Juice',
        'FREE Precision 30ml Measuring Beaker',
        'FREE Express Air Delivery Across India',
        'Ayurvedic Morning Regimen Guide (PDF)',
      ],
    },
    {
      id: 3,
      qty: 3,
      name: '90-Day Metabolic & Skin Reset',
      packText: '3 Bottles (1,500ml)',
      supply: '75–90 Days Total Transformation',
      price: 1899,
      mrp: 3897,
      perBottle: '₹633 / bottle',
      saveText: 'Save ₹1,998 (51% OFF)',
      shipping: 'FREE Priority Air Delivery',
      isBest: false,
      tag: 'MAXIMUM SAVINGS (FAMILY PACK)',
      inclusions: [
        '3x 500ml Himalayan Sea Buckthorn Juice',
        'FREE Precision 30ml Measuring Beaker',
        'FREE Priority Air Dispatch',
        'Direct WhatsApp Ayurvedic Doctor Consultation',
      ],
    },
  ];

  const [selectedBundleId, setSelectedBundleId] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const activeBundle = bundles.find((b) => b.id === selectedBundleId) || bundles[1];

  const handleCheckout = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const pricePerUnit = Math.round(activeBundle.price / activeBundle.qty);
    const bundleProduct = {
      ...product,
      price: pricePerUnit,
      title: `${product.title} (${activeBundle.name})`,
    };

    dispatch(
      addToCart({
        product: bundleProduct,
        quantity: activeBundle.qty,
        variant: activeBundle.name,
      })
    );

    router.push('/checkout');
  };

  const selectedGoalData = goals.find((g) => g.id === activeGoal) || goals[0];
  const activeDiffGroup = differencesData[diffTab];

  return (
    <div className="bg-[#FAF7F2] text-[#121A11] selection:bg-[#E8651B] selection:text-white min-h-screen font-sans antialiased overflow-x-hidden">
      {/* =========================================================
          1. LUXURY EDITORIAL TICKER
      ========================================================= */}
      <div className="w-full bg-[#122011] text-[#FAF7F2] py-2.5 px-4 text-xs font-semibold tracking-wider uppercase text-center border-b border-[#21381F] flex items-center justify-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#E8651B] animate-ping" />
        <span>Fresh Cold-Pressed Winter Lot • Ladakh Himalayan Reserve • 100% Raw Pulp • Zero Sugar</span>
      </div>

      {/* =========================================================
          2. LEAK-PROOF LUXURY APOTHECARY HEADER
      ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#E7DFD3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-22 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#182B17] text-[#FAF7F2] flex items-center justify-center font-serif text-xl font-bold shadow-md ring-2 ring-[#E8651B]/20">
              NM
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#142313] block leading-none">
                NATURE<span className="text-[#E8651B]">MEDICA</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#697268] block mt-1">
                Himalayan Apothecary
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#142313] bg-white px-4 py-2 rounded-full border border-[#E7DFD3] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AYUSH GMP Certified • NABL Lab Verified</span>
            </div>

            <a
              href="https://wa.me/917080403322?text=Hi%20Nature%20Medica,%20I%20have%20questions%20about%20Pure%20Sea%20Buckthorn%20Juice"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#142313] hover:text-white hover:bg-[#142313] transition-all bg-white px-4 py-2.5 rounded-full border border-[#E7DFD3] shadow-sm cursor-pointer"
            >
              <FiPhoneCall className="w-3.5 h-3.5 text-[#E8651B]" />
              <span>Ayurvedic Desk</span>
            </a>
          </div>
        </div>
      </header>

      {/* =========================================================
          3. HERO SECTION: AESTHETIC HIGH-FASHION EDITORIAL LAYOUT
      ========================================================= */}
      <section className="pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Editorial Sub-Heading Tag */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#697268] mb-4">
          <span className="bg-[#EFE8DD] text-[#142313] px-3.5 py-1.5 rounded-full border border-[#DDD3C2] shadow-sm">
            High-Altitude Reserve • 14,000+ FT
          </span>
          <span className="text-[#E8651B] font-extrabold">•</span>
          <span>Earth&apos;s Rarest Botanical Omega-7</span>
          <span className="text-[#E8651B] font-extrabold">•</span>
          <span>Zero Added Sugar or Water</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ================= LEFT COLUMN: EDITORIAL ARTWORK & INTERACTIVE HOTSPOTS (Col 6) ================= */}
          <div className="lg:col-span-6 space-y-5">
            {/* Main Stage Image with Interactive Hotspots */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#EFE8DC] via-[#E7DED0] to-[#DFD4C4] border border-[#DDD3C2] shadow-2xl aspect-[4/5] flex items-center justify-center p-6 group">
              <img
                src={gallery[activeImg].url}
                alt={gallery[activeImg].caption}
                className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Floating Top Left Pill */}
              <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 border border-[#E7DFD3] shadow-md flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8651B] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#142313]">
                  100% Cold-Pressed Pulp
                </span>
              </div>

              {/* Interactive Hotspot 1: Golden Berry Oil (Top of Bottle) */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 1 ? null : 1)}
                className="absolute top-[28%] right-[18%] w-8 h-8 rounded-full bg-[#E8651B] text-white flex items-center justify-center shadow-xl ring-4 ring-white/60 animate-bounce cursor-pointer z-20"
                title="Tap to see Omega-7 Oil details"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              {activeHotspot === 1 && (
                <div className="absolute top-[34%] right-[10%] max-w-[220px] bg-[#142313] text-white text-xs p-3.5 rounded-2xl shadow-2xl border border-white/20 z-30 animate-fadeIn">
                  <p className="font-bold text-[#F7934C] text-[11px] uppercase tracking-wider">
                    Golden Berry Oil Layer
                  </p>
                  <p className="text-[11px] text-white/80 mt-1 leading-snug">
                    Natural unstripped fruit oil rich in rare Omega-7 (Palmitoleic acid) that repairs skin and gut mucosa.
                  </p>
                </div>
              )}

              {/* Interactive Hotspot 2: 12x Vitamin C Core (Center of Bottle) */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 2 ? null : 2)}
                className="absolute top-[52%] left-[18%] w-8 h-8 rounded-full bg-[#182B17] text-white flex items-center justify-center shadow-xl ring-4 ring-white/60 cursor-pointer z-20"
                title="Tap to see Vitamin C details"
              >
                <Zap className="w-4 h-4 text-[#E8651B]" />
              </button>
              {activeHotspot === 2 && (
                <div className="absolute top-[58%] left-[10%] max-w-[220px] bg-[#142313] text-white text-xs p-3.5 rounded-2xl shadow-2xl border border-white/20 z-30 animate-fadeIn">
                  <p className="font-bold text-[#F7934C] text-[11px] uppercase tracking-wider">
                    12x Bioactive Vitamin C
                  </p>
                  <p className="text-[11px] text-white/80 mt-1 leading-snug">
                    Whole berry ascorbic matrix with natural bioflavonoids for 4x faster cellular assimilation than pills.
                  </p>
                </div>
              )}

              {/* Floating Bottom Center Caption */}
              <div className="absolute bottom-5 inset-x-5 bg-[#142313]/90 text-white backdrop-blur-md rounded-2xl p-3.5 border border-white/10 shadow-lg text-center">
                <p className="text-xs font-bold tracking-tight">
                  {gallery[activeImg].caption}
                </p>
                <p className="text-[11px] text-white/70 mt-0.5 font-light">
                  {gallery[activeImg].sub}
                </p>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveImg(idx)}
                  className={`rounded-2xl p-2.5 border-2 transition-all flex flex-col items-center gap-1.5 bg-white text-left cursor-pointer ${
                    activeImg === idx
                      ? 'border-[#E8651B] shadow-md ring-2 ring-[#E8651B]/25'
                      : 'border-[#E7DFD3] hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#142313] line-clamp-1 w-full text-center">
                    {item.caption.split('•')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Micro Sensory Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white rounded-2xl p-4 border border-[#E7DFD3] shadow-sm text-center">
                <span className="block font-serif text-2xl font-bold text-[#E8651B]">
                  12x
                </span>
                <span className="text-[11px] font-bold text-[#697268] uppercase tracking-tight block mt-0.5">
                  Vitamin C of Oranges
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E7DFD3] shadow-sm text-center">
                <span className="block font-serif text-2xl font-bold text-[#142313]">
                  Omega 7
                </span>
                <span className="text-[11px] font-bold text-[#697268] uppercase tracking-tight block mt-0.5">
                  Rare Palmitoleic Acid
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#E7DFD3] shadow-sm text-center">
                <span className="block font-serif text-2xl font-bold text-emerald-700">
                  0%
                </span>
                <span className="text-[11px] font-bold text-[#697268] uppercase tracking-tight block mt-0.5">
                  Added Sugar or Water
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EDITORIAL COPY & BUNDLE SELECTOR (Col 6) ================= */}
          <div className="lg:col-span-6 space-y-7">
            <div>
              {/* Star Rating Badge */}
              <div className="inline-flex items-center gap-2 bg-[#EFE8DD] px-3.5 py-1.5 rounded-full border border-[#DDD3C2] mb-3">
                <div className="flex text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-amber-400 text-amber-400 w-3.5 h-3.5" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-[#142313]">4.9 / 5</span>
                <span className="text-xs text-[#697268] font-medium">• 480+ Verified Daily Drinkers</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#142313] tracking-tight leading-[1.1] mb-3">
                The Himalayan Gold Juice.
                <span className="font-serif italic font-normal block text-[#E8651B] mt-1 text-2xl sm:text-4xl">
                  Wild-harvested cold-pressed vitality.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#4F594E] leading-relaxed font-normal">
                Sourced from the raw, high-altitude Ladakh Himalayas. This is not ordinary diluted grocery juice. This is 100% thick, whole-berry pure pulp rich in rare <strong className="text-[#142313] font-bold">Omega-7</strong>, full-spectrum Omegas 3-6-9, and 190+ bio-active nutrients engineered by nature to repair mucosal tissues and ignite deep cellular radiance.
              </p>
            </div>

            {/* BUNDLE SUITE SELECTOR (The High-Converting Performance Engine) */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#142313]">
                  Select Your Regimen Pack:
                </span>
                <span className="text-xs text-[#E8651B] font-extrabold">
                  ⚡ Cash on Delivery & Free Shipping Available
                </span>
              </div>

              {bundles.map((bundle) => {
                const isSelected = selectedBundleId === bundle.id;
                return (
                  <div
                    key={bundle.id}
                    onClick={() => setSelectedBundleId(bundle.id)}
                    className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#E8651B] bg-white shadow-xl ring-2 ring-[#E8651B]/20'
                        : 'border-[#E7DFD3] bg-white/70 hover:border-gray-400 hover:bg-white'
                    }`}
                  >
                    {/* Badge */}
                    {bundle.isBest && (
                      <span className="absolute -top-3 left-6 bg-gradient-to-r from-[#E8651B] to-amber-600 text-white text-[10px] font-black tracking-widest uppercase px-3.5 py-0.5 rounded-full shadow-md">
                        {bundle.tag}
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        {/* Radio Dot */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[#E8651B] bg-[#E8651B]'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base sm:text-lg text-[#142313]">
                              {bundle.name}
                            </h3>
                          </div>
                          <p className="text-xs text-[#697268] font-medium">
                            {bundle.packText} • {bundle.supply}
                          </p>
                          <span className="inline-block mt-1 text-xs font-bold text-emerald-700">
                            {bundle.saveText} • {bundle.shipping}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-2xl sm:text-3xl font-black text-[#142313]">
                            ₹{bundle.price}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{bundle.mrp}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#E8651B] block">
                          {bundle.perBottle}
                        </span>
                      </div>
                    </div>

                    {/* Inclusions list */}
                    {bundle.inclusions && (
                      <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {bundle.inclusions.map((inc, iIdx) => (
                          <div key={iIdx} className="flex items-center gap-1.5 text-xs text-[#142313] font-medium">
                            <FiCheck className="text-emerald-600 w-3.5 h-3.5 flex-shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* MAIN CTA BUTTON */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-[#E8651B] hover:bg-[#D45610] text-white font-extrabold py-5 px-8 rounded-2xl shadow-xl shadow-[#E8651B]/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 text-lg sm:text-xl group cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Processing Secure Checkout...</span>
                  </span>
                ) : (
                  <>
                    <span>ORDER {activeBundle.name.toUpperCase()} — ₹{activeBundle.price}</span>
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-[#4F594E] font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <FiCheck className="text-emerald-600 w-4 h-4" />
                  Cash on Delivery Available
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiTruck className="text-emerald-600 w-4 h-4" />
                  Dispatches in 24 Hours
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiAward className="text-emerald-600 w-4 h-4" />
                  100% Purity Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. THE "DIFFERENCE ENGINE" (GIVE & DIFFERENCES)
      ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#142313] text-[#FAF7F2] relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8651B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8651B] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 inline-block mb-3">
              The Uncompromising Standard
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              The Raw Differences.
              <span className="font-serif italic font-normal block text-[#F7934C] text-2xl sm:text-4xl mt-1">
                Why Nature Medica stands completely alone.
              </span>
            </h2>
            <p className="text-sm text-white/70 mt-3 leading-relaxed">
              Most commercial brands sell reconstituted berry powder diluted with 80% tap water and artificial sugar. Select below to see the verified clinical differences:
            </p>

            {/* Interactive Mode Toggle */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'supermarket', label: 'vs Supermarket Juices' },
                { id: 'synthetic', label: 'vs Synthetic Vitamin C & Collagen Pills' },
                { id: 'antacids', label: 'vs Chemical Antacids (GERD)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDiffTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    diffTab === tab.id
                      ? 'bg-[#E8651B] text-white shadow-lg shadow-[#E8651B]/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Difference Cards Container */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-xs uppercase tracking-wider text-[#F7934C] font-extrabold mb-2 text-center">
              Active Comparison: {activeDiffGroup.tag}
            </div>

            {activeDiffGroup.rows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="rounded-3xl bg-white/5 hover:bg-white/[0.08] border border-white/10 p-6 sm:p-7 transition-all backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E8651B]" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {row.label}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {/* Nature Medica */}
                  <div className="bg-[#1C331B] border border-emerald-500/40 rounded-2xl p-4.5 space-y-1.5 shadow-inner">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Nature Medica (100% Pure Pulp)</span>
                    </span>
                    <p className="text-white font-medium leading-relaxed">
                      {row.nm}
                    </p>
                  </div>

                  {/* Competitor / Synthetic */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-rose-400 flex items-center gap-1.5">
                      <FiX className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Conventional Alternatives</span>
                    </span>
                    <p className="text-white/60 font-light leading-relaxed">
                      {row.other}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. PINTEREST LUXURY BENTO GRID: THE "WHY OMEGA-7" BOTANICAL STORY
      ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8651B] bg-[#FFF2E5] px-3.5 py-1.5 rounded-full border border-[#FED7AA] inline-block mb-3">
            Botanical Pharmacology
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#142313] tracking-tight">
            The 4 Biological Pillars.
            <span className="font-serif italic font-normal block text-[#E8651B] text-2xl sm:text-4xl mt-1">
              Why your body absorbs Sea Buckthorn instantly.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#4F594E] mt-3 leading-relaxed">
            Most plant foods only carry Omegas 3, 6, and 9. Sea Buckthorn is Earth&apos;s singular miracle berry that synthesizes rare Omega-7 (Palmitoleic acid) in dense concentration:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Bento Card 1: Skin & Collagen (Spans 7 cols) */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-gradient-to-br from-[#FFF4EB] to-[#FCE7D6] p-8 sm:p-10 border border-[#FCD5B5] shadow-lg flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E8651B] text-white flex items-center justify-center text-2xl shadow-md">
                  <Sparkles className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#C04C0F] bg-white/70 px-3 py-1 rounded-full border border-[#FCD5B5]">
                  Epithelial Regeneration
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#142313] mb-3">
                1. Deep Skin Glow & Collagen Synthesis
              </h3>
              <p className="text-xs sm:text-sm text-[#4F594E] leading-relaxed">
                Topical serums only penetrate the dead outer stratum corneum. Palmitoleic acid (Omega-7) integrates directly into the phospholipid bilayer of living skin cells, restoring cellular elasticity, locking in deep moisture, and banishing stubborn flaky dryness from within.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#FCD5B5]/60 flex items-center justify-between">
              <span className="text-xs font-black text-[#C04C0F] tracking-tight">
                Replaces synthetic collagen powders
              </span>
              <span className="text-xs font-bold text-[#142313]">
                Visible dewy glow in 14 days →
              </span>
            </div>
          </div>

          {/* Bento Card 2: Gastric Mucosa (Spans 5 cols) */}
          <div className="lg:col-span-5 rounded-[2.5rem] bg-gradient-to-br from-[#F0F7EE] to-[#E3EFE0] p-8 sm:p-10 border border-[#CEE4C9] shadow-lg flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#182B17] text-white flex items-center justify-center text-2xl shadow-md">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-white/70 px-3 py-1 rounded-full border border-[#CEE4C9]">
                  Gastric Wall Shield
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#142313] mb-3">
                2. Stomach Mucosal & Ulcer Healing
              </h3>
              <p className="text-xs sm:text-sm text-[#4F594E] leading-relaxed">
                Natural berry lipophilic compounds coat the inflamed stomach and esophagus lining, providing immediate protective buffering against fiery stomach acid without suppressing natural digestive enzymes.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#CEE4C9]/60 flex items-center justify-between">
              <span className="text-xs font-black text-emerald-800 tracking-tight">
                Natural GERD & heartburn relief
              </span>
              <span className="text-xs font-bold text-[#142313]">
                Calms in 7 days →
              </span>
            </div>
          </div>

          {/* Bento Card 3: 12x Vitamin C (Spans 5 cols) */}
          <div className="lg:col-span-5 rounded-[2.5rem] bg-gradient-to-br from-[#FFF9EE] to-[#FEF0D4] p-8 sm:p-10 border border-[#FDE5B5] shadow-lg flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-md">
                  <FiSun className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-white/70 px-3 py-1 rounded-full border border-[#FDE5B5]">
                  12x Vitamin C
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#142313] mb-3">
                3. High-Altitude UV Antioxidant Shield
              </h3>
              <p className="text-xs sm:text-sm text-[#4F594E] leading-relaxed">
                Surpassing oranges and amla in natural ascorbic density, this whole-berry matrix scavenges free radicals, defends against atmospheric pollution smog, and sharpens white blood cell immune response.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#FDE5B5]/60 flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 tracking-tight">
                Superior to synthetic ascorbic pills
              </span>
              <span className="text-xs font-bold text-[#142313]">
                Zero stomach irritation →
              </span>
            </div>
          </div>

          {/* Bento Card 4: Cardio & Arterial Suppleness (Spans 7 cols) */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-gradient-to-br from-[#FFF0F0] to-[#FCE2E2] p-8 sm:p-10 border border-[#F8C6C6] shadow-lg flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex items-center justify-center text-2xl shadow-md">
                  <FiHeart className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-900 bg-white/70 px-3 py-1 rounded-full border border-[#F8C6C6]">
                  Arterial Suppleness
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#142313] mb-3">
                4. Cardiovascular Elasticity & Lipid Balance
              </h3>
              <p className="text-xs sm:text-sm text-[#4F594E] leading-relaxed">
                Bioactive Quercetin and Isorhamnetin flavonoids optimize endothelial nitric oxide synthesis, preserving smooth arterial flexibility and supporting balanced HDL/LDL cholesterol profiles.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#F8C6C6]/60 flex items-center justify-between">
              <span className="text-xs font-black text-rose-900 tracking-tight">
                100% Plant-Based Cardioprotective
              </span>
              <span className="text-xs font-bold text-[#142313]">
                Daily cardiovascular tonic →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. SENSORY & TASTE PROFILE (ELIMINATING TASTE OBJECTIONS)
      ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#EFE8DC] border-y border-[#DDD3C2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8651B]">
              Real Sensory Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#142313] tracking-tight mt-1">
              What Does Raw Himalayan Pulp Actually Taste Like?
            </h2>
            <p className="text-xs sm:text-sm text-[#4F594E] mt-2">
              Zero added sugar. Zero artificial flavors. An authentic Himalayan mountain punch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#DDD3C2] shadow-sm text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697268] block">
                Flavor Note
              </span>
              <span className="font-serif text-2xl font-bold text-[#142313] block">
                Tart Citrus-Berry
              </span>
              <p className="text-xs text-[#4F594E]">
                Invigorating natural tang akin to fresh passionfruit with a rich berry undertone.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#DDD3C2] shadow-sm text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697268] block">
                Sugar Level
              </span>
              <span className="font-serif text-2xl font-bold text-emerald-700 block">
                0% Added Sugar
              </span>
              <p className="text-xs text-[#4F594E]">
                100% natural low glycemic index. Completely safe for diabetics and clean keto diets.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#DDD3C2] shadow-sm text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697268] block">
                Texture
              </span>
              <span className="font-serif text-2xl font-bold text-[#E8651B] block">
                Thick Raw Pulp
              </span>
              <p className="text-xs text-[#4F594E]">
                Dense whole berry nectar with micro-droplets of natural berry oil suspended evenly.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#DDD3C2] shadow-sm text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697268] block">
                Absorption
              </span>
              <span className="font-serif text-2xl font-bold text-[#142313] block">
                Under 15 Mins
              </span>
              <p className="text-xs text-[#4F594E]">
                Bioactive water- and fat-soluble nutrients begin mucosal uptake immediately on empty stomach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. 30-DAY TRANSFORMATION TIMELINE
      ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8651B]">
            Clinical Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#142313] tracking-tight mt-1">
            What Happens to Your Body in 30 Days
          </h2>
          <p className="text-xs sm:text-sm text-[#4F594E] mt-2">
            Consistency is key. Here is the physiological progression reported by daily drinkers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E7DFD3] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#E8651B] bg-[#FFF2E5] px-3 py-1 rounded-full border border-[#FED7AA] inline-block">
              Days 1–7
            </span>
            <h3 className="text-base font-bold text-[#142313]">
              The Gut Soothing Phase
            </h3>
            <p className="text-xs text-[#4F594E] leading-relaxed">
              Fiery stomach burning, post-meal acidity, and morning throat irritation ease as natural plant lipids coat and soothe inflamed gastric mucosa.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E7DFD3] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#142313] bg-[#EFE8DD] px-3 py-1 rounded-full border border-[#DDD3C2] inline-block">
              Days 8–14
            </span>
            <h3 className="text-base font-bold text-[#142313]">
              The Cellular Dermal Bounce
            </h3>
            <p className="text-xs text-[#4F594E] leading-relaxed">
              Rare Omega-7 and Vitamin C reach dermal micro-capillaries. Morning skin flakiness disappears, and natural dewy hydration lasts all day.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E7DFD3] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
              Days 15–21
            </span>
            <h3 className="text-base font-bold text-[#142313]">
              Hair Root & Nail Fortification
            </h3>
            <p className="text-xs text-[#4F594E] leading-relaxed">
              Bio-sulfur and carotenoids reinforce hair follicle anchorage and brittle nails, significantly minimizing seasonal breakage.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E7DFD3] shadow-md space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              Days 22–30
            </span>
            <h3 className="text-base font-bold text-[#142313]">
              Full Metabolic Vitality Reset
            </h3>
            <p className="text-xs text-[#4F594E] leading-relaxed">
              Elevated daily stamina, optimized nutrient digestion, robust seasonal immune defense, and a lasting youthful radiant bounce across your body.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. THE 30-SECOND MORNING RITUAL
      ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#E7DFD3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8651B]">
              Daily Regimen
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#142313] tracking-tight mt-1">
              The 30-Second Morning Golden Shot
            </h2>
            <p className="text-xs sm:text-sm text-[#4F594E] mt-1">
              Takes less than 30 seconds to mix into your morning routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-7 border border-[#E7DFD3] text-center shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2E5] text-[#E8651B] text-2xl flex items-center justify-center mx-auto font-black shadow-inner">
                01
              </div>
              <h3 className="font-extrabold text-base text-[#142313]">
                Shake Gently for 3s
              </h3>
              <p className="text-xs text-[#697268] leading-relaxed">
                Natural berry fruit oils rise to the top of the bottle. Shake gently to blend the rich golden pulp evenly before opening.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#E7DFD3] text-center shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2E5] text-[#E8651B] text-2xl flex items-center justify-center mx-auto font-black shadow-inner">
                02
              </div>
              <h3 className="font-extrabold text-base text-[#142313]">
                Measure 20ml to 30ml
              </h3>
              <p className="text-xs text-[#697268] leading-relaxed">
                Use the free precision measuring beaker included in your order. Pour 20ml into a glass of room-temperature or lukewarm water (150ml).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#E7DFD3] text-center shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2E5] text-[#E8651B] text-2xl flex items-center justify-center mx-auto font-black shadow-inner">
                03
              </div>
              <h3 className="font-extrabold text-base text-[#142313]">
                Sip on Empty Stomach
              </h3>
              <p className="text-xs text-[#697268] leading-relaxed">
                Drink first thing after waking up. You can add 1 tsp of raw honey if you prefer a sweeter profile. Wait 20 minutes before breakfast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          9. VERIFIED REAL REVIEWS & SOCIAL PROOF
      ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8651B]">
              Social Proof & Clinical Satisfaction
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#142313] tracking-tight mt-1">
              Real Experiences From Daily Drinkers
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#E7DFD3] shadow-sm">
            <span className="text-2xl font-black text-[#142313]">4.9</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-amber-400 w-4 h-4" />
              ))}
            </div>
            <span className="text-xs text-[#697268] font-bold">480+ Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white p-7 border border-[#E7DFD3] shadow-md space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-amber-400 w-4 h-4" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#273326] leading-relaxed font-normal">
              &ldquo;I was skeptical because other brands taste like sweetened syrup. Nature Medica’s juice is tart, thick, and has the real orange berry oil aroma. Within 12 days, my chronic GERD and morning throat burning disappeared completely.&rdquo;
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-extrabold text-[#142313]">Vikas Singhania</span>
                <span className="text-[10px] text-[#697268]">Delhi NCR • Verified Buyer</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified 2-Pack
              </span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 border border-[#E7DFD3] shadow-md space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-amber-400 w-4 h-4" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#273326] leading-relaxed font-normal">
              &ldquo;My dermatologist suggested Omega-7 for winter skin flaking. I chose this instead of synthetic fish oil capsules. My skin has an actual glow, and makeup applies so smoothly without dry patches. Ordered the 3-bottle pack for my mother too!&rdquo;
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-extrabold text-[#142313]">Dr. Priya Rathore</span>
                <span className="text-[10px] text-[#697268]">Lucknow • Verified Buyer</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified 3-Pack
              </span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 border border-[#E7DFD3] shadow-md space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-amber-400 w-4 h-4" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#273326] leading-relaxed font-normal">
              &ldquo;Tremendous energy booster. I run 5km every morning and take this 30 mins prior. Muscle soreness is visibly reduced, and digestion is on clockwork. High Himalayan quality is evident in every sip.&rdquo;
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-extrabold text-[#142313]">Amanpreet Gill</span>
                <span className="text-[10px] text-[#697268]">Chandigarh • Verified Buyer</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified 2-Pack
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          10. FREQUENTLY ASKED QUESTIONS (OBJECTION KILLERS)
      ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8651B]">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#142313] tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3.5">
          {[
            {
              q: 'How does authentic pure Sea Buckthorn juice taste?',
              a: 'Pure wild Sea Buckthorn has a bold, tangy, citrus-berry profile with an authentic earthy kick. It contains zero added sugars or artificial sweeteners. If you prefer a milder taste, simply blend 1 teaspoon of raw organic honey into your diluted glass.',
            },
            {
              q: 'Why is Omega-7 so critical and rarely found in diets?',
              a: 'Omega-7 (Palmitoleic acid) is virtually nonexistent in everyday foods. It is the core building block for mucosal membranes—the protective barrier lining your digestive tract, stomach, eyes, and skin. Drinking it restores tissue hydration from the inside out.',
            },
            {
              q: 'Can I pay via Cash on Delivery (COD)?',
              a: 'Yes, Cash on Delivery is 100% available across 19,000+ Indian pincodes. You can also pay via instant UPI (Google Pay, PhonePe, Paytm) or cards for faster priority dispatch.',
            },
            {
              q: 'Can diabetics drink this juice?',
              a: 'Yes! Our juice contains 0% added sugar and has a very low natural glycemic load. In fact, clinical studies suggest Sea Buckthorn bioactives support healthy post-meal glucose sensitivity.',
            },
            {
              q: 'How long does a 500ml bottle last?',
              a: 'At the recommended dosage of 20ml to 25ml daily, one 500ml bottle lasts 20 to 25 days. Our 2-bottle pack gives you a complete 45 to 50 days cellular cycle, which is optimal for visible skin and gut transformation.',
            },
          ].map((faq, fIdx) => (
            <div
              key={fIdx}
              className="bg-white rounded-3xl border border-[#E7DFD3] overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                className="w-full p-5 sm:p-6 text-left font-bold text-sm sm:text-base text-[#142313] flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === fIdx ? 'rotate-180 text-[#E8651B]' : ''
                  }`}
                />
              </button>
              {openFaq === fIdx && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#4F594E] leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          11. BOTTOM TRUST FOOTER
      ========================================================= */}
      <footer className="bg-[#142313] text-[#FAF7F2] py-12 px-4 sm:px-8 border-t border-[#21381F]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white block">
              NATURE<span className="text-[#E8651B]">MEDICA</span>
            </span>
            <p className="text-xs text-[#A1ACA0] mt-1 max-w-md">
              AYUSH GMP Certified Botanical Apothecary. Sourced from the cold deserts of Ladakh.
            </p>
          </div>

          <div className="text-xs text-[#A1ACA0] space-y-1">
            <p>© {new Date().getFullYear()} Nature Medica. All Rights Reserved.</p>
            <p>1st Floor, Lucknow Heart Pre School, Sector 7, Vikas Nagar, Lucknow, UP</p>
            <p>Direct Support: +91 70804 03322 • naturemedica09@gmail.com</p>
          </div>
        </div>
      </footer>

      {/* =========================================================
          12. STICKY MOBILE CONVERSION BAR
      ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#DDD3C2] p-3 sm:hidden shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] font-black text-emerald-800 block uppercase tracking-tighter">
              {activeBundle.name.split(' ')[0]} ({activeBundle.qty} Bottle{activeBundle.qty > 1 ? 's' : ''})
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#142313]">
                ₹{activeBundle.price}
              </span>
              <span className="text-[11px] text-gray-400 line-through">
                ₹{activeBundle.mrp}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="flex-1 bg-[#E8651B] text-white font-black py-3.5 px-4 rounded-2xl text-sm shadow-lg shadow-[#E8651B]/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Order (COD)</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
