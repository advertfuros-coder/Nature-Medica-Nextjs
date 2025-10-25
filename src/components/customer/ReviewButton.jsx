'use client';

import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function ReviewButton({ productId, productTitle, orderId }) {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, text, orderId })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Review submitted successfully!');
        setShowModal(false);
        setText('');
        setRating(5);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-semibold flex items-center gap-2"
      >
        <FiStar className="w-4 h-4" />
        Rate Product
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Rate {productTitle}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Your Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-3xl"
                    >
                      <FiStar
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Your Review *</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={4}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
