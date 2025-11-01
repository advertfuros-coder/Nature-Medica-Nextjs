'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/customer/AddressForm';
import OrderSummary from '@/components/customer/OrderSummary';
import Script from 'next/script';
import { clearCart } from '@/store/slices/cartSlice';
import { FiMapPin, FiCreditCard, FiCheck, FiPlus, FiShield, FiTruck, FiPackage } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, totalPrice, discount, couponCode } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('online');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?redirect=/checkout');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [isAuthenticated, items, router]);

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find(addr => addr.isDefault);
      setSelectedAddress(defaultAddr || user.addresses[0]);
    }
  }, [user]);

const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    alert('Please select a delivery address');
    return;
  }

  // Validate address
  if (!selectedAddress.name || !selectedAddress.phone || !selectedAddress.street || 
      !selectedAddress.city || !selectedAddress.state || !selectedAddress.pincode) {
    alert('Selected address is incomplete. Please update your address.');
    return;
  }

  console.log('🛒 Starting order placement...');
  console.log('Selected address:', selectedAddress);

  setLoading(true);

  try {
    const orderData = {
      items: items.map(item => ({
        product: item.product._id,
        title: item.product.title,
        image: item.product.images[0]?.url || '',
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || ''
      })),
      totalPrice,
      discount,
      finalPrice: totalPrice - discount,
      shippingAddress: {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        landmark: selectedAddress.landmark || '',
        type: selectedAddress.type || 'home'
      },
      paymentMode,
      couponCode
    };

    console.log('📦 Order ', orderData);

    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    console.log('📨 API Response:', data);

    if (!res.ok) {
      console.error('❌ Order creation failed:', data);
      alert(data.error || 'Failed to create order');
      setLoading(false);
      return;
    }

    if (paymentMode === 'online') {
      // Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: 'INR',
        name: 'NatureMedica',
        description: `Order #${data.orderId}`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            console.log('💳 Payment success, verifying...');

            const verifyRes = await fetch('/api/orders/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderData: data.orderData
              })
            });

            const verifyData = await verifyRes.json();
            console.log('✅ Verification response:', verifyData);

            if (verifyRes.ok) {
              dispatch(clearCart());
              router.push(`/order-success?orderId=${verifyData.orderId}`);
            } else {
              alert(`Payment verification failed: ${verifyData.error}. Payment ID: ${response.razorpay_payment_id}`);
              setLoading(false);
            }
          } catch (error) {
            console.error('❌ Verification error:', error);
            alert(`Payment verification error. Payment ID: ${response.razorpay_payment_id}`);
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: selectedAddress.phone
        },
        theme: {
          color: '#415f2d'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      // COD
      console.log('✅ COD Order placed:', data.order.orderId);
      dispatch(clearCart());
      router.push(`/order-success?orderId=${data.order.orderId}`);
    }
  } catch (error) {
    console.error('❌ Order error:', error);
    alert('Failed to place order. Please try again.');
    setLoading(false);
  }
};


  if (!user || items.length === 0) {
    return null;
  }

  const finalPrice = totalPrice - discount;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          console.error('Razorpay SDK failed to load');
          alert('Payment gateway failed to load. Please refresh the page.');
        }}
      />

      <div className="min-h-screen mt-2 bg-gray-50">
        {/* Header */}
       

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-[#415f2d] text-white flex items-center justify-center text-[10px] font-medium">
                  <FiCheck />
                </div>
                <span className="text-[10px] font-medium text-gray-900">Cart</span>
              </div>
              <div className="w-8 h-0.5 bg-[#415f2d]"></div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-[#415f2d] text-white flex items-center justify-center text-[10px] font-medium">
                  2
                </div>
                <span className="text-[10px] font-medium text-gray-900">Checkout</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200"></div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">
                  3
                </div>
                <span className="text-[10px] font-medium text-gray-500">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 space-y-3">
              {/* Delivery Address Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-[#415f2d] bg-opacity-10 flex items-center justify-center">
                        <FiMapPin className="text-[#ffffff] text-xs" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">Delivery Address</h2>
                        <p className="text-[10px] text-gray-500">Where should we deliver your order?</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="inline-flex items-center gap-1 text-[#415f2d] hover:text-[#344b24] font-medium transition-colors text-[10px]"
                    >
                      <FiPlus className="text-xs" />
                      {showAddressForm ? 'Cancel' : 'Add New'}
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  {showAddressForm && (
                    <div className="mb-3">
                      <AddressForm 
                        onSuccess={() => setShowAddressForm(false)}
                      />
                    </div>
                  )}

                  {!showAddressForm && (
                    <div className="space-y-2"> 
                      {user.addresses?.length === 0 ? (
                        <div className="text-center py-4">
                          <FiMapPin className="mx-auto text-2xl text-gray-300 mb-1" />
                          <p className="text-gray-600 mb-2 text-[10px]">No saved addresses. Please add one.</p>
                          <button
                            onClick={() => setShowAddressForm(true)}
                            className="inline-flex items-center gap-1 bg-[#415f2d] text-white px-3 py-1.5 rounded-lg hover:bg-[#344b24] transition-all font-medium text-[10px]"
                          >
                            <FiPlus />
                            Add Address
                          </button>
                        </div>
                      ) : (
                        user.addresses?.map((address, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedAddress(address)}
                            className={`relative p-2 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              selectedAddress === address
                                ? 'border-[#415f2d] bg-[#415f2d2b] bg-opacity-5 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-medium uppercase ${
                                    selectedAddress === address 
                                      ? 'bg-[#415f2d] text-white' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {address.type}
                                  </span>
                                  {address.isDefault && (
                                    <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-medium bg-blue-50 text-blue-700">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-800 font-medium mb-0.5 text-[10px]">{address.street}</p>
                                <p className="text-gray-600 text-[10px]">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                                <p className="text-gray-600 text-[10px] mt-1">
                                  <span className="font-medium">Phone:</span> {address.phone}
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                                selectedAddress === address
                                  ? 'border-[#415f2d] bg-[#415f2d]'
                                  : 'border-gray-300'
                              }`}>
                                {selectedAddress === address && (
                                  <FiCheck className="text-white text-[10px]" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-[#415f2d] bg-opacity-10 flex items-center justify-center">
                      <FiCreditCard className="text-[#ffffff] text-xs" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Payment Method</h2>
                      <p className="text-[10px] text-gray-500">Choose your preferred payment option</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  {/* Online Payment */}
                  <label 
                    className={`block p-2 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMode === 'online' 
                        ? 'border-[#415f2d] bg-[#415f2d1c] bg-opacity-5 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        paymentMode === 'online'
                          ? 'border-[#415f2d] bg-[#415f2d]'
                          : 'border-gray-300'
                      }`}>
                        {paymentMode === 'online' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMode === 'online'}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="font-semibold text-gray-900 mb-0.5 text-[10px]">Online Payment</p>
                            <p className="text-[10px] text-gray-600">Pay using UPI, Cards, Net Banking, Wallets</p>
                          </div>
                          <div className="flex items-center gap-1   rounded-md">
                            {/* <span className="text-[8px] text-gray-600">Powered by</span> */}
                            <span className="text-[10px] text-blue-600 font-bold">Razorpay</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-[10px]">
                          <FiShield className="text-xs" />
                          <span>Secure and instant payment confirmation</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label 
                    className={`block p-2 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMode === 'cod' 
                        ? 'border-[#415f2d] bg-[#415f2d1c] bg-opacity-5 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        paymentMode === 'cod'
                          ? 'border-[#415f2d] bg-[#415f2d]'
                          : 'border-gray-300'
                      }`}>
                        {paymentMode === 'cod' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMode === 'cod'}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-0.5 text-[10px]">Cash on Delivery</p>
                        <p className="text-[10px] text-gray-600">Pay when you receive the order</p>
                      </div>
                    </div>
                  </label>

                  {paymentMode === 'online' && !razorpayLoaded && (
                    <div className="flex items-center gap-1 p-2 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] text-yellow-800 font-medium">Loading payment gateway...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                <div className="p-3 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-3 space-y-2">
                  {/* Order Items */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-1">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          <img
                            src={item.product.images[0]?.url || '/placeholder.png'}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                          
                        </div>
                        <div className="flex-1  ">
                          <h4 className="text-[10px] font-medium text-gray-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          {item.variant && (
                            <p className="text-[8px] text-gray-500">{item.variant}</p>
                          )}
                           
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600 text-[10px]">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 text-[10px]">
                        <span>Discount {couponCode && `(${couponCode})`}</span>
                        <span className="font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600 text-[10px]">
                      <span>Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-gray-900">Total</span>
                        <span className="text-base font-bold text-gray-900">
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !selectedAddress}
                    className="w-full bg-[#415f2d] text-white py-2 rounded-xl hover:bg-[#344b24] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-xs shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px]">Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiShield className="text-xs" />
                        <span className="text-[10px]">Place Order</span>
                      </>
                    )}
                  </button>

                  {/* Trust Badges */}
                  <div className="pt-2 space-y-1 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                      <FiShield className="text-green-600" />
                      <span>100% secure payments</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                      <FiTruck className="text-green-600" />
                      <span>Free shipping on all orders</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                      <FiPackage className="text-green-600" />
                      <span>Easy returns within 30 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
