// Category intelligence for Nature Medica Ayurvedic Formulations
// Provides category-specific botanical actives, daily rituals, lab specs, and FAQs

export function detectProductCategory(product = {}) {
  const catSlug = (product?.category?.slug || '').toLowerCase();
  const catName = (product?.category?.name || '').toLowerCase();
  const catString = (typeof product?.category === 'string' ? product.category : '').toLowerCase();
  const title = (product?.title || '').toLowerCase();
  const tags = Array.isArray(product?.tags) ? product.tags.map(t => String(t).toLowerCase()) : [];
  const text = `${catSlug} ${catName} ${catString} ${title} ${tags.join(' ')}`;

  // 1. Face Serum
  if (
    text.includes('serum') || 
    text.includes('tailam') || 
    text.includes('dropper') || 
    text.includes('kumkumadi') ||
    text.includes('alpha arbutin') ||
    text.includes('niacinamide') ||
    text.includes('glow oil')
  ) {
    return 'serum';
  }

  // 2. Creams & Moisturizers
  if (
    text.includes('cream') || 
    text.includes('cold cream') || 
    text.includes('night gel') || 
    text.includes('moisturizer') || 
    text.includes('ghrita') || 
    text.includes('butter') ||
    text.includes('lotion')
  ) {
    return 'cream';
  }

  // 3. Shilajit & Ayurvedic Vitality / Resins
  if (
    text.includes('shilajit') || 
    text.includes('resin') || 
    text.includes('swarna') || 
    text.includes('ashwagandha') || 
    text.includes('stamina') || 
    text.includes('vitality') || 
    text.includes('rasayana') ||
    text.includes('fulvic') ||
    text.includes('musli')
  ) {
    return 'shilajit';
  }

  // 4. Toothpaste & Oral Care
  if (
    text.includes('tooth') || 
    text.includes('oral') || 
    text.includes('dental') || 
    text.includes('manjan') || 
    text.includes('dant') || 
    text.includes('clove') ||
    text.includes('miswak') ||
    text.includes('gum')
  ) {
    return 'toothpaste';
  }

  // 5. Hair Care & Shampoo
  if (
    text.includes('shampoo') || 
    text.includes('cleanser') && text.includes('hair') ||
    text.includes('hair oil') || 
    text.includes('bhringraj') || 
    text.includes('kesh') ||
    text.includes('scalp')
  ) {
    return 'shampoo';
  }

  return 'general';
}

export const CATEGORY_DATA = {
  serum: {
    categoryLabel: 'Ayurvedic Face Serum',
    actives: [
      {
        name: 'Kumkumadi Tailam & Kashmiri Saffron (Kesar)',
        percentage: '26-Herb Infusion',
        role: 'Penetrates deep into dermal layers to inhibit melanin hyperactivity, fade stubborn pigmentation, and restore an authentic golden Ayurvedic glow.'
      },
      {
        name: 'Licorice Root Extract (Yashtimadhu)',
        percentage: 'Pure Glabridin 10%',
        role: 'Clinically proven natural tyrosinase inhibitor that evens skin tone, calms redness, and visibly diminishes dark spots and blemishes.'
      },
      {
        name: 'Indian Gooseberry (Wild Amla)',
        percentage: 'Active Natural Vit C',
        role: 'Potent antioxidant shield combating oxidative photo-damage, neutralizing environmental pollutants, and stimulating healthy collagen renewal.'
      },
      {
        name: 'Botanical Hyaluronic & Aloe Vera',
        percentage: 'Multi-Depth Hydration',
        role: 'Delivers lightweight, non-comedogenic moisture deep into skin cells, plumping fine lines without leaving any sticky residue.'
      }
    ],
    ritual: {
      steps: [
        'Cleanse face thoroughly with a mild herbal face wash. Gently pat skin with a soft towel, leaving it slightly damp.',
        'Dispense 3 to 4 drops of active serum onto forehead, cheeks, and chin using the precision glass dropper.',
        'Gently press and pat into skin using upward circular motions. Allow 90 seconds for deep cellular absorption before applying moisturizer or SPF.'
      ],
      timing: ['AM', 'PM'],
      precautions: 'For topical facial use only. Patch test recommended on inner elbow or jawline 24 hours prior to first full application. Avoid direct contact with eyes.'
    },
    faqs: [
      {
        question: 'Can I layer this serum under my daily sunscreen and makeup?',
        answer: 'Yes! Nature Medica serums are ultra-lightweight and absorb completely in 90 seconds without leaving an oily or sticky film. Apply on clean skin first, let it absorb, then follow with your sunscreen or makeup.'
      },
      {
        question: 'How soon can I expect visible results on pigmentation and dark spots?',
        answer: 'Most users observe enhanced hydration and skin radiance within 7 to 10 days. Fading of stubborn hyperpigmentation, sun spots, and acne marks typically shows significant improvement after 4 to 6 weeks of consistent twice-daily application.'
      },
      {
        question: 'Is this formulation non-comedogenic and suitable for oily/acne-prone skin?',
        answer: 'Yes. It contains zero pore-clogging mineral oils, zero silicones, and zero synthetic parabens. The light botanical formula balances excess sebum production while keeping the skin barrier fortified.'
      }
    ],
    skinTypes: ['All Skin Types', 'Pigmented & Dull Skin', 'Sensitive Skin Safe', 'Combination'],
    skinConcerns: ['Hyperpigmentation', 'Dark Spots & Melasma', 'Uneven Skin Tone', 'Dull Complexion'],
    labSpecs: [
      { parameter: 'Lead (Pb)', result: '< 0.2 ppm', standard: 'AYUSH Limit: 10 ppm', status: 'Passed (Heavy Metal Free)' },
      { parameter: 'Mercury (Hg)', result: 'Not Detected (< 0.01 ppm)', standard: 'AYUSH Limit: 1 ppm', status: 'Passed' },
      { parameter: 'Arsenic (As)', result: '< 0.1 ppm', standard: 'AYUSH Limit: 3 ppm', status: 'Passed' },
      { parameter: 'Cadmium (Cd)', result: 'Not Detected (< 0.05 ppm)', standard: 'AYUSH Limit: 0.3 ppm', status: 'Passed' },
      { parameter: 'pH Balance', result: '5.2 - 5.6 (Skin Neutral)', standard: 'Target: 5.0 - 6.0', status: 'Passed' },
      { parameter: 'Microbial Pathogens', result: 'Zero (Absent)', standard: 'ISO 17025 Standard', status: 'Passed' }
    ]
  },

  cream: {
    categoryLabel: 'Ayurvedic Face & Body Cream',
    actives: [
      {
        name: 'Shata Dhauta Ghrita (100x Washed A2 Ghee)',
        percentage: 'Vedic Copper-Chnrned',
        role: 'Ancient Ayurvedic therapeutic lipid washed 100 times in sacred copper vessels. Deeply penetrates all seven layers of skin to repair the lipid barrier.'
      },
      {
        name: 'Cold-Pressed Sweet Almond Oil (Badam Rogan)',
        percentage: '100% Pure Virgin',
        role: 'Abundant in natural Vitamin E and omega fatty acids that seal in lasting moisture, smooth micro-cracks, and soften dry, flaky patches.'
      },
      {
        name: 'Gotu Kola (Centella Asiatica) & Chandan',
        percentage: 'Active Herbal Elixir',
        role: 'Stimulates natural collagen synthesis, soothes redness and burning sensations, and envelops skin in a soothing natural cooling shield.'
      },
      {
        name: 'Kashmiri Saffron & Manjistha Extract',
        percentage: 'Bio-Fermented Extract',
        role: 'Purifies the micro-dermal matrix, supports natural cell turnover, and imparts velvety soft suppleness throughout the day.'
      }
    ],
    ritual: {
      steps: [
        'Take a dime-sized amount of rich herbal cream onto clean fingertips and warm slightly between palms to melt natural plant lipids.',
        'Dot evenly across cleansed face, neck, and throat area.',
        'Gently massage in upward and outward strokes for 60 seconds until absorbed. Use twice daily for 24-hour barrier protection.'
      ],
      timing: ['AM', 'PM'],
      precautions: 'For external use only. Keep away from direct heat and sunlight. Store below 30°C. Perform patch test if you have sensitive skin.'
    },
    faqs: [
      {
        question: 'Does this cream leave a greasy, sticky, or heavy layer on skin?',
        answer: 'No. Thanks to our authentic 100x washed ghee base, the particle size is reduced to a microscopic nano-emulsion that melts into the skin instantly, leaving a velvety soft finish rather than a greasy film.'
      },
      {
        question: 'Can I use this cream during hot or humid weather?',
        answer: 'Yes. The formulation is balanced and breathable. During humid weather, a smaller pea-sized portion provides optimal barrier protection without suffocating the skin.'
      },
      {
        question: 'Is it effective for extreme winter dryness, flaking, or barrier damage?',
        answer: 'Yes! It is specifically engineered to target compromised skin barriers, rough flaky patches, and moisture-depleted skin, providing immediate relief and long-term lipid replenishment.'
      }
    ],
    skinTypes: ['Dry to Very Dry Skin', 'Normal & Combination', 'Compromised Barrier', 'Sensitive Skin'],
    skinConcerns: ['Severe Dryness & Flaking', 'Dehydration', 'Rough Texture', 'Fine Dehydration Lines'],
    labSpecs: [
      { parameter: 'Lead (Pb)', result: '< 0.3 ppm', standard: 'AYUSH Limit: 10 ppm', status: 'Passed (Heavy Metal Free)' },
      { parameter: 'Mercury (Hg)', result: 'Not Detected (< 0.01 ppm)', standard: 'AYUSH Limit: 1 ppm', status: 'Passed' },
      { parameter: 'Arsenic (As)', result: '< 0.1 ppm', standard: 'AYUSH Limit: 3 ppm', status: 'Passed' },
      { parameter: 'Cadmium (Cd)', result: 'Not Detected (< 0.05 ppm)', standard: 'AYUSH Limit: 0.3 ppm', status: 'Passed' },
      { parameter: 'Thermal Stability', result: 'Stable at 45°C', standard: 'Pharmacopoeial Test', status: 'Passed' },
      { parameter: 'Microbiological Assay', result: 'Total Plate Count < 10 cfu/g', standard: 'AYUSH GMP Standard', status: 'Passed' }
    ]
  },

  shilajit: {
    categoryLabel: 'Pure Himalayan Shilajit & Vitality',
    actives: [
      {
        name: 'Pure Himalayan Shilajit Resin',
        percentage: '>75% Fulvic Acid',
        role: 'Hand-sourced from 18,000+ ft pristine Himalayan rock strata. Supplies 84+ bio-available ionic trace minerals to enhance cellular ATP energy and stamina.'
      },
      {
        name: 'Swarna Bhasma (Purified 24K Gold Ash)',
        percentage: 'Vedic Rasayana',
        role: 'Celebrated classical Ayurvedic Rasayana that revitalizes tissue immunity, supports healthy testosterone production, and rejuvenates bodily vigor.'
      },
      {
        name: 'Organic Gokshura & Ashwagandha',
        percentage: 'Standardized Withanolides',
        role: 'Regulates healthy cortisol stress levels, enhances endurance during physical exertion, and speeds up deep muscle tissue recovery.'
      },
      {
        name: 'Safed Musli & Kaunch Beej',
        percentage: 'Purified Herbal Extract',
        role: 'Traditional rejuvenator promoting reproductive vitality, physical stamina, and deep restorative sleep cycles.'
      }
    ],
    ritual: {
      steps: [
        'Using the provided brass measuring spoon, scoop a pea-sized portion of pure resin (approx. 300 mg to 500 mg).',
        'Stir completely into 100-150 ml of lukewarm milk, green tea, or warm water until fully dissolved (~90 seconds).',
        'Consume once daily on an empty stomach in the morning or 30 minutes before bed. Maintain a steady 6-8 week cycle for compounding results.'
      ],
      timing: ['AM', 'PM'],
      precautions: 'Do not exceed the recommended daily serving. Ensure adequate hydration (2.5 - 3 litres of water daily). Consult your healthcare physician if you take prescription blood pressure medication or are pregnant/lactating.'
    },
    faqs: [
      {
        question: 'How do I know this Shilajit is 100% authentic and pure?',
        answer: 'Every jar comes from certified high-altitude Himalayan sourcing and is purified using classical Ayurvedic Shodhana techniques. Every batch is independently tested by an accredited NABL laboratory, verifying >75% Fulvic Acid, 84+ ionic trace minerals, and complete absence of heavy metals.'
      },
      {
        question: 'How quickly can I notice improvements in stamina and vitality?',
        answer: 'Most users report heightened alertness, reduced afternoon lethargy, and consistent physical stamina within 5 to 7 days. Compounding physical recovery, reproductive vigor, and muscle endurance peak at 3 to 4 weeks of regular use.'
      },
      {
        question: 'Does this Shilajit contain added sugar, heavy metals, or chemical binders?',
        answer: 'Zero additives. It contains 100% pure semi-solid resin with no maltodextrin, no artificial preservatives, and no heavy metal contaminants like lead, arsenic, or mercury.'
      }
    ],
    skinTypes: ['Adults (18+)', 'Fitness & Athletes', 'Working Professionals', 'Vitality Seekers'],
    skinConcerns: ['Chronic Fatigue', 'Low Stamina & Energy', 'High Stress & Cortisol', 'Slow Workout Recovery'],
    labSpecs: [
      { parameter: 'Fulvic Acid Content', result: '78.4% (Assayed)', standard: 'Minimum Target: >70%', status: 'Passed (Gold Grade)' },
      { parameter: 'Lead (Pb)', result: '< 0.4 ppm', standard: 'AYUSH Limit: 10 ppm', status: 'Passed (Lead Free)' },
      { parameter: 'Mercury (Hg)', result: 'Not Detected (< 0.01 ppm)', standard: 'AYUSH Limit: 1 ppm', status: 'Passed' },
      { parameter: 'Arsenic (As)', result: '< 0.15 ppm', standard: 'AYUSH Limit: 3 ppm', status: 'Passed' },
      { parameter: 'Cadmium (Cd)', result: 'Not Detected (< 0.05 ppm)', standard: 'AYUSH Limit: 0.3 ppm', status: 'Passed' },
      { parameter: '84+ Ionic Minerals', result: 'Confirmed Present (ICP-MS)', standard: 'NABL Certified Standard', status: 'Passed' }
    ]
  },

  toothpaste: {
    categoryLabel: 'Ayurvedic Toothpaste & Oral Care',
    actives: [
      {
        name: 'Pure Clove Essential Oil (Laung)',
        percentage: 'Pure Distilled Active',
        role: 'Celebrated natural dental remedy that rapidly numbs tooth sensitivity, eliminates bad breath bacteria, and provides instant soothing comfort to gums.'
      },
      {
        name: 'Bakul Bark (Mimusops Elengi) & Babool',
        percentage: 'Astringent Tannin Extract',
        role: 'Ancient Ayurvedic herbs that strengthen spongy gum tissue, arrest minor gum bleeding, and firmly anchor tooth roots.'
      },
      {
        name: 'Miswak (Salvadora Persica) & Neem',
        percentage: 'Natural Fluoride-Free Bio-Shield',
        role: 'Inhibits dental plaque biofilm formation, neutralizes harmful oral acids, and maintains balanced oral microbiome hygiene.'
      },
      {
        name: 'Tomar Seed & Pudina Satva (Menthol)',
        percentage: 'Natural Mineral Polish',
        role: 'Gently polishes surface stains from tea, coffee, and spices without abrading tooth enamel, providing 12-hour crisp breath freshness.'
      }
    ],
    ritual: {
      steps: [
        'Squeeze a pea-sized amount of herbal toothpaste onto an ultra-soft bamboo or herbal bristle toothbrush.',
        'Brush with gentle circular and vertical strokes along all tooth surfaces and gum margins for 2 full minutes.',
        'Spit out thoroughly and rinse mouth with clean water. Avoid eating or drinking for 15 minutes post-brushing for maximum herbal efficacy.'
      ],
      timing: ['AM', 'PM'],
      precautions: 'For dental cleaning only. Do not swallow. Children under 6 years of age should brush under adult supervision with a rice-grain sized quantity.'
    },
    faqs: [
      {
        question: 'Is this toothpaste 100% fluoride-free and SLS-free?',
        answer: 'Yes! It is crafted without synthetic fluoride, sodium lauryl sulfate (SLS), artificial sweetening saccharin, or harsh foaming detergents. It cleans effectively using traditional botanical saponins.'
      },
      {
        question: 'Does it help with bleeding gums and sensitive teeth?',
        answer: 'Yes. The concentrated presence of Clove, Bakul, and Babool provides noticeable relief from sensitivity to hot/cold drinks and helps tighten spongy gums within 7 to 10 days of twice-daily brushing.'
      },
      {
        question: 'Will this herbal toothpaste erode or scratch tooth enamel?',
        answer: 'No. Unlike chemical whitening pastes with high RDA abrasive values, Nature Medica toothpaste utilizes micro-fine botanical polishing agents that preserve protective enamel integrity.'
      }
    ],
    skinTypes: ['All Adults & Children', 'Sensitive Teeth & Gums', 'Bleeding Gum Relief', 'Daily Oral Hygiene'],
    skinConcerns: ['Tooth Sensitivity', 'Bleeding & Spongy Gums', 'Plaque Biofilm', 'Persistent Morning Breath'],
    labSpecs: [
      { parameter: 'Lead (Pb)', result: '< 0.2 ppm', standard: 'AYUSH Limit: 10 ppm', status: 'Passed (Heavy Metal Free)' },
      { parameter: 'Mercury (Hg)', result: 'Not Detected (< 0.01 ppm)', standard: 'AYUSH Limit: 1 ppm', status: 'Passed' },
      { parameter: 'Fluoride Content', result: 'Zero (Synthetic Fluoride Free)', standard: '100% Botanical Standard', status: 'Passed' },
      { parameter: 'SLS / Surfactant', result: 'Zero (Non-foaming SLS Free)', standard: 'Ayurvedic Pharmacopoeia', status: 'Passed' },
      { parameter: 'Heavy Metals (As, Cd)', result: 'Below Detectable Limits', standard: 'NABL Certified Standard', status: 'Passed' },
      { parameter: 'Microbial Purity', result: 'Zero Pathogens (Absent)', standard: 'AYUSH GMP Standard', status: 'Passed' }
    ]
  },

  shampoo: {
    categoryLabel: 'Ayurvedic Hair Cleanser & Care',
    actives: [
      {
        name: 'Bhringraj Extract (Eclipta Alba)',
        percentage: 'Kesharaja Infusion',
        role: "The revered 'King of Hair' in Ayurveda. Deeply stimulates scalp microcirculation to nourish dormant follicles and curb hair fall."
      },
      {
        name: 'Wild Amla & Shikakai Saponins',
        percentage: 'Cold-Pressed Extraction',
        role: 'Natural botanical foaming agents that gently sweep away excess sebum and environmental dust without stripping the delicate scalp lipid barrier.'
      },
      {
        name: 'Hibiscus & Neem Flower',
        percentage: 'Herbal Elixir',
        role: 'Balances scalp pH, keeps flakiness and itching at bay, and coats hair strands in natural plant conditioning mucilage for glossy bounce.'
      },
      {
        name: 'Methi (Fenugreek) & Brahmi',
        percentage: 'Phyto-Protein Shield',
        role: 'Replenishes natural keratin building blocks, seals split ends, and leaves hair visibly fuller and softer with every wash.'
      }
    ],
    ritual: {
      steps: [
        'Drench hair and scalp thoroughly with lukewarm water. Dispense 2-3 pumps onto wet palms and rub together to create a light herbal lather.',
        'Massage into the scalp using circular fingertip motions for 2 to 3 minutes to stimulate blood flow to the hair roots.',
        'Rinse thoroughly with lukewarm or cool water. For heavily oiled hair, follow with a gentle second rinse.'
      ],
      timing: ['AM'],
      precautions: 'For external hair and scalp use only. Keep away from direct contact with eyes. Rinse immediately with cold water if accidental contact occurs.'
    },
    faqs: [
      {
        question: 'Is this shampoo safe for daily use and chemically/color-treated hair?',
        answer: 'Yes! It is 100% free from sulfates, silicones, parabens, and synthetic dyes. Its gentle botanical formula cleanses while protecting your natural scalp moisture and hair color vitality.'
      },
      {
        question: 'How many washes does it take to see visible reduction in hair fall?',
        answer: 'Most users experience a cleaner scalp and noticeably reduced hair shedding in the shower within 2 to 3 weeks of consistent use (2-3 times per week).'
      },
      {
        question: 'Does it dry out or tangles hair strands without chemical conditioners?',
        answer: 'No. The inclusion of Hibiscus, Aloe, and Amla extracts provides natural plant conditioning that detangles and smooths hair cuticles naturally.'
      }
    ],
    skinTypes: ['All Hair Types', 'Dry & Damaged Scalp', 'Color-Treated Safe', 'Oily Scalp'],
    skinConcerns: ['Excessive Hair Shedding', 'Dry & Itchy Scalp', 'Dull & Brittle Strands', 'Split Ends'],
    labSpecs: [
      { parameter: 'Lead (Pb)', result: '< 0.3 ppm', standard: 'AYUSH Limit: 10 ppm', status: 'Passed (Heavy Metal Free)' },
      { parameter: 'Mercury (Hg)', result: 'Not Detected (< 0.01 ppm)', standard: 'AYUSH Limit: 1 ppm', status: 'Passed' },
      { parameter: 'Sulfate & Silicone', result: 'Zero (100% Free)', standard: 'Clean Formulation Standard', status: 'Passed' },
      { parameter: 'pH Balance', result: '5.5 (Scalp Neutral)', standard: 'Target: 5.0 - 6.0', status: 'Passed' },
      { parameter: 'Heavy Metals (As, Cd)', result: 'Below Detectable Limits', standard: 'NABL Certified Standard', status: 'Passed' },
      { parameter: 'Microbial Pathogens', result: 'Zero (Absent)', standard: 'AYUSH GMP Standard', status: 'Passed' }
    ]
  },

  general: {
    categoryLabel: 'Authentic Ayurvedic Formulation',
    actives: [
      {
        name: 'Standardized Ashwagandha & Triphala',
        percentage: 'Pure Herbal Extract',
        role: 'Classical Ayurvedic Rasayana combining three sacred myrobalans and rejuvenating roots to support vitality and cellular rejuvenation.'
      },
      {
        name: 'Giloy (Guduchi) & Holy Tulsi',
        percentage: 'Bio-Active Infusion',
        role: 'Purifies bodily micro-channels, enhances natural immunity against environmental stressors, and maintains metabolic harmony.'
      },
      {
        name: 'Cold-Pressed Virgin Botanicals',
        percentage: 'Unrefined & Pure',
        role: 'Extracted without high heat to preserve delicate micronutrients, vitamins, and natural plant bio-compounds.'
      },
      {
        name: 'Licorice & Turmeric Curcumin',
        percentage: 'Standardized 95%',
        role: 'Provides broad-spectrum antioxidant protection, accelerates tissue repair, and supports natural systemic balance.'
      }
    ],
    ritual: {
      steps: [
        'Measure or dispense the recommended quantity as indicated on the product packaging.',
        'Apply evenly or consume as directed, following the usage guidance consistently.',
        'Incorporate into your daily wellness regimen at regular hours for compounding holistic benefits.'
      ],
      timing: ['AM', 'PM'],
      precautions: 'Read label carefully before use. Store in a cool, dry place away from direct sunlight. Keep out of reach of young children.'
    },
    faqs: [
      {
        question: 'What is the recommended duration of use for optimal results?',
        answer: 'Ayurvedic formulations work holistically with your physiology. For optimal benefits, regular use for at least 4 to 8 weeks is recommended alongside a nourishing diet and balanced lifestyle.'
      },
      {
        question: 'Does this product contain synthetic fillers or heavy metals?',
        answer: 'No. All Nature Medica products undergo rigorous pharmaceutical testing and are certified free from heavy metals (Lead, Mercury, Arsenic) and harmful synthetic additives.'
      },
      {
        question: 'What is the shelf life and proper storage condition?',
        answer: 'The shelf life is 24 months from the manufacturing date. Store in a cool, dry place away from direct moisture and sunlight.'
      }
    ],
    skinTypes: ['All Dosha Types', 'Vata-Pitta-Kapha Balanced', 'Daily Regimen Safe'],
    skinConcerns: ['Holistic Wellness', 'Vitality Depletion', 'Daily Rejuvenation'],
    labSpecs: [
      { parameter: 'Lead (Pb)', result: '< 0.3 ppm', standard: 'AYUSH Limit: 10 ppm', status: 'Passed (Heavy Metal Free)' },
      { parameter: 'Mercury (Hg)', result: 'Not Detected (< 0.01 ppm)', standard: 'AYUSH Limit: 1 ppm', status: 'Passed' },
      { parameter: 'Arsenic (As)', result: '< 0.1 ppm', standard: 'AYUSH Limit: 3 ppm', status: 'Passed' },
      { parameter: 'Cadmium (Cd)', result: 'Not Detected (< 0.05 ppm)', standard: 'AYUSH Limit: 0.3 ppm', status: 'Passed' },
      { parameter: 'Pesticide Residue', result: 'Below Detectable Limits', standard: 'NABL Certified Standard', status: 'Passed' },
      { parameter: 'Microbial Bio-Burden', result: 'Zero (Absent)', standard: 'AYUSH GMP Standard', status: 'Passed' }
    ]
  }
};
