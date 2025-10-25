'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';

export default function OrderDetailView({ order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.orderStatus);
  const [trackingId, setTrackingId] = useState(order.trackingId || '');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.orderId}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingId, note })
      });

      if (res.ok) {
        alert('Order status updated successfully');
        router.refresh();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-blue-100 text-blue-700',
      'Confirmed': 'bg-purple-100 text-purple-700',
      'Shipped': 'bg-yellow-100 text-yellow-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
        <span className={`px-4 py-2 rounded font-semibold ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-4 last:border-b-0">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold text-green-600">₹{item.price}</p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Status History</h2>
            <div className="space-y-3">
              {order.statusHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="font-semibold">{history.status}</p>
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

        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> {order.user.email}</p>
              {order.user.phone && (
                <p><strong>Phone:</strong> {order.user.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-700">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.pincode}</p>
              <p className="mt-2"><strong>Phone:</strong> {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.totalPrice}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{order.finalPrice}</span>
              </div>
              <div className="mt-3">
                <p><strong>Payment Mode:</strong> {order.paymentMode.toUpperCase()}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-2">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="Processing">Processing</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {status === 'Shipped' && (
                <div>
                  <label className="block font-semibold mb-2">Tracking ID:</label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-2">Note (Optional):</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2"
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
        </div>
      </div>
    </div>
  );
}
