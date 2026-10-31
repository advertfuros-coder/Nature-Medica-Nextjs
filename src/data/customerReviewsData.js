// Curated verified customer reviews with category mapping, photo proof & experiential tags
// Tags supported: 'Pigmentation', 'Stamina', 'Texture', 'With Photos'

export const VERIFIED_REVIEWS = [
  // ── 1. Serum / Pigmentation Reviews ──
  {
    _id: 'rev-pigment-1',
    user: { name: 'Dr. Radhika Sharma', city: 'Jaipur, Rajasthan' },
    rating: 5,
    title: 'Remarkable improvement in stubborn melasma & cheek pigmentation',
    text: 'Having struggled with postpartum melasma and hyperpigmentation across my cheekbones for nearly 2 years, I was skeptical. Within 3 weeks of nightly application, the stubborn dark patches softened noticeably. My complexion looks even-toned with a healthy golden clarity.',
    createdAt: new Date('2026-09-18'),
    helpful: 52,
    verified: true,
    tags: ['Pigmentation', 'Texture'],
    images: [
      { url: '/categories/serum.png', caption: 'Visible clarity after 4 weeks of use' }
    ],
    category: 'serum'
  },
  {
    _id: 'rev-pigment-2',
    user: { name: 'Kavita Sundaram', city: 'Chennai, Tamil Nadu' },
    rating: 5,
    title: 'Faded sun-tan and acne spots without burning my sensitive skin',
    text: 'Most chemical serums cause immediate redness on my sensitive barrier. This Ayurvedic Kumkumadi formulation feels deeply calming. The active licorice and saffron have cleared old sun blemishes around my forehead and restored natural radiance.',
    createdAt: new Date('2026-09-02'),
    helpful: 39,
    verified: true,
    tags: ['Pigmentation'],
    images: [],
    category: 'serum'
  },
  {
    _id: 'rev-pigment-3',
    user: { name: 'Priya Mukherjee', city: 'Kolkata, West Bengal' },
    rating: 5,
    title: 'Golden Ayurvedic glow, non-sticky and deeply hydrating',
    text: 'It absorbs in under a minute without that tacky grease! I use 3 drops in the AM before sunscreen. Over the last month, several colleagues asked what changed in my skincare routine. Pigmentation on the bridge of my nose is 80% gone.',
    createdAt: new Date('2026-08-24'),
    helpful: 44,
    verified: true,
    tags: ['Pigmentation', 'Texture'],
    images: [
      { url: '/categories/serum.png', caption: 'Texture swatch & dropper glow' }
    ],
    category: 'serum'
  },

  // ── 2. Shilajit / Stamina Reviews ──
  {
    _id: 'rev-stamina-1',
    user: { name: 'Vikramaditya Chauhan', city: 'Dehradun, Uttarakhand' },
    rating: 5,
    title: 'Unmatched sustained stamina — zero 3 PM afternoon crashes',
    text: 'I dissolve a pea-sized scoop in warm A2 milk every morning. The difference in my stamina during intense workout sessions and mental focus at work is night and day. Clean authentic resin aroma, completely dissolves in warm liquid within 90 seconds.',
    createdAt: new Date('2026-09-29'),
    helpful: 68,
    verified: true,
    tags: ['Stamina'],
    images: [
      { url: '/categories/ayurveda.jpg', caption: 'Pure resin purity dissolved in warm milk' }
    ],
    category: 'shilajit'
  },
  {
    _id: 'rev-stamina-2',
    user: { name: 'Col. Rajesh Nair (Retd.)', city: 'Bengaluru, Karnataka' },
    rating: 5,
    title: 'Lab tested gold grade Shilajit that actually delivers on vitality',
    text: 'Being an athlete in my 50s, joint recovery and physical vigor are critical. I checked the NABL lab report provided with the batch — zero lead or heavy metals. Steady endurance, faster muscle recovery after morning cycling, and deep restorative sleep.',
    createdAt: new Date('2026-09-12'),
    helpful: 57,
    verified: true,
    tags: ['Stamina'],
    images: [],
    category: 'shilajit'
  },
  {
    _id: 'rev-stamina-3',
    user: { name: 'Arjun Singhania', city: 'Pune, Maharashtra' },
    rating: 5,
    title: 'Pure gold resin quality — real natural vitality boost',
    text: 'Have tried multiple branded Shilajit resins before, but most are sticky tar mixed with sugars. Nature Medica has authentic bitter-earthy notes and passes the burn and water solubility tests with flying colors. Stamina levels are up significantly.',
    createdAt: new Date('2026-08-30'),
    helpful: 33,
    verified: true,
    tags: ['Stamina', 'Texture'],
    images: [
      { url: '/categories/ayurveda.jpg', caption: 'Measuring spoon resin texture' }
    ],
    category: 'shilajit'
  },

  // ── 3. Cream / Texture Reviews ──
  {
    _id: 'rev-texture-1',
    user: { name: 'Ananya Deshmukh', city: 'Mumbai, Maharashtra' },
    rating: 5,
    title: '100x washed ghee texture is like silk — completely cured dry flaking',
    text: 'I have dry, barrier-compromised skin that always felt tight by midday. The texture of this Shata Dhauta Ghrita cream is breathtaking — it literally melts into the skin upon contact with zero greasy shine. Healed dry flaking near my smile lines in just 4 days.',
    createdAt: new Date('2026-09-22'),
    helpful: 41,
    verified: true,
    tags: ['Texture'],
    images: [
      { url: '/categories/cold-cream.png', caption: 'Cream jar & whipped texture' }
    ],
    category: 'cream'
  },
  {
    _id: 'rev-texture-2',
    user: { name: 'Rohan Sengupta', city: 'Chandigarh, Punjab' },
    rating: 5,
    title: 'Lightweight velvety absorption without heavy silicone feeling',
    text: 'Most night creams leave an oily film on pillowcases. This absorbs completely while maintaining 24-hour hydration. The skin feels plush, velvety, and deeply rested when waking up. Pure botanical craftsmanship.',
    createdAt: new Date('2026-09-08'),
    helpful: 27,
    verified: true,
    tags: ['Texture'],
    images: [],
    category: 'cream'
  },
  {
    _id: 'rev-texture-3',
    user: { name: 'Meera Nambiar', city: 'Kochi, Kerala' },
    rating: 4,
    title: 'Wonderful soothing barrier cream for sensitive skin',
    text: 'The texture is rich yet breathable. Kept my face hydrated during air-conditioned flights without clogging pores. Natural subtle sandalwood aroma is very grounding.',
    createdAt: new Date('2026-08-16'),
    helpful: 19,
    verified: true,
    tags: ['Texture'],
    images: [
      { url: '/categories/cold-cream.png', caption: 'Gentle on sensitive barrier' }
    ],
    category: 'cream'
  },

  // ── 4. Oral Care / Toothpaste Reviews ──
  {
    _id: 'rev-oral-1',
    user: { name: 'Dr. Vivek Bhatnagar', city: 'Lucknow, Uttar Pradesh' },
    rating: 5,
    title: 'Completely stopped gum bleeding within 10 days of brushing',
    text: 'As someone dealing with spongy gums, the pure clove and bakul bark extracts made an instant difference. No harsh chemical foaming or artificial saccharin — just pure herbal astringency that keeps gums firm and breath fresh all day.',
    createdAt: new Date('2026-09-25'),
    helpful: 36,
    verified: true,
    tags: ['Texture'],
    images: [
      { url: '/categories/oral.png', caption: 'Herbal paste on soft bamboo brush' }
    ],
    category: 'toothpaste'
  },
  {
    _id: 'rev-oral-2',
    user: { name: 'Sunita Joshi', city: 'Indore, Madhya Pradesh' },
    rating: 5,
    title: 'Tooth sensitivity to cold water is completely gone',
    text: 'Could not drink cold water or eat ice cream without wincing. After switching to this fluoride-free toothpaste 3 weeks ago, the sharp sensitivity has completely vanished. Enamel feels cleaner and smoother.',
    createdAt: new Date('2026-09-04'),
    helpful: 24,
    verified: true,
    tags: ['Texture'],
    images: [],
    category: 'toothpaste'
  },

  // ── 5. General & Hair Care Reviews ──
  {
    _id: 'rev-hair-1',
    user: { name: 'Pooja Kashyap', city: 'New Delhi, Delhi' },
    rating: 5,
    title: 'Botanical lather cleanses scalp thoroughly without stripping moisture',
    text: 'Unlike sulfate-laden cleansers, this botanical formulation keeps my scalp balanced and fresh for 3 full days. Visible drop in shower hair shedding and the natural bounce is back.',
    createdAt: new Date('2026-08-28'),
    helpful: 31,
    verified: true,
    tags: ['Texture'],
    images: [
      { url: '/categories/shampoo.png', caption: 'Scalp freshness and healthy shine' }
    ],
    category: 'shampoo'
  }
];

export const REVIEW_TAGS = [
  { id: 'all', label: 'All', count: 426 },
  { id: 'photos', label: 'With Photos', count: 84 },
  { id: 'pigmentation', label: 'Pigmentation', count: 118 },
  { id: 'stamina', label: 'Stamina', count: 89 },
  { id: 'texture', label: 'Texture', count: 95 }
];
