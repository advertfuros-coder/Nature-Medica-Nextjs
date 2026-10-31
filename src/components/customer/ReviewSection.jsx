'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiStar, FiThumbsUp, FiCheck, FiX, FiCamera, FiFilter, FiMaximize2 } from 'react-icons/fi';
import { format } from 'date-fns';
import Image from 'next/image';
import { VERIFIED_REVIEWS, REVIEW_TAGS } from '@/data/customerReviewsData';

export default function ReviewSection({
  productId,
  reviews = [],
  ratingAvg = 4.9,
  reviewCount = 0,
}) {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [text, setText] = useState('');
  const [selectedTagInForm, setSelectedTagInForm] = useState('Texture');
  const [submitting, setSubmitting] = useState(false);
  
  // Tag Filter state: 'all' | 'photos' | 'pigmentation' | 'stamina' | 'texture'
  const [selectedTag, setSelectedTag] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Merge DB reviews with rich verified social proof reviews
  const allReviewsPool = Array.isArray(reviews) && reviews.length > 0
    ? [...reviews, ...VERIFIED_REVIEWS.filter(vr => !reviews.some(r => r._id === vr._id))]
    : VERIFIED_REVIEWS;

  const actualReviewCount = reviewCount > allReviewsPool.length ? reviewCount : allReviewsPool.length;
  const actualRatingAvg = ratingAvg || 4.9;

  // Filter by Tag & Photos
  let tagFiltered = allReviewsPool.filter((rev) => {
    if (selectedTag === 'all') return true;
    if (selectedTag === 'photos') {
      return Array.isArray(rev.images) && rev.images.length > 0;
    }
    if (selectedTag === 'pigmentation') {
      const lower = `${rev.title || ''} ${rev.text || ''} ${(rev.tags || []).join(' ')}`.toLowerCase();
      return (
        lower.includes('pigment') || 
        lower.includes('melasma') || 
        lower.includes('dark spot') || 
        lower.includes('glow') ||
        lower.includes('clarity') ||
        (rev.tags && rev.tags.includes('Pigmentation'))
      );
    }
    if (selectedTag === 'stamina') {
      const lower = `${rev.title || ''} ${rev.text || ''} ${(rev.tags || []).join(' ')}`.toLowerCase();
      return (
        lower.includes('stamina') || 
        lower.includes('energy') || 
        lower.includes('vitality') || 
        lower.includes('vigor') || 
        lower.includes('shilajit') ||
        (rev.tags && rev.tags.includes('Stamina'))
      );
    }
    if (selectedTag === 'texture') {
      const lower = `${rev.title || ''} ${rev.text || ''} ${(rev.tags || []).join(' ')}`.toLowerCase();
      return (
        lower.includes('texture') || 
        lower.includes('absorb') || 
        lower.includes('ghee') || 
        lower.includes('velvet') || 
        lower.includes('smooth') || 
        lower.includes('non-sticky') ||
        (rev.tags && rev.tags.includes('Texture'))
      );
    }
    return true;
  });

  // Filter by Star Rating
  let filteredReviews = filterRating === 'all'
    ? tagFiltered
    : tagFiltered.filter((r) => r.rating === parseInt(filterRating));

  // Sort reviews
  if (sortBy === 'recent') {
    filteredReviews = [...filteredReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'helpful') {
    filteredReviews = [...filteredReviews].sort((a, b) => ((b.helpful || 0) + (helpfulClicked[b._id] || 0)) - ((a.helpful || 0) + (helpfulClicked[a._id] || 0)));
  } else if (sortBy === 'rating-high') {
    filteredReviews = [...filteredReviews].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating-low') {
    filteredReviews = [...filteredReviews].sort((a, b) => a.rating - b.rating);
  }

  // Distribution calculations
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = allReviewsPool.filter((r) => r.rating === star).length;
    const percentage = allReviewsPool.length > 0 ? (count / allReviewsPool.length) * 100 : 0;
    return { star, count, percentage };
  });

  const handleHelpful = (id) => {
    setHelpfulClicked((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to share your verified review');
      return;
    }
    if (text.trim().length < 10) {
      alert('Please write at least 10 characters for your review');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId, 
          rating, 
          text, 
          headline,
          tag: selectedTagInForm 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Thank you! Your verified review has been submitted for approval.');
        setShowForm(false);
        setText('');
        setHeadline('');
        setRating(5);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="customer-reviews" className="scroll-mt-28 border-t border-gray-100 pt-8 sm:pt-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#eef5ec] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/20 inline-block mb-1.5">
            Verified Social Proof
          </span>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
            Real Customer Experiences & Reviews
          </h2>
          <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
            Unfiltered feedback and transformative journeys from verified Ayurvedic buyers
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-[#2d4e24] hover:bg-[#223d1b] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-[13px] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <FiStar className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            Write a Review
          </button>
        </div>
      </div>

      {/* Rating Breakdown & Summary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 items-center">
        {/* Left: Score Lockup */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-extrabold text-[#2d4e24] mb-1">
            {actualRatingAvg.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 mb-1.5 text-[#6db62f]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-xs font-bold text-gray-900">
            Based on {actualReviewCount.toLocaleString()} Verified Reviews
          </p>
          <p className="text-[11px] text-[#2d4e24] font-semibold mt-0.5">
            98% of customers recommend this formulation
          </p>
        </div>

        {/* Right: Star Distribution Bars */}
        <div className="lg:col-span-8 space-y-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <button
              key={star}
              type="button"
              onClick={() => setFilterRating(filterRating === star.toString() ? 'all' : star.toString())}
              className={`w-full flex items-center gap-2.5 p-1 rounded-lg transition-colors group text-left cursor-pointer ${
                filterRating === star.toString() ? 'bg-[#eef5ec]' : 'hover:bg-[#f4f7f2]'
              }`}
            >
              <div className="flex items-center gap-1 w-12 flex-shrink-0">
                <span className="text-xs font-bold text-gray-800">{star}</span>
                <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2d4e24] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-gray-500 w-10 text-right">
                {count}
              </span>
            </button>
          ))}

          {filterRating !== 'all' && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setFilterRating('all')}
                className="text-xs font-bold text-[#2d4e24] hover:underline cursor-pointer"
              >
                ✕ Clear Star Filter ({filterRating}★)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          REAL CUSTOMER REVIEW FILTER TAGS
          [All (426)] [With Photos (84)] [Pigmentation] [Stamina] [Texture]
         ───────────────────────────────────────────────────────────── */}
      <div className="mb-6 bg-[#f9faf7] p-3.5 sm:p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <FiFilter className="w-3.5 h-3.5 text-[#2d4e24]" />
            <span>Filter Reviews by Experience:</span>
          </div>
          {selectedTag !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedTag('all')}
              className="text-[11px] font-bold text-[#2d4e24] hover:underline cursor-pointer"
            >
              Reset Tag Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {REVIEW_TAGS.map((tag) => {
            const isActive = selectedTag === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#2d4e24] text-white border-[#2d4e24] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-[#f4f7f2] hover:border-[#2d4e24]/40'
                }`}
              >
                {tag.id === 'photos' && <FiCamera className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-gray-500'}`} />}
                <span>{tag.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tag.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider text-[11px]">
          Showing {filteredReviews.length} Verified Customer Reviews
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2d4e24] cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
          <p className="text-sm font-bold text-gray-800 mb-1">No reviews match this filter</p>
          <p className="text-xs text-gray-500 mb-3">Try clearing or selecting a different tag filter above.</p>
          <button
            type="button"
            onClick={() => { setSelectedTag('all'); setFilterRating('all'); }}
            className="px-4 py-1.5 bg-[#2d4e24] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Show All Reviews
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((review) => {
            const helpfulCount = (review.helpful || 0) + (helpfulClicked[review._id] || 0);
            return (
              <div
                key={review._id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Review Header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#eef5ec] text-[#2d4e24] border border-[#2d4e24]/20 flex items-center justify-center font-bold text-xs shrink-0">
                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-xs sm:text-[13px] text-gray-900 tracking-wide">
                            {review.user?.name || 'Verified Customer'}
                          </p>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              <FiCheck className="w-3 h-3 text-emerald-600" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        {review.user?.city && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{review.user.city}</p>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">
                      {format(new Date(review.createdAt || Date.now()), 'dd MMM yyyy')}
                    </span>
                  </div>

                  {/* 5 Green Rating Stars */}
                  <div className="flex items-center gap-1 mb-2.5 text-[#6db62f]">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Tags badge strip */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      {review.tags.map((t, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] font-bold text-[#2d4e24] bg-[#eef5ec] px-2 py-0.5 rounded-md border border-[#2d4e24]/15"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Headline */}
                  {review.title && (
                    <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-1.5 leading-snug">
                      {review.title}
                    </h4>
                  )}

                  {/* Body Text */}
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal mb-3">
                    {review.text}
                  </p>

                  {/* Customer Review Photos (Thumbnails) */}
                  {Array.isArray(review.images) && review.images.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      {review.images.map((img, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => setPreviewPhoto({ url: img.url, caption: img.caption || review.title, user: review.user?.name })}
                          className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-[#f4f7f2] hover:ring-2 hover:ring-[#2d4e24] transition-all cursor-pointer group flex-shrink-0"
                          aria-label="View full customer photo"
                        >
                          <Image
                            src={img.url}
                            alt="Customer review photo"
                            fill
                            sizes="56px"
                            className="object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <FiMaximize2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        </button>
                      ))}
                      <span className="text-[10px] text-gray-400 font-medium">Click to inspect photo</span>
                    </div>
                  )}
                </div>

                {/* Footer / Helpful Button */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleHelpful(review._id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-[#2d4e24] transition-colors cursor-pointer"
                  >
                    <FiThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({helpfulCount})</span>
                  </button>
                  <span className="text-[10px] text-gray-400 font-medium">Authentic Ayurvedic Review</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Preview Lightbox Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="relative w-full h-80 bg-[#f4f7f2] flex items-center justify-center p-4">
              <Image
                src={previewPhoto.url}
                alt="Customer photo preview"
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-contain p-2"
              />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <p className="text-xs font-bold text-gray-900 leading-snug">
                {previewPhoto.caption}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Uploaded by verified customer: <span className="font-semibold text-[#2d4e24]">{previewPhoto.user || 'Verified Buyer'}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Write a Review */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative border border-gray-200">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#eef5ec] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/20">
                Share Your Experience
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1.5 tracking-tight">
                Write a Verified Review
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Rating selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Rating:
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <FiStar
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Highlight Category:
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Pigmentation', 'Stamina', 'Texture', 'General Glow'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTagInForm(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                        selectedTagInForm === t 
                          ? 'bg-[#2d4e24] text-white border-[#2d4e24]' 
                          : 'bg-[#f4f7f2] text-gray-700 border-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Headline:
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Visible reduction in dark spots & smooth texture"
                  className="w-full bg-[#f4f7f2] border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2d4e24]"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Review:*
                </label>
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  minLength={10}
                  placeholder="Share your experience with this formulation, absorption, texture, aroma, and visible results..."
                  className="w-full bg-[#f4f7f2] border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#2d4e24]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={submitting || text.trim().length < 10}
                  className="flex-1 bg-[#2d4e24] hover:bg-[#223d1b] text-white py-2.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3.5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
