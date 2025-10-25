'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiStar, FiThumbsUp, FiUser, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';

// Dummy reviews for demonstration
const dummyReviews = [
  {
    _id: '1',
    user: { name: 'Priya Sharma' },
    rating: 5,
    text: 'Absolutely amazing product! I have been using this for 3 months now and the results are fantastic. My energy levels have improved significantly and I feel much healthier. The packaging is excellent and delivery was super fast. Highly recommended for anyone looking for natural wellness solutions!',
    createdAt: new Date('2024-10-15'),
    helpful: 24,
    verified: true
  },
  {
    _id: '2',
    user: { name: 'Rahul Verma' },
    rating: 4,
    text: 'Good quality product with visible results. Took about 2 weeks to see the difference but definitely worth it. The only minor issue is the taste, but considering the benefits, it\'s totally acceptable. Will definitely purchase again.',
    createdAt: new Date('2024-10-10'),
    helpful: 18,
    verified: true
  },
  {
    _id: '3',
    user: { name: 'Anjali Patel' },
    rating: 5,
    text: 'Best purchase ever! This has become an essential part of my daily routine. 100% natural ingredients, no side effects, and great customer service. The price is reasonable too. Thank you NatureMedica!',
    createdAt: new Date('2024-10-08'),
    helpful: 31,
    verified: true
  },
  {
    _id: '4',
    user: { name: 'Vikram Singh' },
    rating: 4,
    text: 'Impressed with the quality. Received the product well-packaged. Started seeing improvements after consistent use for 3 weeks. Natural ingredients are a big plus. Would recommend to friends and family.',
    createdAt: new Date('2024-10-05'),
    helpful: 12,
    verified: false
  },
  {
    _id: '5',
    user: { name: 'Sneha Reddy' },
    rating: 5,
    text: 'Outstanding! I was skeptical at first but this product exceeded all my expectations. The results are amazing and I feel so much better. The fact that it\'s completely natural gives me peace of mind. Will be ordering more soon!',
    createdAt: new Date('2024-10-01'),
    helpful: 27,
    verified: true
  },
  {
    _id: '6',
    user: { name: 'Amit Kumar' },
    rating: 3,
    text: 'Decent product. Takes time to show results but it does work eventually. The packaging could be better. Overall satisfied with the purchase but expected faster results based on the description.',
    createdAt: new Date('2024-09-28'),
    helpful: 8,
    verified: false
  }
];

export default function ReviewSection({ productId, reviews = [], ratingAvg = 4.5, reviewCount = 0 }) {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Use dummy reviews if no real reviews provided
  const safeReviews = Array.isArray(reviews) && reviews.length > 0 ? reviews : dummyReviews;
  const actualReviewCount = reviewCount || safeReviews.length;
  const actualRatingAvg = ratingAvg || 4.5;

  // Filter reviews based on rating
  let filteredReviews = filterRating === 'all' 
    ? safeReviews 
    : safeReviews.filter(r => r.rating === parseInt(filterRating));

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

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = safeReviews.filter(r => r.rating === star).length;
    const percentage = actualReviewCount > 0 ? (count / actualReviewCount) * 100 : 0;
    return { star, count, percentage };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    if (text.trim().length < 10) {
      alert('Review must be at least 10 characters long');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, text })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Review submitted successfully! It will be visible after approval.');
        setShowForm(false);
        setText('');
        setRating(5);
        window.location.reload();
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
          >
            <FiStar
              className={`${size} transition-colors ${
                star <= (interactive ? (hoveredRating || rating) : count)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getColorForRating = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-10">
      {/* Header with Stats */}
      <div className="border-b pb-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Customer Reviews
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4">
                  <span className={`text-5xl font-bold ${getColorForRating(actualRatingAvg)}`}>
                    {actualRatingAvg.toFixed(1)}
                  </span>
                  {renderStars(Math.round(actualRatingAvg))}
                </div>
                <div>
                  <p className="text-gray-600 text-lg">Based on</p>
                  <p className="font-bold text-2xl text-gray-800">{actualReviewCount} reviews</p>
                </div>
              </div>
            </div>
          </div>
          
          {isAuthenticated && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <FiStar className="w-5 h-5" />
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* Rating Distribution */}
      {actualReviewCount > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>Rating Breakdown</span>
            <span className="text-sm text-gray-500 font-normal">({actualReviewCount} total)</span>
          </h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <button
                key={star}
                onClick={() => setFilterRating(filterRating === star.toString() ? 'all' : star.toString())}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  filterRating === star.toString() 
                    ? 'bg-green-50 ring-2 ring-green-500 shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1 w-20">
                  <span className="font-semibold">{star}</span>
                  <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-16 text-right font-medium">
                  {count} {count === 1 ? 'review' : 'reviews'}
                </span>
              </button>
            ))}
          </div>
          {filterRating !== 'all' && (
            <button
              onClick={() => setFilterRating('all')}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
            >
              ✕ Clear Filter
            </button>
          )}
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">
          {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
        </select>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-8 border-2 border-green-300 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-green-800">Write Your Review</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-800">Your Rating *</label>
            {renderStars(rating, true, 'w-10 h-10')}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-800">Your Review *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              minLength={10}
              rows={5}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              placeholder="Share your experience with this product... (minimum 10 characters)"
            />
            <p className="text-sm text-gray-600 mt-2">
              {text.length} / 500 characters
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || text.trim().length < 10}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition shadow-md"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setText('');
                setRating(5);
              }}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-400 font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-7xl mb-4">📝</div>
            <p className="text-gray-600 text-xl font-medium">
              {filterRating === 'all' 
                ? 'No reviews yet. Be the first to review!' 
                : `No ${filterRating}-star reviews yet.`}
            </p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <div 
              key={review._id} 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {review.user?.name?.charAt(0)?.toUpperCase() || <FiUser />}
                  </div>
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-800 text-lg">{review.user?.name || 'Anonymous'}</p>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            <FiShield className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {renderStars(review.rating, false, 'w-4 h-4')}
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed mb-4 text-base">{review.text}</p>

                  {/* Helpful Button */}
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition font-medium">
                    <FiThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful || 0})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
