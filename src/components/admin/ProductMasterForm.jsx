'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiSave, FiTrash2, FiArrowLeft, FiUpload, FiX, FiStar, FiPlus, 
  FiCheck, FiExternalLink, FiCopy, FiInfo, FiAlertCircle, FiChevronRight,
  FiArrowUp, FiArrowDown, FiHelpCircle, FiSearch, FiDollarSign, FiBox, FiTruck,
  FiLoader, FiCloudRain
} from 'react-icons/fi';

const PRESET_SKIN_TYPES = [
  'All Skin Types',
  'Oily Skin',
  'Dry Skin',
  'Combination Skin',
  'Sensitive Skin',
  'Normal Skin',
  'Mature / Aging Skin'
];

const PRESET_SKIN_CONCERNS = [
  'Glow & Radiance',
  'Pigmentation & Dark Spots',
  'Fine Lines & Wrinkles',
  'Acne & Blemishes',
  'Skin Barrier Repair',
  'Deep Hydration',
  'Sun Damage & Tan Removal',
  'Uneven Texture',
  'Oil & Pore Control',
  'Dark Circles'
];

const PRESET_TRUST_BADGES = [
  '100% Ayurvedic Formulation',
  'Ayush Ministry Approved',
  'Dermatologically Tested',
  'Cruelty-Free & Vegan',
  'Toxin & Paraben Free',
  'GMP Certified Facility',
  'Clinically Proven Actives',
  'Ethically Sourced Herbs'
];

export default function ProductMasterForm({ 
  product = {}, 
  categories = [], 
  mode = 'edit' // 'create' | 'edit'
}) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    title: product?.title || '',
    tagline: product?.tagline || '',
    slug: product?.slug || '',
    description: product?.description || '',
    brand: product?.brand || 'Nature Medica',
    category: typeof product?.category === 'object' ? product?.category?._id : (product?.category || ''),
    price: product?.price !== undefined ? product.price : '',
    mrp: product?.mrp !== undefined ? product.mrp : '',
    costPerItem: product?.costPerItem || '',
    gstSlab: product?.gstSlab !== undefined ? product.gstSlab : 18,
    hsnCode: product?.hsnCode || '3304',
    sku: product?.sku || '',
    stock: product?.stock !== undefined ? product.stock : '',
    lowStockThreshold: product?.lowStockThreshold !== undefined ? product.lowStockThreshold : 5,
    netQuantity: product?.netQuantity || '30 ml',
    shelfLife: product?.shelfLife || '24 Months',
    weight: product?.weight || 150,
    dimensions: product?.dimensions || { length: 10, width: 5, height: 5 },
    isCodAvailable: product?.isCodAvailable !== undefined ? product.isCodAvailable : true,
    isFragile: product?.isFragile || false,
    isReturnable: product?.isReturnable !== undefined ? product.isReturnable : true,
    ingredients: product?.ingredients || '',
    precautions: product?.precautions || 'For external use only. Store in a cool, dry place. Patch test recommended before regular use.',
    visibility: product?.visibility !== undefined ? product.visibility : true,
    isBestSeller: product?.isBestSeller || false,
    isNewArrival: product?.isNewArrival || false,
    isFeatured: product?.isFeatured || false,
    customBadge: product?.customBadge || '',
    metaTitle: product?.seo?.metaTitle || '',
    metaDescription: product?.seo?.metaDescription || '',
    metaKeywords: product?.seo?.metaKeywords || '',
  });

  // Images state (Direct Cloudinary items)
  const [images, setImages] = useState(
    Array.isArray(product?.images) 
      ? product.images.map((img, idx) => {
          if (typeof img === 'string') {
            return { url: img, publicId: '', altText: '', isPrimary: idx === 0 };
          }
          return {
            url: img.url,
            publicId: img.publicId || '',
            altText: img.altText || '',
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0
          };
        })
      : []
  );

  // Uploading state
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');

  const [skinTypes, setSkinTypes] = useState(product?.skinTypes || ['All Skin Types']);
  const [skinConcerns, setSkinConcerns] = useState(product?.skinConcerns || []);
  const [keyActives, setKeyActives] = useState(
    Array.isArray(product?.keyActives) && product.keyActives.length > 0 
      ? product.keyActives 
      : [{ name: '', percentage: '', role: '' }]
  );
  const [usageTiming, setUsageTiming] = useState(product?.usageTiming || ['AM', 'PM']);
  const [howToUseSteps, setHowToUseSteps] = useState(
    Array.isArray(product?.howToUseSteps) && product.howToUseSteps.length > 0 
      ? product.howToUseSteps 
      : ['Cleanse face with lukewarm water.', 'Apply 2-3 drops evenly across face and neck.', 'Gently press into skin until fully absorbed.']
  );
  const [trustBadges, setTrustBadges] = useState(product?.trustBadges || ['100% Ayurvedic Formulation', 'Dermatologically Tested']);
  const [variants, setVariants] = useState(product?.variants || []);
  const [faqs, setFaqs] = useState(
    Array.isArray(product?.faqs) && product.faqs.length > 0 
      ? product.faqs 
      : [{ question: 'How long before I see noticeable results?', answer: 'Most users notice improved skin radiance and hydration within 2 to 3 weeks of consistent daily use.' }]
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(product?.tags || []);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);

  // Auto slug generator when title changes (in create mode)
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => {
      const shouldUpdateSlug = mode === 'create' || !prev.slug;
      return {
        ...prev,
        title: val,
        slug: shouldUpdateSlug 
          ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : prev.slug,
        metaTitle: prev.metaTitle || `${val} | Nature Medica`
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDimensionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  // Calculations
  const calculatedDiscount = useMemo(() => {
    const priceNum = parseFloat(formData.price) || 0;
    const mrpNum = parseFloat(formData.mrp) || 0;
    if (mrpNum > priceNum && priceNum > 0) {
      const discount = Math.round(((mrpNum - priceNum) / mrpNum) * 100);
      const savings = mrpNum - priceNum;
      return { discount, savings };
    }
    return { discount: 0, savings: 0 };
  }, [formData.price, formData.mrp]);

  const calculatedProfit = useMemo(() => {
    const priceNum = parseFloat(formData.price) || 0;
    const costNum = parseFloat(formData.costPerItem) || 0;
    if (priceNum > 0 && costNum > 0) {
      const grossProfit = priceNum - costNum;
      const margin = Math.round((grossProfit / priceNum) * 1000) / 10;
      return { grossProfit, margin };
    }
    return null;
  }, [formData.price, formData.costPerItem]);

  // ── INSTANT CLOUDINARY UPLOAD HANDLER ──
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    setUploadStatusMsg(`Uploading ${files.length} image${files.length > 1 ? 's' : ''} to Cloudinary...`);

    try {
      const uploadData = new FormData();
      files.forEach(file => {
        uploadData.append('files', file);
      });

      // Pass product id if in edit mode to directly attach & persist in DB
      if (mode === 'edit' && product?._id) {
        uploadData.append('productId', product._id);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data.images)) {
        setImages(prev => {
          const updated = [...prev];
          const hasExistingPrimary = updated.some(img => img.isPrimary);

          data.images.forEach((newImg, idx) => {
            updated.push({
              url: newImg.url,
              publicId: newImg.publicId || '',
              altText: newImg.altText || '',
              isPrimary: !hasExistingPrimary && updated.length === 0 && idx === 0
            });
          });

          // Guarantee first image is marked primary
          if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
            updated[0].isPrimary = true;
          }

          return updated;
        });

        setUploadStatusMsg(
          mode === 'edit' && product?._id
            ? '✅ Uploaded to Cloudinary and saved to database!'
            : '✅ Uploaded to Cloudinary!'
        );
        setTimeout(() => setUploadStatusMsg(''), 4500);
      } else {
        alert(`❌ Upload error: ${data.error || 'Failed to upload to Cloudinary'}`);
        setUploadStatusMsg('');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('❌ Failed to upload images to Cloudinary. Please check network connection.');
      setUploadStatusMsg('');
    } finally {
      setUploadingImages(false);
      if (e.target) e.target.value = '';
    }
  };

  // Set As Primary Image
  const setAsPrimary = (index) => {
    if (index === 0) return;
    setImages(prev => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.forEach(item => item.isPrimary = false);
      selected.isPrimary = true;
      updated.unshift(selected);
      return updated;
    });
  };

  // Move Image Order
  const moveImage = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    setImages(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      updated.forEach((img, idx) => {
        img.isPrimary = idx === 0;
      });
      return updated;
    });
  };

  // Remove Image (Cloudinary + DB sync)
  const removeExistingImage = async (index) => {
    const targetImg = images[index];
    if (!targetImg) return;

    if (!confirm('Are you sure you want to remove this image?')) return;

    // Remove from UI state
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });

    // If editing existing product, delete from DB & Cloudinary
    if (mode === 'edit' && product?._id) {
      try {
        await fetch('/api/admin/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: targetImg.url,
            publicId: targetImg.publicId,
            productId: product._id
          })
        });
      } catch (err) {
        console.error('Delete sync failed:', err);
      }
    }
  };

  const updateImageAlt = (index, alt) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, altText: alt } : img));
  };

  // Skin Types & Concerns Toggle
  const toggleSkinType = (type) => {
    setSkinTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSkinConcern = (concern) => {
    setSkinConcerns(prev => 
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const toggleTrustBadge = (badge) => {
    setTrustBadges(prev => 
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const toggleUsageTiming = (time) => {
    setUsageTiming(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  // Actives management
  const addActive = () => {
    setKeyActives(prev => [...prev, { name: '', percentage: '', role: '' }]);
  };
  const updateActive = (index, field, val) => {
    setKeyActives(prev => prev.map((item, i) => i === index ? { ...item, [field]: val } : item));
  };
  const removeActive = (index) => {
    setKeyActives(prev => prev.filter((_, i) => i !== index));
  };

  // How to use steps
  const addStep = () => {
    setHowToUseSteps(prev => [...prev, '']);
  };
  const updateStep = (index, val) => {
    setHowToUseSteps(prev => prev.map((s, i) => i === index ? val : s));
  };
  const removeStep = (index) => {
    setHowToUseSteps(prev => prev.filter((_, i) => i !== index));
  };

  // FAQs management
  const addFaq = () => {
    setFaqs(prev => [...prev, { question: '', answer: '' }]);
  };
  const updateFaq = (index, field, val) => {
    setFaqs(prev => prev.map((f, i) => i === index ? { ...f, [field]: val } : f));
  };
  const removeFaq = (index) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  // Variants management
  const addVariant = () => {
    setVariants(prev => [
      ...prev, 
      { name: '', value: '', price: formData.price || 0, mrp: formData.mrp || 0, stock: 10, sku: '' }
    ]);
  };
  const updateVariant = (index, field, val) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: val } : v));
  };
  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Tags management
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^,|,$/g, '');
      if (clean && !tags.includes(clean)) {
        setTags(prev => [...prev, clean]);
        setTagInput('');
      }
    }
  };
  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill all mandatory fields (Title, Selling Price, and Category)');
      return;
    }

    setSaving(true);

    try {
      // Ensure primary image at index 0
      const sortedImages = [...images];
      const primaryIdx = sortedImages.findIndex(img => img.isPrimary);
      if (primaryIdx > 0) {
        const [prim] = sortedImages.splice(primaryIdx, 1);
        sortedImages.unshift(prim);
      }
      sortedImages.forEach((img, idx) => {
        img.isPrimary = idx === 0;
      });

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.price),
        costPerItem: formData.costPerItem ? parseFloat(formData.costPerItem) : 0,
        gstSlab: parseFloat(formData.gstSlab || 18),
        stock: parseInt(formData.stock || 0),
        lowStockThreshold: parseInt(formData.lowStockThreshold || 5),
        weight: parseFloat(formData.weight || 150),
        images: sortedImages,
        featuredImage: sortedImages[0]?.url || '',
        skinTypes,
        skinConcerns,
        keyActives: keyActives.filter(a => a.name.trim()),
        usageTiming,
        howToUseSteps: howToUseSteps.filter(s => s.trim()),
        trustBadges,
        variants: variants.filter(v => v.name.trim()),
        faqs: faqs.filter(f => f.question.trim()),
        tags,
        seo: {
          metaTitle: formData.metaTitle || formData.title,
          metaDescription: formData.metaDescription || (formData.description ? formData.description.slice(0, 160) : ''),
          metaKeywords: formData.metaKeywords || tags.join(', ')
        }
      };

      const url = mode === 'create' 
        ? '/api/admin/products' 
        : `/api/admin/products/${product._id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert(mode === 'create' ? '✅ Product created successfully!' : '✅ Product updated successfully!');
        router.push('/admin/products');
      } else {
        alert(`❌ Error: ${data.error || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('❌ Failed to save product. Please check connection.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${formData.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Product deleted successfully');
        router.push('/admin/products');
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Failed to delete'}`);
      }
    } catch (err) {
      alert('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const copySlugUrl = () => {
    const fullUrl = `${window.location.origin}/products/${formData.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen pb-24 text-gray-900">
      {/* ── STICKY TOP APP BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-4 sm:px-8 py-3 mb-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition flex items-center gap-1.5 text-sm font-medium"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Products</span>
          </button>

          <div className="h-5 w-px bg-gray-200" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                {formData.title || 'Untitled Product'}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                formData.visibility 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {formData.visibility ? 'Published' : 'Draft'}
              </span>
            </div>
            {formData.tagline && (
              <p className="text-xs text-gray-500 truncate max-w-sm hidden sm:block">
                {formData.tagline}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {mode === 'edit' && formData.slug && (
            <Link
              href={`/products/${formData.slug}`}
              target="_blank"
              className="hidden md:flex items-center gap-1 text-xs font-semibold text-[#2d4e24] bg-[#eef5ec] hover:bg-[#dce9d8] px-3 py-2 rounded-lg transition"
            >
              <span>View PDP</span>
              <FiExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FiTrash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          )}

          <button
            type="submit"
            disabled={saving || uploadingImages}
            className="bg-[#2d4e24] hover:bg-[#233d1c] text-white px-5 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>{saving ? 'Saving...' : (mode === 'create' ? 'Create Product' : 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ════════════════ LEFT COLUMN (68%) ════════════════ */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. BASIC INFORMATION & BRAND */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>Basic Information & Branding</span>
                </h2>
                <span className="text-xs text-gray-400 font-medium">* Required</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    placeholder="e.g. 24K Gold & Saffron Radiance Face Serum (30ml)"
                    className="w-full text-sm font-medium border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2d4e24] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="e.g. Clinically proven Ayurvedic elixir for radiant, plump & spotless skin"
                    className="w-full text-sm border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2d4e24] transition"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">High-converting 1-liner displayed below the product title across cards and PDP header.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2d4e24] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      URL Slug
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                        placeholder="24k-gold-face-serum-30ml"
                      />
                      <button
                        type="button"
                        onClick={copySlugUrl}
                        className="px-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition flex items-center gap-1 text-xs font-medium cursor-pointer"
                        title="Copy full product link"
                      >
                        {copiedSlug ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                        <span className="hidden sm:inline">{copiedSlug ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Enter the luxurious story, benefits, Ayurvedic herbs, texture details, and clinically tested results..."
                    className="w-full text-sm border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#2d4e24] transition"
                  />
                </div>
              </div>
            </div>

            {/* 2. MEDIA MANAGEMENT STUDIO (CLOUDINARY POWERED) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span>Media Studio (Product Images)</span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Cloudinary Live Sync
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Images upload directly to Cloudinary. The image marked with <span className="font-semibold text-[#2d4e24]">★ Primary</span> is shown first on cards.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 rounded-full text-gray-700">
                  {images.length} images
                </span>
              </div>

              {/* Upload Status Banner */}
              {uploadStatusMsg && (
                <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
                  <FiCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{uploadStatusMsg}</span>
                </div>
              )}

              {/* Existing Images Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                {images.map((img, index) => {
                  const isPrimary = index === 0 || img.isPrimary;
                  return (
                    <div
                      key={img.url || index}
                      className={`relative rounded-xl overflow-hidden bg-gray-50 border transition-all ${
                        isPrimary
                          ? 'ring-3 ring-[#2d4e24] border-transparent shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={img.url}
                          alt={img.altText || `Product Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Primary Badge */}
                        {isPrimary ? (
                          <span className="absolute top-2 left-2 z-10 bg-[#2d4e24] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <FiStar className="w-3 h-3 fill-amber-300 text-amber-300" />
                            <span>Primary</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAsPrimary(index)}
                            className="absolute bottom-2 left-2 right-2 z-10 bg-white/95 hover:bg-[#2d4e24] text-[#2d4e24] hover:text-white text-[11px] font-bold py-1.5 px-2 rounded-lg shadow-md transition-all flex items-center justify-center gap-1 border border-[#2d4e24]/20 cursor-pointer"
                          >
                            <FiStar className="w-3 h-3 text-amber-500" />
                            <span>Set as Primary</span>
                          </button>
                        )}

                        {/* Reorder & Delete Buttons */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, -1)}
                              className="bg-black/60 hover:bg-black text-white p-1 rounded-md text-[10px] transition cursor-pointer"
                              title="Move Earlier"
                            >
                              ←
                            </button>
                          )}
                          {index < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 1)}
                              className="bg-black/60 hover:bg-black text-white p-1 rounded-md text-[10px] transition cursor-pointer"
                              title="Move Later"
                            >
                              →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md text-[10px] transition shadow cursor-pointer"
                            title="Delete Image from Cloudinary & DB"
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>

                      {/* Alt Text Input */}
                      <div className="p-2 border-t border-gray-100 bg-white">
                        <input
                          type="text"
                          placeholder="SEO Alt text..."
                          value={img.altText || ''}
                          onChange={(e) => updateImageAlt(index, e.target.value)}
                          className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#2d4e24]"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Uploading Placeholder Card */}
                {uploadingImages && (
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-blue-50/50 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center p-3 text-center animate-pulse">
                    <FiLoader className="w-7 h-7 text-blue-600 animate-spin mb-2" />
                    <span className="text-xs font-bold text-blue-900">Uploading...</span>
                   </div>
                )}
              </div>

              {/* Upload Dropzone */}
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition group ${
                uploadingImages 
                  ? 'border-blue-300 bg-blue-50/20 cursor-not-allowed opacity-75' 
                  : 'border-gray-300 hover:border-[#2d4e24] hover:bg-[#eef5ec]/30'
              }`}>
                {uploadingImages ? (
                  <div className="flex flex-col items-center">
                    <FiLoader className="text-2xl text-blue-600 animate-spin mb-1" />
                    <span className="text-xs font-bold text-blue-800">Processing Cloudinary Upload...</span>
                    <span className="text-[10px] text-gray-500">Please wait while your image is saved</span>
                  </div>
                ) : (
                  <>
                    <FiUpload className="text-2xl text-gray-400 mb-1 group-hover:text-[#2d4e24] transition" />
                    <span className="text-xs font-bold text-gray-700 group-hover:text-[#2d4e24]">
                      Click to browse or drop images here
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      Uploads instantly to Cloudinary & saves directly to database
                    </span>
                    <span className="text-[9px] text-gray-400">
                      Recommended: 1:1 Square, PNG, JPG, or WEBP up to 10MB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  disabled={uploadingImages}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 3. AYURVEDIC & SKINCARE SCIENCE */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Ayurvedic & Skincare Science</h2>
                <p className="text-xs text-gray-500">Capture exact skin compatibility, botanical actives, and clean formulations.</p>
              </div>

              {/* Target Skin Types */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Target Skin Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SKIN_TYPES.map(type => {
                    const active = skinTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleSkinType(type)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#2d4e24] text-white border-[#2d4e24] shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Skin Concerns */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Skin Concerns Addressed
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SKIN_CONCERNS.map(concern => {
                    const active = skinConcerns.includes(concern);
                    return (
                      <button
                        key={concern}
                        type="button"
                        onClick={() => toggleSkinConcern(concern)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#3e5f29] text-white border-[#3e5f29] shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{concern}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Actives Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Key Active Ingredients (Star Actives)
                  </label>
                  <button
                    type="button"
                    onClick={addActive}
                    className="text-xs font-bold text-[#2d4e24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FiPlus /> Add Active
                  </button>
                </div>

                <div className="space-y-2.5">
                  {keyActives.map((act, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Active Name (e.g. 24K Gold Bhasma)"
                        value={act.name}
                        onChange={(e) => updateActive(index, 'name', e.target.value)}
                        className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="% / Strength (e.g. 10%)"
                        value={act.percentage}
                        onChange={(e) => updateActive(index, 'percentage', e.target.value)}
                        className="w-28 text-xs border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Benefit (e.g. Collagen Boost)"
                        value={act.role}
                        onChange={(e) => updateActive(index, 'role', e.target.value)}
                        className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeActive(index)}
                        className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                        title="Remove active"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full INCI Ingredients */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Ingredients List (INCI)
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Aqua, Niacinamide, Glycerin, 24K Gold Dust, Kashmiri Crocus Sativus (Saffron) Flower Extract, Centella Asiatica..."
                  className="w-full text-xs font-mono border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                />
              </div>

              {/* Net Quantity & Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Net Quantity / Volume
                  </label>
                  <input
                    type="text"
                    name="netQuantity"
                    value={formData.netQuantity}
                    onChange={handleInputChange}
                    placeholder="e.g. 30 ml / 1.01 fl oz"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Shelf Life
                  </label>
                  <input
                    type="text"
                    name="shelfLife"
                    value={formData.shelfLife}
                    onChange={handleInputChange}
                    placeholder="e.g. 24 Months from MFG Date"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* 4. DAILY RITUAL & HOW TO USE */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Daily Ritual & Application Routine</h2>
                <p className="text-xs text-gray-500">Guide customers on how and when to apply this product for maximum results.</p>
              </div>

              {/* Usage Timing */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Best Timing to Use
                </label>
                <div className="flex gap-2">
                  {['AM (Morning)', 'PM (Night)', 'Both AM & PM'].map(time => {
                    const key = time.includes('AM & PM') ? 'BOTH' : (time.includes('AM') ? 'AM' : 'PM');
                    const active = usageTiming.includes(key);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleUsageTiming(key)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl border transition cursor-pointer ${
                          active
                            ? 'bg-[#2d4e24] text-white border-[#2d4e24]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {active ? '✓ ' : ''}{time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step by step */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Ritual Steps
                  </label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-xs font-bold text-[#2d4e24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FiPlus /> Add Step
                  </button>
                </div>

                <div className="space-y-2">
                  {howToUseSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 w-16">Step {index + 1}:</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        placeholder="e.g. Dispense 2-3 drops on fingertips and press into cleansed face"
                        className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Precautions & Patch Test Advice
                </label>
                <input
                  type="text"
                  name="precautions"
                  value={formData.precautions}
                  onChange={handleInputChange}
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            {/* 5. PRICING, MARGINS & TAX */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Pricing, Margins & Tax</h2>
                <span className="text-xs text-gray-400">All prices in INR (₹)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="999"
                    className="w-full text-sm font-bold border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Compare-at MRP (₹)
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="1499"
                    className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Cost per Item (₹)
                  </label>
                  <input
                    type="number"
                    name="costPerItem"
                    value={formData.costPerItem}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="350"
                    className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5"
                  />
                </div>
              </div>

              {/* Live Calculators banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {calculatedDiscount.discount > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800">Customer Discount</span>
                      <p className="text-[11px] text-emerald-600">Save ₹{calculatedDiscount.savings} on MRP</p>
                    </div>
                    <span className="text-base font-black text-emerald-700">
                      {calculatedDiscount.discount}% OFF
                    </span>
                  </div>
                )}

                {calculatedProfit && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-800">Profitability</span>
                      <p className="text-[11px] text-blue-600">Gross Profit: ₹{calculatedProfit.grossProfit} / unit</p>
                    </div>
                    <span className="text-base font-black text-blue-700">
                      {calculatedProfit.margin}% Margin
                    </span>
                  </div>
                )}
              </div>

              {/* GST & HSN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    GST Slab
                  </label>
                  <select
                    name="gstSlab"
                    value={formData.gstSlab}
                    onChange={handleInputChange}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST (Standard Skincare)</option>
                    <option value="28">28% GST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleInputChange}
                    placeholder="3304"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 6. INVENTORY & VARIANTS MATRIX */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Inventory & Variants</h2>
                <p className="text-xs text-gray-500">Track stock levels and configure volume or size variations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="NM-24K-30ML"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Current Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="100"
                    className="w-full text-xs font-bold border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="5"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* Variants Matrix */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Product Variants (Sizes / Volume / Packs)
                    </span>
                    <p className="text-[11px] text-gray-400">Add options if this product comes in multiple sizes like 30ml, 50ml, or Pack of 2.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="text-xs font-bold text-[#2d4e24] bg-[#eef5ec] hover:bg-[#dce9d8] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                  >
                    <FiPlus /> Add Variant
                  </button>
                </div>

                {variants.length > 0 && (
                  <div className="space-y-3">
                    {variants.map((v, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-center">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Variant Name (e.g. 50 ml)"
                            value={v.name}
                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Price (₹)"
                            value={v.price}
                            onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                            className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Stock"
                            value={v.stock}
                            onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                            className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="SKU"
                            value={v.sku || ''}
                            onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 7. SHIPPING & DIMENSIONS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900">Shipping & Dimensions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="150"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.dimensions.length}
                    onChange={(e) => handleDimensionChange('length', e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="isCodAvailable"
                    checked={formData.isCodAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#2d4e24]"
                  />
                  <span>Cash on Delivery (COD) Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="isFragile"
                    checked={formData.isFragile}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#2d4e24]"
                  />
                  <span>Fragile Packaging (Glass Jar/Dropper)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="isReturnable"
                    checked={formData.isReturnable}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#2d4e24]"
                  />
                  <span>Returnable within 7 days</span>
                </label>
              </div>
            </div>

            {/* 8. PRODUCT FAQs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Product FAQs (PDP Accordion)</h2>
                  <p className="text-xs text-gray-500">Address common customer questions to boost checkout conversion.</p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="text-xs font-bold text-[#2d4e24] bg-[#eef5ec] hover:bg-[#dce9d8] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                >
                  <FiPlus /> Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Question (e.g. Can this be used alongside Retinol?)"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="flex-1 text-xs font-semibold border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                    <textarea
                      placeholder="Answer..."
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 9. SEO & GOOGLE PREVIEW */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Search Engine Optimization (SEO)</h2>
                <p className="text-xs text-gray-500">Optimize how this product appears on Google and social shares.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-700">Meta Title</span>
                  <span className={`text-[11px] ${formData.metaTitle.length > 60 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {formData.metaTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="24K Gold Face Serum - Luxury Ayurvedic Skincare | Nature Medica"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-700">Meta Description</span>
                  <span className={`text-[11px] ${formData.metaDescription.length > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {formData.metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  name="metaDescription"
                  rows={2}
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="Infused with 24K pure gold bhasma and saffron to visibly firm, brighten, and heal damaged skin. 100% Ayush certified."
                  className="w-full text-xs border border-gray-300 rounded-xl p-2.5"
                />
              </div>

              {/* Live Google Search Preview Card */}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Google Search Snippet Preview
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="text-[11px] text-gray-800 font-medium">naturemedica.com</span>
                    <span className="text-gray-400">› products › {formData.slug || 'product-slug'}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer">
                    {formData.metaTitle || formData.title || 'Product Title on Nature Medica'}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {formData.metaDescription || formData.description || 'Explore premium Ayurvedic formulation engineered for modern daily rituals.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ════════════════ RIGHT SIDEBAR (32%) ════════════════ */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. PUBLISHING & CATEGORY */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Publishing Status
              </h2>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Store Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value === 'true' }))}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-xl px-3 py-2.5 bg-white"
                >
                  <option value="true">🟢 Published (Visible on store)</option>
                  <option value="false">🟡 Draft (Hidden from store)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs font-semibold border border-gray-300 rounded-xl px-3 py-2.5 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. MERCHANDISING BADGES */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Merchandising Badges
              </h2>
              <p className="text-xs text-gray-500">Controls which homepage sections and hero shelves this product appears on.</p>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#2d4e24]"
                  />
                  <span>Show in Bestsellers Section</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#2d4e24]"
                  />
                  <span>Show in New Arrivals Shelf</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#2d4e24]"
                  />
                  <span>Featured Product Banner</span>
                </label>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Custom Card Badge Text
                </label>
                <input
                  type="text"
                  name="customBadge"
                  value={formData.customBadge}
                  onChange={handleInputChange}
                  placeholder="e.g. 20% OFF / EDITOR'S PICK"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            {/* 3. AYURVEDIC TRUST BADGES */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Certifications & Claims
              </h2>
              <p className="text-xs text-gray-500">Rendered as trust badges directly on the customer product page.</p>

              <div className="space-y-2 pt-1">
                {PRESET_TRUST_BADGES.map(badge => {
                  const active = trustBadges.includes(badge);
                  return (
                    <label 
                      key={badge}
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-xs text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleTrustBadge(badge)}
                        className="w-4 h-4 accent-[#2d4e24]"
                      />
                      <span>{badge}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. PRODUCT TAGS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Tags & Search Keywords
              </h2>
              <input
                type="text"
                placeholder="Type tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full font-medium"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </form>
  );
}
