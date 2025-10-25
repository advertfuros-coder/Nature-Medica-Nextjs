import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ReturnRequest from '@/models/ReturnRequest';
import Image from 'next/image';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
 import ReturnButton from '@/components/customer/ReturnButton';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiRefreshCw, FiClock } from 'react-icons/fi';
import ReviewButton from '@/components/customer/ReviewButton';

export default async function OrderDetailPage({ params }) {
  await connectDB();

  const order = await Order.findOne({ orderId: params.orderId })
    .populate('items.product')
    .lean();

  if (!order) {
    notFound();
  }

  // Check for return request
  const returnRequest = await ReturnRequest.findOne({ order: order._id })
    .sort({ createdAt: -1 })
    .lean();

  const canReturn = order.orderStatus === 'Delivered' && 
                    !returnRequest &&
                    new Date() - new Date(order.updatedAt) < 7 * 24 * 60 * 60 * 1000;

  const getStatusIcon = (status) => {
    const icons = {
      'Processing': <FiClock className="w-5 h-5" />,
      'Confirmed': <FiCheckCircle className="w-5 h-5" />,
      'Shipped': <FiTruck className="w-5 h-5" />,
      'Delivered': <FiPackage className="w-5 h-5" />,
      'Cancelled': <FiXCircle className="w-5 h-5" />,
    };
    return icons[status] || <FiClock className="w-5 h-5" />;
  };

  const getReturnStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'approved': 'bg-blue-100 text-blue-700 border-blue-300',
      'rejected': 'bg-red-100 text-red-700 border-red-300',
      'pickup_scheduled': 'bg-purple-100 text-purple-700 border-purple-300',
      'picked_up': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'refunded': 'bg-green-100 text-green-700 border-green-300',
      'completed': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getReturnStatusIcon = (status) => {
    const icons = {
      'pending': <FiClock className="w-5 h-5" />,
      'approved': <FiCheckCircle className="w-5 h-5" />,
      'rejected': <FiXCircle className="w-5 h-5" />,
      'pickup_scheduled': <FiTruck className="w-5 h-5" />,
      'picked_up': <FiPackage className="w-5 h-5" />,
      'refunded': <FiCheckCircle className="w-5 h-5" />,
      'completed': <FiCheckCircle className="w-5 h-5" />
    };
    return icons[status] || <FiClock className="w-5 h-5" />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>
        
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-gray-600">Order ID:</span>
              <span className="text-xl font-bold ml-2">#{order.orderId}</span>
              <p className="text-sm text-gray-600 mt-1">
                Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start md:items-end">
              <span className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-700' :
                order.orderStatus === 'Shipped' ? 'bg-yellow-100 text-yellow-700' :
                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {getStatusIcon(order.orderStatus)}
                {order.orderStatus}
              </span>
              {order.trackingId && (
                <p className="text-sm text-gray-600">
                  Tracking ID: <span className="font-semibold">{order.trackingId}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Return Status Banner */}
        {returnRequest && (
          <div className={`border-2 rounded-lg p-6 mb-6 ${getReturnStatusColor(returnRequest.status)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getReturnStatusIcon(returnRequest.status)}
                  <h3 className="text-xl font-bold">
                    {returnRequest.type === 'return' ? 'Return' : 'Exchange'} Request #{returnRequest.returnId}
                  </h3>
                </div>
                <p className="text-sm mb-2">
                  <strong>Status:</strong> {returnRequest.status.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-sm mb-2">
                  <strong>Reason:</strong> {returnRequest.reason}
                </p>
                {returnRequest.adminNotes && (
                  <div className="mt-3 bg-white bg-opacity-50 rounded p-3">
                    <p className="text-sm"><strong>Admin Note:</strong></p>
                    <p className="text-sm mt-1">{returnRequest.adminNotes}</p>
                  </div>
                )}
                {returnRequest.refundProcessedDate && (
                  <p className="text-sm mt-2">
                    <strong>Refund Processed:</strong> {format(new Date(returnRequest.refundProcessedDate), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            </div>

            {/* Return Status Timeline */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-3">Return Status Timeline</h4>
              <div className="space-y-2">
                {returnRequest.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-current rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold capitalize">{history.status.replace('_', ' ')}</p>
                      <p className="text-xs opacity-75">
                        {format(new Date(history.updatedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                      {history.note && (
                        <p className="text-sm mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Status Timeline</h2>
          <div className="space-y-4">
            {order.statusHistory.map((status, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  status.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                  status.status === 'Shipped' ? 'bg-yellow-100 text-yellow-600' :
                  status.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {getStatusIcon(status.status)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{status.status}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(status.updatedAt), 'MMMM dd, yyyy - hh:mm a')}
                  </p>
                  {status.note && (
                    <p className="text-sm text-gray-600 mt-1">{status.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="divide-y">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img 
                    src={item.product?.images?.[0]?.url || '/placeholder.png'} 
                    alt={item.title} 
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  {item.variant && (
                    <p className="text-xs text-gray-500">Variant: {item.variant}</p>
                  )}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                  <p className="text-xs text-gray-500">₹{item.price} each</p>
                </div>
                
                {/* Review Button for Delivered Orders */}
                {order.orderStatus === 'Delivered' && (
                  <ReviewButton
                    productId={item.product._id} 
                    productTitle={item.title}
                    orderId={order.orderId}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Return/Exchange Button */}
        {canReturn && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1 text-blue-900">Not satisfied with your order?</h3>
                <p className="text-blue-700">You can return or exchange items within 7 days of delivery</p>
              </div>
              <ReturnButton order={JSON.parse(JSON.stringify(order))} />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress?.type?.toUpperCase()}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.pincode}</p>
              <p className="mt-2"><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
            <div className="space-y-3">
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
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold">Total Paid</span>
                <span className="font-bold text-green-600">₹{order.finalPrice}</span>
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Mode</span>
                  <span className="font-semibold capitalize">
                    {order.paymentMode === 'online' ? 'Online (Razorpay)' : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-semibold ${
                    order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-xs">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <a 
            href="/orders" 
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold transition shadow-md"
          >
            All My Orders
          </a>
          <a 
            href="/" 
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
          >
            Continue Shopping
          </a>
          {order.trackingId && (
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition shadow-md">
              Track Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
