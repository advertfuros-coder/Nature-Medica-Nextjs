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
  FiShoppingBag,
  FiMapPin,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiStar,
  FiHelpCircle
} from 'react-icons/fi';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: <FiClock className="w-4 h-4" />,
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-500',
        label: 'Order Placed'
      },
      processing: {
        icon: <FiPackage className="w-4 h-4" />,
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-500',
        label: 'Processing'
      },
      shipped: {
        icon: <FiTruck className="w-4 h-4" />,
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        dotColor: 'bg-purple-500',
        label: 'Shipped'
      },
      delivered: {
        icon: <FiCheck className="w-4 h-4" />,
        color: 'bg-green-50 text-green-700 border-green-200',
        dotColor: 'bg-green-500',
        label: 'Delivered'
      },
      cancelled: {
        icon: <FiX className="w-4 h-4" />,
        color: 'bg-red-50 text-red-700 border-red-200',
        dotColor: 'bg-red-500',
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus?.toLowerCase() === filter;
  });

  const getStatusCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.orderStatus?.toLowerCase() === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#3a5d1e] to-[#5a8d2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">My Orders</h1>
              <p className="text-green-100">Track, manage and review your purchases</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    
        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="w-12 h-12 text-[#3a5d1e]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
              </h3>
              <p className="text-gray-600 mb-4 text-base">
                {filter === 'all' 
                  ? "Discover our natural wellness products and place your first order"
                  : `You don't have any ${filter} orders at the moment`}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3a5d1e] to-[#5a8d2e] text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
              >
                <FiShoppingBag />
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus?.toLowerCase());
              
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}></div>
                            <span className="font-semibold text-gray-900 text-base">
                              Order #{order.orderId}
                            </span>
                          </div>
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-semibold text-xs ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>

                       
                      </div>

                     
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="grid md:grid-cols- gap-3">
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div 
                          key={index} 
                          className="flex gap-3  rounded-xl bg-gray-50 hover:bg-green-50 transition-all group/item"
                        >
                          <div className="">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm">
                              <img
                                src={item.image || '/placeholder.png'}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                              />
                            </div>
                            
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover/item:text-[#3a5d1e] transition-colors text-sm">
                              {item.title}
                            </h4>
                            {item.variant && (
                              <p className="text-xs text-gray-500 mb-1">{item.variant}</p>
                            )}
                            <p className="text-sm font-bold text-[#3a5d1e]">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                           <Link
                        href={`/orders/${order.orderId}`}
                        className="inline-flex text-xs items-center gap-2 text-[#3a5d1e]"
                      >
                        View Details
                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                        </div>
                      ))}
                    </div>
                    
                    {order.items?.length > 3 && (
                      <div className="mt-3 text-center">
                        <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                          +{order.items.length - 3} more items
                        </span>
                      </div>
                    )}
                  </div>

                 
                </div>
              );
            })}
          </div>
        )}

       
      </div>
    </div>
  );
}
