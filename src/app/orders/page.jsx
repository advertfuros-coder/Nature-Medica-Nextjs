'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiPackage, 
  FiTruck, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiChevronRight,
  FiShoppingBag
} from 'react-icons/fi';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?redirect=/orders');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/user');
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-600" />;
      case 'processing':
        return <FiPackage className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <FiCheck className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <FiX className="w-5 h-5 text-red-600" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3a5d1e] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  filter === status
                    ? 'bg-[#3a5d1e] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === 'all' && ` (${orders.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "Start shopping to see your orders here"
                : `You don't have any ${filter} orders`}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#3a5d1e] text-white px-6 py-3 rounded-lg hover:bg-[#2d4818] transition-all font-semibold"
            >
              <FiShoppingBag />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-gray-900">{order.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-gray-900">
                          ₹{order.finalPrice?.toLocaleString('en-IN') || order.totalPrice?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-sm ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <Link
                        href={`/orders/${order.orderId}`}
                        className="inline-flex items-center gap-1 text-[#3a5d1e] hover:text-[#2d4818] font-semibold text-sm"
                      >
                        View Details
                        <FiChevronRight />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image || '/placeholder.png'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#3a5d1e] text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-gray-500">{item.variant}</p>
                          )}
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-sm text-gray-600 text-center py-2">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-3">
                  {order.trackingId && (
                    <button className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#3a5d1e] text-[#3a5d1e] rounded-lg hover:bg-[#3a5d1e] hover:text-white transition-all font-semibold">
                      <FiTruck />
                      Track Order
                    </button>
                  )}
                  <Link
                    href={`/orders/${order.orderId}`}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                  >
                    <FiPackage />
                    Order Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
