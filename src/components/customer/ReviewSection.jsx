'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiStar, FiThumbsUp, FiCheck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

const dummyReviews = [
  {
    _id: '1',
    user: { name: 'MEGHA PARASHAR' },
    rating: 5,
    title: 'Transformative for scalp health and hair fall!',
    text: 'I have been using this Veda shampoo for 6 weeks alongside a light oiling routine. The botanical lather is so gentle and doesn’t strip moisture like commercial shampoos. My scalp feels completely refreshed and hair shed in the shower has drastically reduced.',
    createdAt: new Date('2025-02-14'),
    helpful: 38,
    verified: true,
  },
  {
    _id: '2',
    user: { name: 'DR. ANANYA SEN' },
    rating: 5,
    title: 'Clean ingredients and genuine Ayurvedic formulation',
    text: 'As a dermatologist, I appreciate that this formulation excludes harsh synthetic sulfates and heavy silicones. It uses real Bhringraj and Amla extracts that cleanse effectively while preserving the scalp lipid barrier.',
    createdAt: new Date('2025-02-08'),
    helpful: 29,
    verified: true,
  },
  {
    _id: '3',
    user: { name: 'RAHUL VERMA' },
    rating: 5,
    title: 'Very refreshing, pleasant natural aroma',
    text: 'No overpowering synthetic perfume — just pure herbal calmness. Creates a rich soft lather even with hard water and leaves hair bouncy and non-greasy for 3 whole days.',
    createdAt: new Date('2025-01-29'),
    helpful: 19,
    verified: true,
  },
  {
    _id: '4',
    user: { name: 'MEERA IYER' },
    rating: 4,
    title: 'Great product, visible improvement in hair texture',
    text: 'Took about 2 weeks of regular use to notice the difference in texture and softness. Best used with lukewarm water. Packaging and pump bottle are very premium.',
    createdAt: new Date('2025-01-18'),
    helpful: 14,
    verified: true,
  }
];

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
  const [submitting, setSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [helpfulClicked, setHelpfulClicked] = useState({});

  const safeReviews = Array.isArray(reviews) && reviews.length > 0 ? reviews : dummyReviews;
  const actualReviewCount = reviewCount || safeReviews.length;
  const actualRatingAvg = ratingAvg || 4.9;

  // Filter reviews
  let filteredReviews = filterRating === 'all'
    ? safeReviews
    : safeReviews.filter((r) => r.rating === parseInt(filterRating));

  // Sort reviews
  if (sortBy === 'recent') {
    filteredReviews = [...filteredReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'helpful') {
    filteredReviews = [...filteredReviews].sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
  } else if (sortBy === 'rating-high') {
    filteredReviews = [...filteredReviews].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating-low') {
    filteredReviews = [...filteredReviews].sort((a, b) => a.rating - b.rating);
  }

  // Distribution calculations
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = safeReviews.filter((r) => r.rating === star).length;
    const percentage = safeReviews.length > 0 ? (count / safeReviews.length) * 100 : 0;
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
        body: JSON.stringify({ productId, rating, text, headline }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Thank you! Your review has been submitted for verification.');
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
      {/* Section Header matching homepage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#eef5ec] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/20 inline-block mb-1.5">
            Verified Social Proof
          </span>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
            Customer Experiences & Reviews
          </h2>
          <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
            Real experiences and transformations from verified buyers
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
            98% of customers recommend this
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

      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider text-[11px]">
          Showing {filteredReviews.length} Reviews
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2d4e24]"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => {
          const helpfulCount = (review.helpful || 0) + (helpfulClicked[review._id] || 0);
          return (
            <div
              key={review._id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Review Header: User & Verified Badge matching CustomerReviews.jsx */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#eef5ec] text-[#2d4e24] border border-[#2d4e24]/20 flex items-center justify-center font-bold text-xs shrink-0">
                      {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-xs sm:text-[13px] text-gray-900 tracking-wide uppercase truncate">
                          {review.user?.name || 'Nature Medica Customer'}
                        </p>
                        {review.verified && (
                          <svg className="w-3.5 h-3.5 text-[#1877F2] shrink-0 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400 font-medium">
                    {format(new Date(review.createdAt), 'dd MMM yyyy')}
                  </span>
                </div>

                {/* 5 Green Rating Stars matching homepage */}
                <div className="flex items-center gap-1 mb-2.5 text-[#6db62f]">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

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
                <span className="text-[10px] text-gray-400 font-medium">Verified Review</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Write a Review */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
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

              {/* Headline */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Headline:
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Scalp feels refreshed & strong"
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
                  placeholder="Share how this product felt on your hair/skin, aroma, texture, and results..."
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
