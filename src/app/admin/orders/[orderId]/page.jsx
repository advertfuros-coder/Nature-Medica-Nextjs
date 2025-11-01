'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiTruck, 
  FiDownload,
  FiRefreshCw,
  FiX,
  FiCheck,
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiPhone,
  FiMail,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiPrinter,
  FiExternalLink,
  FiAlertCircle
} from 'react-icons/fi';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { orderId } = params;

  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [weight, setWeight] = useState(0.5);
  const [dimensions, setDimensions] = useState({ length: 10, breadth: 10, height: 10 });
  const [actionLoading, setActionLoading] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showManualShipmentModal, setShowManualShipmentModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [manualShipmentData, setManualShipmentData] = useState({
    trackingId: '',
    courierName: '',
    note: ''
  });
  const [shiprocketStatus, setShiprocketStatus] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      checkShiprocketStatus();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setNewStatus(data.order.orderStatus);
      } else {
        alert('Order not found');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkShiprocketStatus = async () => {
    try {
      const res = await fetch('/api/admin/shipments/status');
      const data = await res.json();
      setShiprocketStatus(data);
    } catch (error) {
      console.error('Status check failed:', error);
    }
  };

  // Delhivery shipment
  const createDelhiveryShipment = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/delhivery/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, weight })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Delhivery shipment created!\n\nWaybill: ${data.waybill}`);
        
        if (confirm('Open tracking page?')) {
          window.open(data.trackingUrl, '_blank');
        }
        
        fetchOrder();
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      alert('Failed to create Delhivery shipment');
    } finally {
      setActionLoading(false);
    }
  };

  // Shiprocket: Quick sync
  const quickSyncToShiprocket = async () => {
    if (!confirm('Sync this order to Shiprocket dashboard?\n\nThis will create the order in Shiprocket without generating AWB.')) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/quick-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`✅ ${data.message}\n\nShiprocket Order ID: ${data.shiprocketOrderId}`);
        
        if (confirm('Order synced successfully! Open Shiprocket dashboard?')) {
          window.open(data.dashboardUrl, '_blank');
        }
        
        fetchOrder();
      } else {
        alert(`❌ ${data.error}\n\n${data.suggestion || ''}`);
      }
    } catch (error) {
      alert('Failed to sync to Shiprocket. Please try manual entry or Shiprocket dashboard.');
    } finally {
      setActionLoading(false);
    }
  };

  // Shiprocket: Get couriers
  const fetchCouriers = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/couriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, weight })
      });

      const data = await res.json();
      if (res.ok) {
        setCouriers(data.couriers);
        setSelectedCourier(data.cheapest?.courierId);
        setShowCourierModal(true);
      } else {
        alert(data.error || 'Failed to fetch couriers. You can use manual entry instead.');
      }
    } catch (error) {
      alert('Failed to fetch couriers. You can use manual entry instead.');
    } finally {
      setActionLoading(false);
    }
  };

  // Shiprocket: Create shipment
  const createShipment = async () => {
    if (!selectedCourier) {
      alert('Please select a courier');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          weight,
          dimensions,
          courierId: selectedCourier
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Shipment created successfully!');
        setShowCourierModal(false);
        fetchOrder();
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      alert('Failed to create shipment');
    } finally {
      setActionLoading(false);
    }
  };

  // Shiprocket: Generate AWB
  const generateAWB = async () => {
    if (!order.shiprocketShipmentId) {
      alert('Please create shipment first');
      return;
    }

    if (!selectedCourier && couriers.length === 0) {
      await fetchCouriers();
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/generate-awb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, courierId: selectedCourier || couriers[0]?.courierId })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ AWB Generated: ${data.trackingId}`);
        fetchOrder();
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      alert('Failed to generate AWB');
    } finally {
      setActionLoading(false);
    }
  };

  // Shiprocket: Download label
  const downloadLabel = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();
      if (res.ok) {
        window.open(data.labelUrl, '_blank');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to get label');
    } finally {
      setActionLoading(false);
    }
  };

  // Shiprocket: Cancel shipment
  const cancelShipment = async () => {
    if (!confirm('Are you sure you want to cancel this shipment?')) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason: 'Cancelled by admin' })
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Shipment cancelled');
        fetchOrder();
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      alert('Failed to cancel shipment');
    } finally {
      setActionLoading(false);
    }
  };

  // Update status
  const updateOrderStatus = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          note: statusNote
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Order status updated');
        setShowStatusModal(false);
        setStatusNote('');
        fetchOrder();
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Manual shipment
  const submitManualShipment = async () => {
    if (!manualShipmentData.trackingId || !manualShipmentData.courierName) {
      alert('Please enter tracking ID and courier name');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipments/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          ...manualShipmentData
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Manual shipment recorded successfully!');
        setShowManualShipmentModal(false);
        setManualShipmentData({ trackingId: '', courierName: '', note: '' });
        fetchOrder();
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      alert('Failed to record manual shipment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3a5d1e] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link href="/admin/orders" className="text-[#3a5d1e] hover:underline font-medium">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <FiArrowLeft />
            Back to Orders
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderId}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStatusModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit />
                Update Status
              </button>
              <button
                onClick={fetchOrder}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Shiprocket Status Alert */}
        {shiprocketStatus && shiprocketStatus.status !== 'active' && (
          <div className={`mb-6 rounded-lg p-4 border-2 ${
            shiprocketStatus.status === 'blocked' 
              ? 'bg-red-50 border-red-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-3">
              <FiAlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                shiprocketStatus.status === 'blocked' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Shiprocket API Unavailable
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  {shiprocketStatus.message}
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Recommended:</strong> Use Delhivery or Manual Entry to ship orders.
                </p>
              </div>
              <button
                onClick={checkShiprocketStatus}
                className="flex items-center gap-1 px-3 py-1 bg-white border rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap"
              >
                <FiRefreshCw className="w-3 h-3" />
                Recheck
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status & Shipping */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
                <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                  order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                  order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-700' :
                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Shipping Management */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTruck className="text-[#3a5d1e]" />
                  Shipping Management
                </h3>
                
                {!order.shiprocketOrderId && !order.delhiveryWaybill && !order.trackingId ? (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 mb-3 font-medium">Select shipping method:</p>
                      
                      {/* Delhivery - PRIMARY */}
                      <button
                        onClick={createDelhiveryShipment}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 mb-2 font-semibold transition-colors"
                      >
                        <FiTruck />
                        🚚 Create Delhivery Shipment
                      </button>

                      {/* Quick Sync Shiprocket */}
                      <button
                        onClick={quickSyncToShiprocket}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-2 transition-colors"
                      >
                        <FiExternalLink />
                        Quick Sync to Shiprocket
                      </button>
                      
                      {/* Shiprocket with Courier */}
                      <button
                        onClick={fetchCouriers}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3a5d1e] text-white rounded-lg hover:bg-[#2d4818] disabled:opacity-50 mb-2 transition-colors"
                      >
                        <FiPackage />
                        Shiprocket with Courier
                      </button>

                      {/* Manual Entry */}
                      <button
                        onClick={() => setShowManualShipmentModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <FiEdit />
                        Manual Entry
                      </button>
                      
                      <div className="mt-4 pt-4 border-t border-yellow-300 space-y-1 text-xs text-gray-700">
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                          <strong>Delhivery:</strong> Fast, auto waybill generation
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          <strong>Quick Shiprocket:</strong> Sync to dashboard only
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#3a5d1e] rounded-full"></span>
                          <strong>Shiprocket:</strong> Select courier + AWB here
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                          <strong>Manual:</strong> When APIs unavailable
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Delhivery Info */}
                    {order.delhiveryWaybill && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Delhivery Waybill</p>
                          <a
                            href={`https://track.delhivery.com/?awb=${order.delhiveryWaybill}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:underline text-sm flex items-center gap-1"
                          >
                            Track <FiExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <p className="font-mono font-bold text-xl text-gray-900">{order.delhiveryWaybill}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Courier:</span> Delhivery
                        </p>
                      </div>
                    )}

                    {/* Tracking Info */}
                    {order.trackingId && !order.delhiveryWaybill && (
                      <div className={`${order.isManualShipment ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                        {order.isManualShipment && (
                          <div className="flex items-center gap-2 mb-2 text-gray-600">
                            <FiAlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Manual Entry</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Tracking Number</p>
                          {!order.isManualShipment && (
                            <Link
                              href={`/track/${order.trackingId}`}
                              target="_blank"
                              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                            >
                              Track <FiExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                        <p className="font-mono font-bold text-xl text-gray-900">{order.trackingId}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Courier:</span> {order.courierName}
                        </p>
                        {order.manualShipmentNote && (
                          <p className="text-xs text-gray-500 mt-2">
                            Note: {order.manualShipmentNote}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Shiprocket IDs */}
                    {order.shiprocketOrderId && !order.isManualShipment && (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shiprocket Order ID:</span>
                          <span className="font-mono font-semibold">{order.shiprocketOrderId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipment ID:</span>
                          <span className="font-mono font-semibold">{order.shiprocketShipmentId}</span>
                        </div>
                        <a
                          href={`https://app.shiprocket.in/seller/orders/details/${order.shiprocketOrderId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          <FiExternalLink />
                          View in Shiprocket Dashboard
                        </a>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {!order.trackingId && !order.isManualShipment && (
                        <button
                          onClick={generateAWB}
                          disabled={actionLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          <FiRefreshCw />
                          Generate AWB
                        </button>
                      )}

                      {order.trackingId && !order.isManualShipment && (
                        <>
                          <button
                            onClick={downloadLabel}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            <FiPrinter />
                            Print Label
                          </button>

                          <button
                            onClick={cancelShipment}
                            disabled={actionLoading || order.orderStatus === 'Delivered'}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                          >
                            <FiX />
                            Cancel Shipment
                          </button>
                        </>
                      )}

                      {order.isManualShipment && (
                        <button
                          onClick={() => {
                            setManualShipmentData({
                              trackingId: order.trackingId,
                              courierName: order.courierName,
                              note: order.manualShipmentNote || ''
                            });
                            setShowManualShipmentModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <FiEdit />
                          Update Tracking Info
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600">{item.variant}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {order.statusHistory?.map((history, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        index === 0 ? 'bg-[#3a5d1e] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <FiClock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className={`rounded-lg p-4 ${
                          index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-900">{history.status}</h3>
                            <span className="text-sm text-gray-600">
                              {new Date(history.updatedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {history.note && (
                            <p className="text-sm text-gray-600">{history.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="text-[#3a5d1e]" />
                <h2 className="font-bold text-gray-900">Customer Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{order.userName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-900 break-all">{order.userEmail}</p>
                </div>
                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-900">{order.shippingAddress.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-[#3a5d1e]" />
                <h2 className="font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p className="font-semibold">{order.shippingAddress?.pincode}</p>
                {order.shippingAddress?.landmark && (
                  <p className="text-xs">Landmark: {order.shippingAddress.landmark}</p>
                )}
                <p className="pt-2">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="text-[#3a5d1e]" />
                <h2 className="font-bold text-gray-900">Payment Details</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-900">
                    {order.paymentMode === 'online' ? 'Online' : 'COD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-semibold ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-xs text-gray-900 break-all">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiDollarSign className="text-[#3a5d1e]" />
                <h2 className="font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span className="font-semibold">-₹{order.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">
                    ₹{order.finalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Selection Modal */}
        {showCourierModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Shipment</h2>
                <button
                  onClick={() => setShowCourierModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Package Details</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      step="0.1"
                      min="0.1"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Length (cm)</label>
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({...dimensions, length: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Breadth (cm)</label>
                    <input
                      type="number"
                      value={dimensions.breadth}
                      onChange={(e) => setDimensions({...dimensions, breadth: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({...dimensions, height: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Courier Partner</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {couriers.map((courier) => (
                    <label
                      key={courier.courierId}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCourier === courier.courierId
                          ? 'border-[#3a5d1e] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="courier"
                        value={courier.courierId}
                        checked={selectedCourier === courier.courierId}
                        onChange={(e) => setSelectedCourier(parseInt(e.target.value))}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{courier.courierName}</p>
                            {courier.recommended > 80 && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Delivery: {courier.estimatedDeliveryDays} days
                          </p>
                          {order.paymentMode === 'cod' && courier.codCharges > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              COD: ₹{courier.codCharges}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-gray-900">
                            ₹{courier.totalCharges}
                          </p>
                          <p className="text-xs text-gray-500">Total Charges</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCourierModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={createShipment}
                  disabled={actionLoading || !selectedCourier}
                  className="flex-1 px-4 py-3 bg-[#3a5d1e] text-white rounded-lg hover:bg-[#2d4818] disabled:opacity-50 font-medium"
                >
                  {actionLoading ? 'Creating...' : 'Create & Generate AWB'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Update Order Status</h2>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note about this change..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateOrderStatus}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-[#3a5d1e] text-white rounded-lg hover:bg-[#2d4818] disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Shipment Modal */}
        {showManualShipmentModal && (
          <div className="fixed inset- bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manual Shipment Entry</h2>
                <button
                  onClick={() => setShowManualShipmentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
                  <FiAlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    Use this when APIs are unavailable. Enter tracking details manually.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tracking ID / AWB <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manualShipmentData.trackingId}
                    onChange={(e) => setManualShipmentData({...manualShipmentData, trackingId: e.target.value})}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Courier Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={manualShipmentData.courierName}
                    onChange={(e) => setManualShipmentData({...manualShipmentData, courierName: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Courier</option>
                    <option value="Delhivery">Delhivery</option>
                    <option value="Blue Dart">Blue Dart</option>
                    <option value="DTDC">DTDC</option>
                    <option value="Ecom Express">Ecom Express</option>
                    <option value="India Post">India Post</option>
                    <option value="Xpressbees">Xpressbees</option>
                    <option value="Ekart">Ekart</option>
                    <option value="Shadowfax">Shadowfax</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={manualShipmentData.note}
                    onChange={(e) => setManualShipmentData({...manualShipmentData, note: e.target.value})}
                    placeholder="Add any notes..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowManualShipmentModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitManualShipment}
                  disabled={actionLoading || !manualShipmentData.trackingId || !manualShipmentData.courierName}
                  className="flex-1 px-4 py-3 bg-[#3a5d1e] text-white rounded-lg hover:bg-[#2d4818] disabled:opacity-50 font-medium"
                >
                  {actionLoading ? 'Saving...' : 'Save Shipment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
