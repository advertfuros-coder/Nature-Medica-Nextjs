'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { 
  FiTruck, FiPackage, FiCheck, FiX, FiDownload, FiClock,
  FiAlertCircle, FiPhone, FiMail, FiMapPin, FiDollarSign
} from 'react-icons/fi';

export default function EnhancedOrderDetailView({ order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.orderStatus);
  const [updating, setUpdating] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Check if order can be shipped
  const canShip = order.orderStatus === 'Confirmed' && !order.awbCode;
  const isShipped = order.awbCode && order.orderStatus === 'Shipped';
  const isDelivered = order.orderStatus === 'Delivered';
  const isCancelled = order.orderStatus === 'Cancelled';

  const handleUpdateStatus = async () => {
    if (!confirm(`Update order status to ${status}?`)) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.orderId}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        alert('Order status updated successfully');
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const handleShipOrder = async () => {
    if (!confirm('Create Shiprocket shipment and mark order as shipped?')) return;
    
    setShipping(true);
    try {
      const res = await fetch('/api/admin/shiprocket/ship-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Shipment created successfully!\nAWB Code: ${data.shipment.awbCode}\nCourier: ${data.shipment.courierName}`);
        router.refresh();
      } else {
        alert(`❌ Failed to create shipment: ${data.error}`);
      }
    } catch (error) {
      alert('Error creating shipment');
    } finally {
      setShipping(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders/${order.orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (res.ok) {
        alert('Order cancelled successfully');
        setShowCancelModal(false);
        router.refresh();
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      alert('Error cancelling order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Confirmed': 'bg-blue-100 text-blue-700 border-blue-300',
      'Shipped': 'bg-purple-100 text-purple-700 border-purple-300',
      'Delivered': 'bg-green-100 text-green-700 border-green-300',
      'Cancelled': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
       {/* Action Buttons - Place this in the header section */}
<div className="flex flex-wrap gap-3">
  {/* Combined Confirm & Ship Button (for Processing orders) */}
  {order.orderStatus === 'Processing' && !order.awbCode && (
    <button
      onClick={async () => {
        if (!confirm('Confirm order and create shipment?')) return;
        setShipping(true);
        try {
          // First confirm the order
          await fetch(`/api/admin/orders/${order.orderId}/update-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Confirmed' })
          });
          
          // Then create shipment
          await handleShipOrder();
        } catch (error) {
          alert('Error processing order');
        } finally {
          setShipping(false);
        }
      }}
      disabled={shipping}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-semibold shadow-lg transition"
    >
      <FiTruck size={20} />
      {shipping ? 'Processing...' : 'Confirm & Ship Order'}
    </button>
  )}

  {/* Ship Button (for Confirmed orders) */}
  {order.orderStatus === 'Confirmed' && !order.awbCode && (
    <button
      onClick={handleShipOrder}
      disabled={shipping}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-semibold shadow-lg transition"
    >
      <FiTruck size={20} />
      {shipping ? 'Creating Shipment...' : 'Ship Order'}
    </button>
  )}

  {/* Mark as Delivered (for Shipped orders) */}
  {order.orderStatus === 'Shipped' && (
    <button
      onClick={async () => {
        if (!confirm('Mark this order as delivered?')) return;
        setUpdating(true);
        await fetch(`/api/admin/orders/${order.orderId}/update-status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Delivered' })
        });
        setUpdating(false);
        router.refresh();
      }}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold shadow-lg"
    >
      <FiCheck size={20} />
      Mark as Delivered
    </button>
  )}

  {/* Cancel Order (for all non-delivered/non-cancelled orders) */}
  {!['Cancelled', 'Delivered'].includes(order.orderStatus) && (
    <button
      onClick={() => setShowCancelModal(true)}
      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2 font-semibold shadow-lg"
    >
      <FiX size={20} />
      Cancel Order
    </button>
  )}

  {/* Download Invoice */}
  <button
    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2 font-semibold shadow-lg"
    onClick={() => window.open(`/api/admin/orders/${order.orderId}/invoice`, '_blank')}
  >
    <FiDownload size={20} />
    Invoice
  </button>
</div>


        {/* Status Badge */}
        <div className="mt-4">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus === 'Delivered' && <FiCheck />}
            {order.orderStatus === 'Shipped' && <FiTruck />}
            {order.orderStatus === 'Cancelled' && <FiX />}
            {order.orderStatus === 'Processing' && <FiClock />}
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Shipping Alert */}
      {isShipped && order.awbCode && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FiTruck className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-blue-900 mb-2">Shipment Created</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <p><strong>AWB Code:</strong> <span className="font-mono">{order.awbCode}</span></p>
                <p><strong>Courier:</strong> {order.courierName || 'To be assigned'}</p>
                {order.trackingId && (
                  <p><strong>Tracking ID:</strong> <span className="font-mono">{order.trackingId}</span></p>
                )}
                <p><strong>Shipment ID:</strong> {order.shipmentId || 'N/A'}</p>
              </div>
              <button className="mt-3 text-blue-600 font-semibold hover:underline">
                Track Shipment →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiPackage className="text-green-600" />
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product?.images?.[0]?.url || '/placeholder.png'}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{item.title}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Stock: {item.product?.stock || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold">Customer Information</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Contact Details</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <FiPhone className="text-green-600" />
                      {order.user?.phone || order.shippingAddress?.phone || 'N/A'}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiMail className="text-green-600" />
                      {order.user?.email || 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FiMapPin className="text-green-600" />
                    Shipping Address
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{order.user?.name}</p>
                    <p>{order.shippingAddress?.street}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                    <p>{order.shippingAddress?.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold">Order Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        history.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                        history.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                        history.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <FiCheck />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{history.status}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(history.updatedAt), 'MMM dd, yyyy • hh:mm a')}
                      </p>
                      {history.note && (
                        <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiDollarSign className="text-green-600" />
                Order Summary
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{order.totalPrice}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{order.finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold">Payment Details</h2>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Mode</span>
                <span className="font-semibold">{order.paymentMode === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-semibold ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="pt-2 border-t">
                  <p className="text-gray-600 mb-1">Payment ID</p>
                  <p className="font-mono text-xs break-all">{order.razorpayPaymentId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Update Status (Manual) */}
          {!isCancelled && !isDelivered && (
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b px-6 py-4">
                <h2 className="text-xl font-bold">Manual Status Update</h2>
              </div>
              <div className="p-6">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border-2 rounded-lg px-4 py-2 mb-4"
                >
                  <option value="Processing">Processing</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 font-semibold"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="w-full border-2 rounded-lg px-4 py-2 mb-4"
              placeholder="Enter cancellation reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
              >
                Confirm Cancel
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
