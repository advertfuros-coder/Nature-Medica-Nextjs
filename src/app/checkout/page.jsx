'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddressForm from '@/components/customer/AddressForm';
import OrderSummary from '@/components/customer/OrderSummary';
import Script from 'next/script';
import { clearCart } from '@/store/slices/cartSlice';

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
      router.push('/login?redirect=/checkout');
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

    if (paymentMode === 'online' && !razorpayLoaded) {
      alert('Payment gateway is loading. Please wait...');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          title: item.product.title,
          image: item.product.images[0]?.url,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant
        })),
        totalPrice,
        discount,
        finalPrice: totalPrice - discount,
        shippingAddress: selectedAddress,
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
        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount * 100,
          currency: 'INR',
          name: 'NatureMedica',
          description: `Order #${data.orderId}`,
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            // Payment successful - Verify and create order
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
                // Clear cart and redirect to success page
                dispatch(clearCart());
                router.push(`/order-success?orderId=${verifyData.orderId}`);
              } else {
                alert('Payment verification failed. Please contact support with payment ID: ' + response.razorpay_payment_id);
                setLoading(false);
              }
            } catch (error) {
              alert('Payment verification error. Please contact support.');
              setLoading(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: selectedAddress.phone
          },
          notes: {
            orderId: data.orderId
          },
          theme: {
            color: '#059669'
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              alert('Payment cancelled. Your order was not placed.');
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function (response) {
          alert(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });

        razorpay.open();
      } else {
        // COD order - Order already created, clear cart and redirect
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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Delivery Address</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  {showAddressForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {showAddressForm && (
                <AddressForm 
                  onSuccess={() => setShowAddressForm(false)}
                />
              )}

              {!showAddressForm && (
                <div className="space-y-3">
                  {user.addresses?.length === 0 ? (
                    <p className="text-gray-600">No saved addresses. Please add one.</p>
                  ) : (
                    user.addresses?.map((address, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedAddress(address)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedAddress === address
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 uppercase">{address.type}</p>
                            <p className="text-gray-700">{address.street}</p>
                            <p className="text-gray-700">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-gray-700">Phone: {address.phone}</p>
                          </div>
                          <input
                            type="radio"
                            checked={selectedAddress === address}
                            onChange={() => setSelectedAddress(address)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  paymentMode === 'online' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMode === 'online'}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Online Payment</p>
                        <p className="text-sm text-gray-600">Pay using UPI, Cards, Net Banking, Wallets</p>
                        <p className="text-xs text-green-600 mt-1">✓ Order placed only after successful payment</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Powered by</span>
                        <span className="text-blue-600 font-bold">Razorpay</span>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  paymentMode === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMode === 'cod'}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive the order</p>
                  </div>
                </label>
              </div>

              {paymentMode === 'online' && !razorpayLoaded && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">Loading payment gateway...</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              totalPrice={totalPrice}
              discount={discount}
              couponCode={couponCode}
              onPlaceOrder={handlePlaceOrder}
              loading={loading}
              disabled={!selectedAddress}
            />
          </div>
        </div>
      </div>
    </>
  );
}
