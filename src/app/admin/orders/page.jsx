'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiPackage, 
  FiTruck, 
  FiCheck, 
  FiX, 
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiMapPin,
  FiRotateCcw,
  FiAlertTriangle,
  FiExternalLink
} from 'react-icons/fi';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncAllMsg, setSyncAllMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shippingFilter, setShippingFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchOrders();
    // Silent auto-sync check on load for active orders
    const timer = setTimeout(() => {
      handleSyncAllShipments(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSyncAllShipments = async (silent = false) => {
    try {
      setSyncingAll(true);
      if (!silent) setSyncAllMsg('Syncing active shipments with couriers...');

      const res = await fetch('/api/admin/shipments/sync-all?force=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (!silent) {
          setSyncAllMsg(`✅ Synced ${data.report?.syncedCount || 0} shipments! (${data.report?.stageChangeCount || 0} stage changes recorded)`);
        }
        await fetchOrders();
      } else if (!silent) {
        setSyncAllMsg('⚠️ Sync completed with notice: ' + (data.details || data.error || 'Done'));
      }
    } catch (err) {
      console.error('Error syncing all shipments:', err);
      if (!silent) setSyncAllMsg('⚠️ Failed to sync shipments.');
    } finally {
      setSyncingAll(false);
      if (!silent) {
        setTimeout(() => setSyncAllMsg(''), 6000);
      }
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Add cache-busting to prevent stale data
      const res = await fetch(`/api/admin/orders?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
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
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getShippingBadge = (order) => {
    const tracking = order.shipmentTracking;
    const awb = tracking?.awb || order.trackingId || order.ekart?.trackingId;
    if (!awb && !order.shiprocketOrderId) {
      return (
        <span className="text-xs text-gray-400 italic">Not Shipped</span>
      );
    }

    const carrier = tracking?.courierPartner || (order.ekart?.trackingId ? 'Ekart' : (order.courierName || 'Shiprocket'));
    const isRTO = Boolean(tracking?.isRTO);
    const status = tracking?.currentStatus || (order.orderStatus === 'Delivered' ? 'DELIVERED' : 'IN_TRANSIT');
    const location = tracking?.currentLocation;

    let badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
    let statusText = status;

    if (isRTO) {
      badgeClass = status === 'RTO_DELIVERED'
        ? 'bg-rose-900 text-rose-100 border-rose-700'
        : 'bg-red-100 text-red-800 border-red-200';
      statusText = status === 'RTO_DELIVERED' ? 'Returned' : 'RTO Returning';
    } else if (status === 'DELIVERED') {
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      statusText = 'Delivered';
    } else if (status === 'OUT_FOR_DELIVERY') {
      badgeClass = 'bg-purple-100 text-purple-800 border-purple-200';
      statusText = 'Out for Delivery';
    } else if (status === 'NDR') {
      badgeClass = 'bg-orange-100 text-orange-800 border-orange-200';
      statusText = 'Delivery Failed';
    } else if (status === 'PICKED_UP') {
      badgeClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
      statusText = 'Picked Up';
    } else if (status === 'IN_TRANSIT') {
      badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
      statusText = 'In Transit';
    } else if (status === 'MANIFESTED') {
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
      statusText = 'Manifested';
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
            {statusText}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">{carrier}</span>
        </div>
        {awb && (
          <p className="font-mono text-xs font-semibold text-gray-800">
            {awb}
          </p>
        )}
        {location && (
          <p className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
            <FiMapPin className="w-3 h-3 text-teal-600 flex-shrink-0" />
            <span className="truncate max-w-[140px]" title={location}>{location}</span>
          </p>
        )}
      </div>
    );
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipmentTracking?.awb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ekart?.trackingId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'all' || order.paymentMode === paymentFilter;

    // Shipping filter
    const tracking = order.shipmentTracking;
    const isRTO = Boolean(tracking?.isRTO);
    const shippingStatus = tracking?.currentStatus?.toLowerCase() || '';

    let matchesShipping = true;
    if (shippingFilter === 'in_transit') {
      matchesShipping = shippingStatus === 'in_transit' && !isRTO;
    } else if (shippingFilter === 'out_for_delivery') {
      matchesShipping = shippingStatus === 'out_for_delivery';
    } else if (shippingFilter === 'delivered') {
      matchesShipping = shippingStatus === 'delivered' || order.orderStatus?.toLowerCase() === 'delivered';
    } else if (shippingFilter === 'rto') {
      matchesShipping = isRTO || shippingStatus.includes('rto');
    } else if (shippingFilter === 'ndr') {
      matchesShipping = shippingStatus === 'ndr';
    }

    let matchesDate = true;
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      if (dateRange === 'today') matchesDate = diffDays === 0;
      else if (dateRange === 'week') matchesDate = diffDays <= 7;
      else if (dateRange === 'month') matchesDate = diffDays <= 30;
    }

    return matchesSearch && matchesStatus && matchesShipping && matchesPayment && matchesDate;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus?.toLowerCase() === 'pending').length,
    processing: orders.filter(o => o.orderStatus?.toLowerCase() === 'processing').length,
    shipped: orders.filter(o => o.orderStatus?.toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus?.toLowerCase() === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus?.toLowerCase() === 'cancelled').length,
    rto: orders.filter(o => o.shipmentTracking?.isRTO).length,
    inTransit: orders.filter(o => o.shipmentTracking?.currentStatus === 'IN_TRANSIT' && !o.shipmentTracking?.isRTO).length,
    revenue: orders.reduce((sum, o) => sum + (o.finalPrice || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3a5d1e] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600 mt-1">Manage all customer orders and shipments</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSyncAllShipments(false)}
                disabled={syncingAll}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm font-semibold shadow-sm"
                title="Synchronize all active parcels with courier APIs"
              >
                <FiRefreshCw className={syncingAll ? 'animate-spin' : ''} />
                <span>{syncingAll ? 'Syncing Parcels...' : 'Auto-Sync Active Shipments'}</span>
              </button>

              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {syncAllMsg && (
            <div className="mb-6 p-3.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm">
              <span>{syncAllMsg}</span>
              <button onClick={() => setSyncAllMsg('')} className="text-teal-700 hover:text-teal-900 font-bold px-2">✕</button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
              <p className="text-xs text-yellow-700 mb-1">Pending</p>
              <p className="text-xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <p className="text-xs text-blue-700 mb-1">Processing</p>
              <p className="text-xl font-bold text-blue-900">{stats.processing}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
              <p className="text-xs text-purple-700 mb-1">In Transit</p>
              <p className="text-xl font-bold text-purple-900">{stats.inTransit || stats.shipped}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <p className="text-xs text-green-700 mb-1">Delivered</p>
              <p className="text-xl font-bold text-green-900">{stats.delivered}</p>
            </div>
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
              <p className="text-xs text-rose-700 mb-1">RTO / Returns</p>
              <p className="text-xl font-bold text-rose-900">{stats.rto}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <p className="text-xs text-red-700 mb-1">Cancelled</p>
              <p className="text-xl font-bold text-red-900">{stats.cancelled}</p>
            </div>
            <div className="bg-[#3a5d1e] bg-opacity-10 rounded-xl p-3 border border-[#3a5d1e]">
              <p className="text-xs text-gray-700 mb-1">Revenue</p>
              <p className="text-xl font-bold text-gray-900">₹{stats.revenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer, Email, AWB, Hub..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a5d1e] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a5d1e] focus:border-transparent text-sm"
                >
                  <option value="all">All Order Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Shipping Filter */}
              <div>
                <select
                  value={shippingFilter}
                  onChange={(e) => setShippingFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a5d1e] focus:border-transparent text-sm"
                >
                  <option value="all">All Shipments</option>
                  <option value="in_transit">In Transit (Active)</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="rto">RTO / Returning</option>
                  <option value="ndr">Failed Attempt (NDR)</option>
                </select>
              </div>

              {/* Payment Filter */}
              <div>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a5d1e] focus:border-transparent text-sm"
                >
                  <option value="all">All Payments</option>
                  <option value="online">Online</option>
                  <option value="cod">COD</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex gap-2 mt-4">
              {['all', 'today', 'week', 'month'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    dateRange === range
                      ? 'bg-[#3a5d1e] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range === 'today' ? 'Today' : range === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Shipping
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">#{order.orderId}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.items?.length || 0} item(s)
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px] space-y-1">
                          {order.items && order.items.length > 0 ? (
                            order.items.slice(0, 3).map((item, idx) => (
                              <p key={idx} className="text-xs text-gray-800 truncate" title={item.title}>
                                • {item.title} <span className="font-semibold text-gray-500">×{item.quantity}</span>
                              </p>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No items</span>
                          )}
                          {order.items && order.items.length > 3 && (
                            <p className="text-[11px] text-teal-700 font-semibold">+{order.items.length - 3} more</p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.userName}</p>
                          <p className="text-sm text-gray-600">{order.userEmail}</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">₹{order.finalPrice?.toLocaleString('en-IN')}</p>
                        {order.discount > 0 && (
                          <p className="text-xs text-green-600">-₹{order.discount} discount</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {/* <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            order.paymentMode === 'online' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {order.paymentMode === 'online' ? 'Online' : 'COD'}
                          </span> */}
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border font-medium text-sm ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getShippingBadge(order)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#3a5d1e] text-white rounded-lg hover:bg-[#2d4818] transition-colors text-sm font-medium"
                        >
                          <FiEye />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
    </div>
  );
}
