'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { clearCart } from '@/store/slices/cartSlice';
import { Check, MapPin, CreditCard, Plus, Shield, Truck, Package, X, ChevronRight } from 'lucide-react';

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

  // Address form state
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    type: 'home'
  });

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

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });

      if (res.ok) {
        const data = await res.json();
        setShowAddressForm(false);
        setNewAddress({
          name: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          landmark: '',
          type: 'home'
        });
        // Refresh page or update user state
        window.location.reload();
      } else {
        alert('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!selectedAddress.name || !selectedAddress.phone || !selectedAddress.street || 
        !selectedAddress.city || !selectedAddress.state || !selectedAddress.pincode) {
      alert('Selected address is incomplete. Please update your address.');
      return;
    }

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

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to create order');
        setLoading(false);
        return;
      }

      if (paymentMode === 'online') {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount * 100,
          currency: 'INR',
          name: 'NatureMedica',
          description: `Order #${data.orderId}`,
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            try {
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

              if (verifyRes.ok) {
                dispatch(clearCart());
                router.push(`/order-success?orderId=${verifyData.orderId}`);
              } else {
                alert(`Payment verification failed: ${verifyData.error}`);
                setLoading(false);
              }
            } catch (error) {
              alert('Payment verification error');
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
        dispatch(clearCart());
        router.push(`/order-success?orderId=${data.order.orderId}`);
      }
    } catch (error) {
      console.error('Order error:', error);
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

      <div className="min-h-screen bg-gray-50">
        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-[#415f2d] text-white flex items-center justify-center text-[10px] font-medium">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-medium text-gray-900">Cart</span>
              </div>
              <div className="w-12 h-0.5 bg-[#415f2d]"></div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-[#415f2d] text-white flex items-center justify-center text-[10px] font-medium">
                  2
                </div>
                <span className="text-[11px] font-medium text-gray-900">Checkout</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200"></div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-medium">
                  3
                </div>
                <span className="text-[11px] font-medium text-gray-500">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Address Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#415f2d]/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-[#415f2d]" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">Delivery Address</h2>
                        <p className="text-[10px] text-gray-500">Select or add delivery address</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="inline-flex items-center gap-1 text-[#415f2d] hover:text-[#344b24] font-medium transition-colors text-[11px]"
                    >
                      {showAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {showAddressForm ? 'Cancel' : 'Add New'}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Add Address Form */}
                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-[12px] font-semibold text-gray-900 mb-3">Add New Address</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={newAddress.name}
                            onChange={handleAddressInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d]"
                            placeholder="Enter full name"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={newAddress.phone}
                            onChange={handleAddressInputChange}
                            required
                            pattern="[0-9]{10}"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d]"
                            placeholder="10-digit mobile"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Street Address</label>
                          <input
                            type="text"
                            name="street"
                            value={newAddress.street}
                            onChange={handleAddressInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d]"
                            placeholder="House no., Street name"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d]"
                            placeholder="City"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d]"
                            placeholder="State"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={newAddress.pincode}
                            onChange={handleAddressInputChange}
                            required
                            pattern="[0-9]{6}"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d]"
                            placeholder="6-digit pincode"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                          <input
                            type="text"
                            name="landmark"
                            value={newAddress.landmark}
                            onChange={handleAddressInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d]"
                            placeholder="Nearby landmark"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-medium text-gray-700 mb-2">Address Type</label>
                          <div className="flex gap-2">
                            {['home', 'office', 'other'].map((type) => (
                              <label
                                key={type}
                                className={`flex-1 px-3 py-2 border-2 rounded-lg cursor-pointer text-center transition-all text-[11px] font-medium ${
                                  newAddress.type === type
                                    ? 'border-[#415f2d] bg-[#415f2d]/10 text-[#415f2d]'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="type"
                                  value={type}
                                  checked={newAddress.type === type}
                                  onChange={handleAddressInputChange}
                                  className="sr-only"
                                />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="mt-4 w-full bg-[#415f2d] text-white py-2 rounded-lg hover:bg-[#344b24] transition-colors text-[11px] font-medium"
                      >
                        Save Address
                      </button>
                    </form>
                  )}

                  {/* Saved Addresses */}
                  {!showAddressForm && (
                    <div className="space-y-3">
                      {user.addresses?.length === 0 ? (
                        <div className="text-center py-8">
                          <MapPin className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                          <p className="text-gray-600 mb-3 text-[11px]">No saved addresses</p>
                          <button
                            onClick={() => setShowAddressForm(true)}
                            className="inline-flex items-center gap-1 bg-[#415f2d] text-white px-4 py-2 rounded-lg hover:bg-[#344b24] transition-all font-medium text-[11px]"
                          >
                            <Plus className="w-4 h-4" />
                            Add Address
                          </button>
                        </div>
                      ) : (
                        user.addresses?.map((address, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedAddress(address)}
                            className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedAddress === address
                                ? 'border-[#415f2d] bg-[#415f2d]/5 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-medium uppercase ${
                                    selectedAddress === address
                                      ? 'bg-[#415f2d] text-white'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {address.type}
                                  </span>
                                  {address.isDefault && (
                                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-blue-700">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-900 font-medium mb-1 text-[11px]">{address.name}</p>
                                <p className="text-gray-700 text-[10px] mb-1">{address.street}</p>
                                <p className="text-gray-600 text-[10px]">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                                <p className="text-gray-600 text-[10px] mt-1">
                                  Phone: {address.phone}
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedAddress === address
                                  ? 'border-[#415f2d] bg-[#415f2d]'
                                  : 'border-gray-300'
                              }`}>
                                {selectedAddress === address && (
                                  <Check className="w-3 h-3 text-white" />
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#415f2d]/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-[#415f2d]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Payment Method</h2>
                      <p className="text-[10px] text-gray-500">Choose payment option</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Online Payment */}
                  <label
                    className={`block p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMode === 'online'
                        ? 'border-[#415f2d] bg-[#415f2d]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
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
                            <p className="font-semibold text-gray-900 mb-1 text-[11px]">Online Payment</p>
                            <p className="text-[10px] text-gray-600">UPI, Cards, Net Banking, Wallets</p>
                          </div>
                          <span className="text-[10px] text-blue-600 font-bold">Razorpay</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-[10px] mt-2">
                          <Shield className="w-3 h-3" />
                          <span>Secure payment</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`block p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMode === 'cod'
                        ? 'border-[#415f2d] bg-[#415f2d]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
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
                        <p className="font-semibold text-gray-900 mb-1 text-[11px]">Cash on Delivery</p>
                        <p className="text-[10px] text-gray-600">Pay when you receive</p>
                      </div>
                    </div>
                  </label>

                  {paymentMode === 'online' && !razorpayLoaded && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] text-yellow-800 font-medium">Loading payment gateway...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-4 space-y-3">
                  {/* Order Items */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          <img
                            src={item.product.images[0]?.url || '/placeholder.png'}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-medium text-gray-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          {item.variant && (
                            <p className="text-[9px] text-gray-500">{item.variant}</p>
                          )}
                          <p className="text-[10px] text-gray-600 mt-0.5">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600 text-[11px]">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 text-[11px]">
                        <span>Discount {couponCode && `(${couponCode})`}</span>
                        <span className="font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600 text-[11px]">
                      <span>Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[12px] font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !selectedAddress}
                    className="w-full bg-[#415f2d] text-white py-2.5 rounded-lg hover:bg-[#344b24] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-[11px] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>

                  {/* Trust Badges */}
                  <div className="pt-3 space-y-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                      <Shield className="w-3.5 h-3.5 text-green-600" />
                      <span>100% secure payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                      <Truck className="w-3.5 h-3.5 text-green-600" />
                      <span>Free shipping on all orders</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                      <Package className="w-3.5 h-3.5 text-green-600" />
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
