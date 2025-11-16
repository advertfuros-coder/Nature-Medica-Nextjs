"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useInvoiceDownload } from "@/hooks/useInvoiceDownload";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheck,
  FiMapPin,
  FiCreditCard,
  FiDownload,
  FiClock,
  FiExternalLink,
  FiCopy,
  FiAlertCircle,
} from "react-icons/fi";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { orderId } = params;

  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const {
    downloadInvoice,
    loading: invoiceLoading,
    error: invoiceError,
  } = useInvoiceDownload();

  const handleDownloadInvoice = async () => {
    // Try Shiprocket first if order has shiprocketOrderId, otherwise use custom
    const source = order.shiprocketOrderId ? "shiprocket" : "custom";
    await downloadInvoice(order.orderId, source);
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);

        // If order has tracking ID, fetch tracking info
        if (data.order.trackingId) {
          fetchTrackingInfo(data.order.trackingId);
        }
      } else {
        alert("Order not found");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async (awb) => {
    setTrackingLoading(true);
    try {
      const res = await fetch(`/api/shipments/track/${awb}`);
      const data = await res.json();

      if (res.ok) {
        setTracking(data.tracking);
      }
    } catch (error) {
      console.error("Error fetching tracking:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("delivered")) return "bg-green-500";
    if (s.includes("shipped") || s.includes("transit")) return "bg-blue-500";
    if (s.includes("cancelled")) return "bg-red-500";
    if (s.includes("processing")) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getStatusSteps = () => {
    const status = order?.orderStatus?.toLowerCase() || "";
    const steps = [
      { name: "Confirmed", icon: FiCheck, completed: true },
      {
        name: "Processing",
        icon: FiPackage,
        completed: ["processing", "shipped", "delivered"].some((s) =>
          status.includes(s)
        ),
      },
      {
        name: "Shipped",
        icon: FiTruck,
        completed: ["shipped", "delivered"].some((s) => status.includes(s)),
      },
      {
        name: "Delivered",
        icon: FiCheck,
        completed: status.includes("delivered"),
      },
    ];
    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3a5d1e] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link
            href="/orders"
            className="text-[#3a5d1e] hover:underline font-semibold"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();
  const activities = tracking?.activities || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Order #{order.orderId}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button 
              onClick={handleDownloadInvoice}
              disabled={invoiceLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3a5d1e] text-white rounded-xl hover:bg-[#2d4818] transition-all font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {invoiceLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FiDownload className="w-4 h-4" />
                  Download Invoice
                </>
              )}
            </button>
          </div>

          {/* AWB Number Display - Prominent */}
          {order.trackingId && (
            <div className="bg-gradient-to-r from-[#3a5d1e]/10 to-blue-50 rounded-xl p-4 mb-6 border-2 border-[#3a5d1e]/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTruck className="w-5 h-5 text-[#3a5d1e]" />
                    <p className="text-sm font-semibold text-gray-700">
                      Tracking Number (AWB)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-mono font-semibold text-xl text-[#3a5d1e]">
                      {order.trackingId}
                    </p>
                    <button
                      onClick={() => copyToClipboard(order.trackingId)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Copy AWB"
                    >
                      <FiCopy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  {order.courierName && (
                    <p className="text-sm text-gray-600 mt-1">
                      Courier:{" "}
                      <span className="font-semibold">{order.courierName}</span>
                    </p>
                  )}
                </div>
                {/* <Link
                  href={`/track/${order.trackingId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3a5d1e] text-white rounded-xl hover:bg-[#2d4818] transition-all font-semibold text-sm shadow-md hover:shadow-lg"
                >
                  Track Shipment
                  <FiExternalLink className="w-4 h-4" />
                </Link> */}
              </div>
            </div>
          )}

          {/* Order Status Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    {/* Line before (except first) */}
                    {index > 0 && (
                      <div
                        className={`absolute top-5 right-1/2 w-full h-1 -z-10 ${
                          statusSteps[index - 1].completed && step.completed
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
                        step.completed ? "bg-green-500" : "bg-gray-300"
                      } text-white relative z-10`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <p
                      className={`mt-3 text-sm font-semibold ${
                        step.completed ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tracking Timeline Section */}
        {order.trackingId && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <FiMapPin className="w-6 h-6 text-[#3a5d1e]" />
                Shipment Timeline
              </h2>
              {trackingLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#3a5d1e] border-t-transparent"></div>
                  Loading tracking...
                </div>
              )}
            </div>

            {activities.length > 0 ? (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[#3a5d1e] via-gray-200 to-gray-200"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                  {activities.map((activity, index) => {
                    const isLatest = index === 0;
                    const isDelivered = activity.activity
                      ?.toLowerCase()
                      .includes("delivered");

                    return (
                      <div key={index} className="relative flex gap-4">
                        {/* Timeline Dot */}
                        <div
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg ${
                            isDelivered
                              ? "bg-green-500"
                              : isLatest
                              ? "bg-[#3a5d1e]"
                              : "bg-gray-300"
                          } text-white`}
                        >
                          {isDelivered ? (
                            <FiCheck className="w-6 h-6" />
                          ) : isLatest ? (
                            <FiTruck className="w-5 h-5" />
                          ) : (
                            <FiMapPin className="w-5 h-5" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6">
                          <div
                            className={`rounded-xl p-5 transition-all ${
                              isDelivered
                                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-md"
                                : isLatest
                                ? "bg-gradient-to-br from-green-50 to-blue-50 border-2 border-[#3a5d1e] shadow-md"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {activity.activity}
                              </h3>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  isLatest
                                    ? "bg-[#3a5d1e] text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {new Date(activity.date).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                              <FiMapPin className="w-4 h-4" />
                              <p>{activity.location}</p>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">
                              {new Date(activity.date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FiClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">
                  No tracking updates available yet
                </p>
                <p className="text-sm text-gray-400">
                  Updates will appear here once your order is shipped
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <FiPackage className="w-5 h-5 text-[#3a5d1e]" />
              Order Items ({order.items?.length || 0})
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 p-3 rounded-xl transition-colors"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    {item.variant && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.variant}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-lg text-[#3a5d1e]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Address */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-[#3a5d1e] w-5 h-5" />
                <h2 className="font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-xl">
                <p className="font-semibold text-gray-900 text-base">
                  {order.shippingAddress?.name}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p className="font-semibold">
                  {order.shippingAddress?.pincode}
                </p>
                <div className="pt-2 border-t border-gray-200">
                  <p className="font-semibold text-gray-900">
                    Phone: {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="text-[#3a5d1e] w-5 h-5" />
                <h2 className="font-semibold text-gray-900">Payment Details</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Payment Method</span>
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-xs ${
                      order.paymentMode === "online"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentMode === "online"
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-xs ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
                {order.paymentId && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-600 text-xs">Payment ID</span>
                    <p className="font-mono text-xs text-gray-900 mt-1 break-all">
                      {order.paymentId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Price Breakdown</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{order.totalPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -₹{order.discount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {order.deliveryCharge > 0 ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-semibold text-gray-900">
                      ₹{order.deliveryCharge?.toLocaleString("en-IN")}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-900 text-base">
                    Total Amount
                  </span>
                  <span className="font-semibold text-2xl text-[#3a5d1e]">
                    ₹
                    {(order.finalPrice || order.totalPrice)?.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl border border-blue-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">
            Need Help with Your Order?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="tel:+918400043322"
              className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all border border-blue-200"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <FiMapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Call Us</p>
                <p className="font-semibold text-blue-900">+91 8400043322</p>
              </div>
            </a>
            <a
              href="mailto:support@naturemedica.com"
              className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all border border-purple-200"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Email Us</p>
                <p className="font-semibold text-purple-900">
                  support@naturemedica.com
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
