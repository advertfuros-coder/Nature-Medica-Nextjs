'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';

export default function ReturnDetailView({ returnRequest }) {
  const router = useRouter();
  const [status, setStatus] = useState(returnRequest.status);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/returns/${returnRequest._id}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });

      if (res.ok) {
        alert('Return status updated successfully');
        router.refresh();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-blue-100 text-blue-700',
      'rejected': 'bg-red-100 text-red-700',
      'pickup_scheduled': 'bg-purple-100 text-purple-700',
      'picked_up': 'bg-indigo-100 text-indigo-700',
      'refunded': 'bg-green-100 text-green-700',
      'completed': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Return Request #{returnRequest.returnId}</h1>
        <span className={`px-4 py-2 rounded font-semibold ${getStatusColor(returnRequest.status)}`}>
          {returnRequest.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {returnRequest.user.name}</p>
              <p><strong>Email:</strong> {returnRequest.user.email}</p>
              <p><strong>Phone:</strong> {returnRequest.user.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Return Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Return Details</h2>
            <div className="space-y-3">
              <div>
                <strong>Type:</strong> <span className="capitalize">{returnRequest.type}</span>
              </div>
              <div>
                <strong>Reason:</strong> {returnRequest.reason}
              </div>
              <div>
                <strong>Detailed Explanation:</strong>
                <p className="text-gray-700 mt-1">{returnRequest.detailedReason}</p>
              </div>
              <div>
                <strong>Refund Amount:</strong> ₹{returnRequest.refundAmount}
              </div>
              <div>
                <strong>Order ID:</strong> #{returnRequest.order.orderId}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            <div className="space-y-3">
              {returnRequest.items.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-3">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded Images */}
          {returnRequest.images && returnRequest.images.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Uploaded Images</h2>
              <div className="grid grid-cols-3 gap-4">
                {returnRequest.images.map((img, index) => (
                  <a
                    key={index}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square"
                  >
                    <img
                      src={img.url}
                      alt="Return evidence"
                      fill
                      className="rounded object-cover hover:opacity-90 transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Refund Details */}
          {returnRequest.type === 'return' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Refund Details</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Method:</strong> {returnRequest.refundMethod}</p>
                {returnRequest.refundMethod === 'bank' && returnRequest.bankDetails && (
                  <>
                    <p><strong>Account Holder:</strong> {returnRequest.bankDetails.accountHolderName}</p>
                    <p><strong>Account Number:</strong> {returnRequest.bankDetails.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> {returnRequest.bankDetails.ifscCode}</p>
                  </>
                )}
                {returnRequest.refundMethod === 'upi' && returnRequest.upiDetails && (
                  <p><strong>UPI ID:</strong> {returnRequest.upiDetails.upiId}</p>
                )}
              </div>
            </div>
          )}

          {/* Status History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Status History</h2>
            <div className="space-y-3">
              {returnRequest.statusHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="font-semibold capitalize">{history.status.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(history.updatedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                    {history.note && (
                      <p className="text-sm text-gray-700 mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Update Status Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="pickup_scheduled">Pickup Scheduled</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="refunded">Refunded</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Admin Notes:</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Add notes..."
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <button
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  onClick={async () => {
    try {
      const res = await fetch('/api/admin/shiprocket/ship-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: returnRequest.order.orderId })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Shipment created successfully! AWB: ' + data.shipment.awbCode);
      } else {
        alert('Failed: ' + data.error);
      }
    } catch (error) {
      alert('Error creating shipment.');
    }
  }}
>
  Create Shipment
</button>

<button
  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-4"
  onClick={async () => {
    try {
      const res = await fetch('/api/admin/shiprocket/schedule-pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnId: returnRequest.returnId })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Pickup scheduled. AWB: ' + data.pickup.awb);
      } else {
        alert('Failed: ' + data.error);
      }
    } catch (error) {
      alert('Error scheduling pickup.');
    }
  }}
>
  Schedule Pickup
</button>

        </div>
      </div>
    </div>
  );
}
