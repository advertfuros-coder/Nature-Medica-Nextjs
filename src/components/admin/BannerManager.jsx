'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeroBanner from '@/components/customer/HeroBanner';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiCheck, 
  FiX, 
  FiUploadCloud, 
  FiExternalLink,
  FiLayers,
  FiHelpCircle
} from 'react-icons/fi';

export default function BannerManager({ initialBanners = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [banners, setBanners] = useState(initialBanners);
  const [activeTab, setActiveTab] = useState('hero_left'); // 'hero_left' | 'hero_right' | 'all'
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewLiveHero, setPreviewLiveHero] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    type: 'hero_left',
    title: '',
    subtitle: '',
    badge: '',
    tagline: '',
    categoryName: '',
    link: '/products',
    order: 0,
    active: true,
  });

  const [imageFile, setImageFile] = useState(null); // base64 string
  const [imagePreview, setImagePreview] = useState('');

  // Filter banners based on tab
  const leftBanners = banners.filter((b) => b.type === 'hero_left');
  const rightBanners = banners.filter((b) => b.type === 'hero_right');
  const displayedBanners = activeTab === 'all' 
    ? banners 
    : banners.filter((b) => b.type === activeTab);

  const handleOpenCreate = (defaultType = 'hero_left') => {
    setEditingBanner(null);
    setFormData({
      type: defaultType,
      title: '',
      subtitle: '',
      badge: '',
      tagline: '',
      categoryName: '',
      link: '/products',
      order: 0,
      active: true,
    });
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type || 'hero_left',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      tagline: banner.tagline || '',
      categoryName: banner.categoryName || '',
      link: banner.link || '/products',
      order: banner.order || 0,
      active: banner.active !== false,
    });
    setImageFile(null);
    setImagePreview(banner.image?.url || '');
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile && !editingBanner?.image?.url) {
      alert('Please select an image to upload.');
      return;
    }

    setSubmitting(true);

    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners';

      const method = editingBanner ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        order: Number(formData.order) || 0,
      };

      if (imageFile) {
        payload.image = imageFile;
      } else if (editingBanner?.image) {
        payload.image = editingBanner.image;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save banner');
      }

      // Optimistic update
      if (editingBanner) {
        setBanners((prev) =>
          prev.map((b) => (b._id === editingBanner._id ? data.banner : b))
        );
      } else {
        setBanners((prev) => [data.banner, ...prev]);
      }

      setShowModal(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      alert(err.message || 'Error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete');
      }

      setBanners((prev) => prev.filter((b) => b._id !== id));
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleToggleActive = async (banner) => {
    const updatedStatus = !banner.active;
    try {
      // Optimistic
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, active: updatedStatus } : b))
      );

      const res = await fetch(`/api/admin/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: updatedStatus }),
      });
      if (!res.ok) throw new Error('Toggle failed');

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      alert(err.message);
      // Revert
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, active: banner.active } : b))
      );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#2d4e24]/10 text-[#2d4e24] rounded-lg">
              <FiLayers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Hero Section Banner Manager
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store homepage Left Main Carousel & Right Spotlight Banners directly with Cloudinary sync and optimized CDN caching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewLiveHero(!previewLiveHero)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <FiEye className="w-4 h-4 text-[#2d4e24]" />
            {previewLiveHero ? 'Hide Live Preview' : 'Show Live Preview'}
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreate(activeTab === 'hero_right' ? 'hero_right' : 'hero_left')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d4e24] hover:bg-[#233d1c] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            Add New Slide
          </button>
        </div>
      </div>

      {/* ====================================================
          LIVE HOMEPAGE CLIENT PREVIEW (Matches Client PDP/Home)
         ==================================================== */}
      {previewLiveHero && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h2 className="text-base font-bold text-gray-900">
                Live Storefront Hero Preview
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                Exact Client View
              </span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2d4e24] hover:underline"
            >
              Open Website Homepage <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
            <HeroBanner
              leftBanners={leftBanners.filter((b) => b.active !== false)}
              rightBanners={rightBanners.filter((b) => b.active !== false)}
              previewMode={true}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 italic text-center">
            * Interactive preview: Autoplays and reflects active Cloudinary banners exactly as shoppers see them.
          </p>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('hero_left')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'hero_left'
                ? 'bg-white text-[#2d4e24] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Left Section Slides ({leftBanners.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hero_right')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'hero_right'
                ? 'bg-white text-[#2d4e24] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Right Section Slides ({rightBanners.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#2d4e24] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Slides ({banners.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCreate(activeTab === 'hero_right' ? 'hero_right' : 'hero_left')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2d4e24] hover:text-[#233d1c]"
        >
          <FiPlus className="w-3.5 h-3.5" />
          Add to {activeTab === 'hero_right' ? 'Right Spotlight' : 'Left Carousel'}
        </button>
      </div>

      {/* Banners Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedBanners.map((banner) => {
          const isLeft = banner.type === 'hero_left';
          return (
            <div
              key={banner._id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                banner.active
                  ? 'border-gray-200 shadow-sm hover:shadow-md'
                  : 'border-dashed border-gray-300 opacity-60 bg-gray-50'
              }`}
            >
              <div>
                {/* Banner Thumbnail Preview */}
                <div className="relative w-full h-48 bg-neutral-900 overflow-hidden group">
                  <Image
                    src={banner.image?.url || banner.image}
                    alt={banner.title || banner.categoryName || 'Banner'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white backdrop-blur-md shadow-sm ${
                        isLeft ? 'bg-[#2d4e24]/90' : 'bg-amber-600/90'
                      }`}
                    >
                      {isLeft ? 'Left Carousel (58%)' : 'Right Spotlight (42%)'}
                    </span>
                  </div>

                  {/* Active Toggle Status Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md transition-all shadow-sm z-10 cursor-pointer ${
                      banner.active
                        ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                        : 'bg-neutral-800/80 text-gray-300 hover:bg-neutral-900'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2">
                  {isLeft ? (
                    <>
                      {banner.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#F2F7EF] px-2 py-0.5 rounded border border-[#2d4e24]/10 inline-block">
                          {banner.badge}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                        {banner.title || 'Untitled Banner'}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {banner.subtitle}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      {banner.categoryName && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                          {banner.categoryName}
                        </span>
                      )}
                      <h3 className="font-serif italic text-gray-900 text-base line-clamp-2">
                        &ldquo;{banner.tagline || 'No tagline specified'}&rdquo;
                      </h3>
                    </>
                  )}

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate max-w-[180px]">Link: {banner.link || '/products'}</span>
                    <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      Order: {banner.order ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(banner)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-all cursor-pointer"
                >
                  <FiEdit2 className="w-3.5 h-3.5 text-blue-600" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(banner._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 rounded-lg border border-gray-200 transition-all cursor-pointer"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayedBanners.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <FiLayers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No banners found in this category</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Click &apos;Add New Slide&apos; to upload an image directly to Cloudinary and attach it to your hero section.
          </p>
          <button
            type="button"
            onClick={() => handleOpenCreate(activeTab === 'hero_right' ? 'hero_right' : 'hero_left')}
            className="mt-4 px-4 py-2 bg-[#2d4e24] text-white text-xs font-semibold rounded-xl hover:bg-[#233d1c] transition-all cursor-pointer"
          >
            Add First Slide
          </button>
        </div>
      )}

      {/* ====================================================
          CREATE / EDIT BANNER MODAL
         ==================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-4 border-b border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#F2F7EF] px-2.5 py-0.5 rounded-full inline-block mb-1">
                Cloudinary Direct Sync
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingBanner ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Uploaded images will be optimized, converted, and permanently served from Cloudinary CDN.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Section Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Target Hero Section *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'hero_left' })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.type === 'hero_left'
                        ? 'border-[#2d4e24] bg-[#F2F7EF] ring-2 ring-[#2d4e24]/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-gray-900">Left Section (58%)</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Main Banner: 1600x900 or 1920x1080 recommended
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'hero_right' })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.type === 'hero_right'
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-gray-900">Right Spotlight (42%)</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Spotlight Card: 1200x1200 or 1600x900
                    </div>
                  </button>
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Banner Image {editingBanner ? '(Upload new to replace)' : '*'}
                </label>

                <div className="border-2 border-dashed border-gray-300 hover:border-[#2d4e24] rounded-2xl p-4 sm:p-6 transition-all text-center relative bg-gray-50/50">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-neutral-900 mx-auto shadow-inner">
                        <Image
                          src={imagePreview}
                          alt="Banner Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <label className="text-xs font-semibold text-[#2d4e24] hover:underline cursor-pointer">
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        {imageFile && (
                          <span className="text-[11px] text-gray-500">
                            • Ready for Cloudinary upload
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <FiUploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-700">
                        Drag and drop your image here, or{' '}
                        <label className="text-[#2d4e24] font-bold hover:underline cursor-pointer">
                          browse
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        PNG, JPG, WebP supported. Max 10MB. Automatically uploaded to Cloudinary CDN.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Conditional Fields depending on hero_left vs hero_right */}
              {formData.type === 'hero_left' ? (
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Pure Sea Buckthorn Juice"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. 100% Pure & Natural"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Subtitle / Caption
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Supports heart health, promotes brain function & active vitality"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Category / Pill Label
                      </label>
                      <input
                        type="text"
                        value={formData.categoryName}
                        onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                        placeholder="e.g. Omega-3 Capsules"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tagline / Quote *
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="e.g. fuel your heart and mind with pure omega vitality"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Fields: Link, Order, Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Destination Link
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/products/your-product-slug"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d4e24]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-[#2d4e24] focus:ring-[#2d4e24] rounded border-gray-300"
                />
                <label htmlFor="bannerActive" className="text-xs font-semibold text-gray-800 cursor-pointer">
                  Active (Display immediately on live storefront)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2d4e24] hover:bg-[#233d1c] text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Uploading to Cloudinary...
                    </>
                  ) : editingBanner ? (
                    'Update Slide'
                  ) : (
                    'Upload & Publish'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
