'use client';

import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

export default function ReturnButton({ order }) {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('return');
  const [reason, setReason] = useState('');
  const [detailedReason, setDetailedReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('bank');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/returns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          type,
          reason,
          detailedReason,
          refundMethod,
          bankDetails: refundMethod === 'bank' ? bankDetails : null,
          upiDetails: refundMethod === 'upi' ? { upiId } : null,
          images
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`${type === 'return' ? 'Return' : 'Exchange'} request submitted successfully!`);
        setShowModal(false);
        window.location.reload();
      } else {
        alert(data.error || 'Failed to submit request');
      }
    } catch (error) {
      alert('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
      >
        Return/Exchange
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl">Return/Exchange Request</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Request Type */}
              <div>
                <label className="block font-semibold mb-2">Request Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="return"
                      checked={type === 'return'}
                      onChange={(e) => setType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Return (Refund)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="exchange"
                      checked={type === 'exchange'}
                      onChange={(e) => setType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Exchange</span>
                  </label>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block font-semibold mb-2">Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full border-2 rounded-lg px-4 py-2"
                >
                  <option value="">Select a reason</option>
                  <option value="defective">Defective/Damaged Product</option>
                  <option value="wrong">Wrong Product Received</option>
                  <option value="quality">Quality Issues</option>
                  <option value="size">Size/Fit Issues</option>
                  <option value="not-as-described">Not as Described</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Detailed Reason */}
              <div>
                <label className="block font-semibold mb-2">Please explain in detail *</label>
                <textarea
                  value={detailedReason}
                  onChange={(e) => setDetailedReason(e.target.value)}
                  required
                  rows={4}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="Provide detailed information about the issue..."
                />
              </div>

              {/* Upload Images */}
              <div>
                <label className="block font-semibold mb-2">Upload Images (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square">
                      <img src={img} alt="Upload" className="w-full h-full object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Method (only for returns) */}
              {type === 'return' && (
                <>
                  <div>
                    <label className="block font-semibold mb-2">Refund Method *</label>
                    <select
                      value={refundMethod}
                      onChange={(e) => setRefundMethod(e.target.value)}
                      required
                      className="w-full border-2 rounded-lg px-4 py-2"
                    >
                      <option value="bank">Bank Account</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>

                  {refundMethod === 'bank' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Account Holder Name *"
                        value={bankDetails.accountHolderName}
                        onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                        required
                        className="w-full border-2 rounded-lg px-4 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Account Number *"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                        required
                        className="w-full border-2 rounded-lg px-4 py-2"
                      />
                      <input
                        type="text"
                        placeholder="IFSC Code *"
                        value={bankDetails.ifscCode}
                        onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                        required
                        className="w-full border-2 rounded-lg px-4 py-2"
                      />
                    </div>
                  )}

                  {refundMethod === 'upi' && (
                    <input
                      type="text"
                      placeholder="UPI ID (e.g., user@paytm) *"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      className="w-full border-2 rounded-lg px-4 py-2"
                    />
                  )}
                </>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-8 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold"
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
