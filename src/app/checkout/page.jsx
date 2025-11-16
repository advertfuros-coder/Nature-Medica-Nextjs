'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { clearCart } from '@/store/slices/cartSlice';
import { Check, MapPin, Plus, Shield, Truck, Package, X, CreditCard, Loader2 } from 'lucide-react';

// Utility to get default or first address id
function chooseDefaultAddressId(addresses) {
  if (!addresses || addresses.length === 0) return null;
  const defaultAddr = addresses.find(a => a.isDefault);
  return defaultAddr ? defaultAddr._id : addresses[0]._id;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, totalPrice, discount, couponCode } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [areaOptions, setAreaOptions] = useState([]);

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

  // Fetch pincode details using internal API route
  const fetchPincodeDetails = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
      setPincodeError('');
      setAreaOptions([]);
      return;
    }

    setPincodeLoading(true);
    setPincodeError('');
    setAreaOptions([]);

    try {
      // Call internal Next.js API route instead of external API directly
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await response.json();

      if (response.ok && data[0]?.Status === 'Success' && data[0]?.PostOffice && data[0].PostOffice.length > 0) {
        const postOffices = data[0].PostOffice;
        
        // Set state and city from first result
        const firstOffice = postOffices[0];
        setNewAddress(prev => ({
          ...prev,
          state: firstOffice.State || '',
          city: firstOffice.District || ''
        }));

        // Store all area options for user selection
        setAreaOptions(postOffices.map(office => ({
          name: office.Name,
          taluka: office.Block,
          division: office.Division
        })));

        setPincodeError('');
      } else {
        setPincodeError('Invalid pincode or no data found');
        setNewAddress(prev => ({
          ...prev,
          state: '',
          city: ''
        }));
      }
    } catch (error) {
      setPincodeError('Failed to fetch pincode details');
      setNewAddress(prev => ({
        ...prev,
        state: '',
        city: ''
      }));
    } finally {
      setPincodeLoading(false);
    }
  };

  // Debounced pincode lookup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (newAddress.pincode && newAddress.pincode.length === 6) {
        fetchPincodeDetails(newAddress.pincode);
      } else if (newAddress.pincode && newAddress.pincode.length < 6) {
        // Reset fields if pincode is incomplete
        setNewAddress(prev => ({
          ...prev,
          state: '',
          city: ''
        }));
        setAreaOptions([]);
        setPincodeError('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [newAddress.pincode]);

  // Fetch all addresses from your API
  const fetchUserAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        if (data.user && Array.isArray(data.user.addresses)) {
          setAddresses(data.user.addresses);
          setSelectedAddressId(chooseDefaultAddressId(data.user.addresses));
        } else {
          setAddresses([]);
          setSelectedAddressId(null);
        }
      } else {
        setAddresses([]);
        setSelectedAddressId(null);
      }
    } catch (error) {
      setAddresses([]);
      setSelectedAddressId(null);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?redirect=/checkout');
      return;
    }
    if (!items || items.length === 0) {
      router.push('/cart');
      return;
    }
    fetchUserAddresses();
  }, [isAuthenticated, items?.length, router]);

  // Ensure selection stays valid when addresses update
  useEffect(() => {
    if (addresses.length > 0 && !addresses.find(addr => addr._id === selectedAddressId)) {
      setSelectedAddressId(chooseDefaultAddressId(addresses));
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

const handleAddressInputChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'pincode' || name === 'phone') {
    const digitsOnly = value.replace(/\D/g, '');
    
    // Additional validation for phone - only allow numbers starting with 6,7,8,9
    if (name === 'phone') {
      // Only update if empty or starts with valid digit
      if (digitsOnly.length === 0 || /^[6-9]/.test(digitsOnly)) {
        setNewAddress(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setNewAddress(prev => ({ ...prev, [name]: digitsOnly }));
    }
  } else {
    setNewAddress(prev => ({ ...prev, [name]: value }));
  }
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
        await fetchUserAddresses();
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
        setAreaOptions([]);
        setPincodeError('');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to add address');
      }
    } catch (error) {
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
        finalPrice: totalPrice - discount + 30,
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
        if (!razorpayLoaded) {
          alert('Payment gateway not loaded. Please try again.');
          setLoading(false);
          return;
        }
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
                router.push('/thankyou');
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
          theme: { color: '#415f2d' },
          modal: { ondismiss: function () { setLoading(false); } }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        dispatch(clearCart());
        router.push('/thankyou');
      }
    } catch {
      setLoading(false);
      alert('Failed to place order. Please try again.');
    }
  };

  if (!user || items.length === 0) return null;

  const deliveryCharge = 30;
  const finalPrice = totalPrice - discount + deliveryCharge;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Address section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
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
                    className="inline-flex items-center gap-1 text-[#415f2d] hover:text-[#344b24] font-semibold transition-colors text-[11px]"
                  >
                    {showAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddressForm ? 'Cancel' : 'Add New'}
                  </button>
                </div>
                <div className="p-4">
                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="mb-4  rounded-lg">
                      <h3 className="text-[12px] font-semibold text-gray-900 mb-3">Add New Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Name */}
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={newAddress.name}
                            onChange={handleAddressInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d]"
                          />
                        </div>

                      <div>
  <label className="block text-[10px] font-medium text-gray-700 mb-1">Phone</label>
  <input
    type="tel"
    name="phone"
    value={newAddress.phone}
    onChange={handleAddressInputChange}
    required
    maxLength={10}
    pattern="^[6-9][0-9]{9}$"
    placeholder="98XXXXXXXX"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d]"
  />
  <p className="text-[9px] text-gray-500 mt-0.5">Must start with 6, 7, 8, or 9</p>
</div>

                        {/* Pincode - Smart Autocomplete */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1">
                            Pincode <span className="text-[#415f2d]">*</span>
                           </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="pincode"
                              value={newAddress.pincode}
                              onChange={handleAddressInputChange}
                              required
                              maxLength={6}
                              placeholder="Enter 6-digit pincode"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d]"
                            />
                            {pincodeLoading && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 text-[#415f2d] animate-spin" />
                              </div>
                            )}
                          </div>
                          {pincodeError && (
                            <div className="mt-1 flex items-center gap-1 text-[9px] text-red-600">
                              <X className="w-3 h-3" />
                              <span>{pincodeError}</span>
                            </div>
                          )}
                          {areaOptions.length > 0 && (
                            <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-1">
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="text-[9px] text-green-700 font-semibold">
                                Pincode verified - {areaOptions.length} area(s) found
                              </span>
                            </div>
                          )}
                        </div>

                        {/* City - Auto-filled */}
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1">City/District</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressInputChange}
                            required
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d] ${
                              areaOptions.length > 0 ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                            readOnly={areaOptions.length > 0}
                          />
                        </div>

                        {/* State - Auto-filled */}
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressInputChange}
                            required
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d] ${
                              areaOptions.length > 0 ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                            readOnly={areaOptions.length > 0}
                          />
                        </div>

                        {/* Street Address */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1"> Address</label>
                          <textarea
                            name="street"
                            value={newAddress.street}
                            onChange={handleAddressInputChange}
                            required
                            rows={2}
                            placeholder="House/Flat no, Building name, Street"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d] resize-none"
                          />
                        </div>

                        {/* Landmark */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1">Landmark (Optional)</label>
                          <input
                            type="text"
                            name="landmark"
                            value={newAddress.landmark}
                            onChange={handleAddressInputChange}
                            placeholder="Near landmark..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d]"
                          />
                        </div>

                        {/* Address Type */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-gray-700 mb-1">Address Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['home', 'work', 'other'].map((type) => (
                              <label
                                key={type}
                                className={`flex items-center justify-center gap-1 px-3 py-2 border-2 rounded-lg cursor-pointer transition-all text-[11px] font-semibold capitalize ${
                                  newAddress.type === type
                                    ? 'border-[#415f2d] bg-[#415f2d]/5 text-[#415f2d]'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
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
                                {type}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={pincodeLoading || (newAddress.pincode.length === 6 && !newAddress.city)}
                        className="mt-4 w-full bg-[#415f2d] text-white py-2.5 rounded-lg hover:bg-[#344b24] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[11px] font-semibold shadow-sm hover:shadow-md"
                      >
                        Save Address
                      </button>
                    </form>
                  )}

                  {/* Show all addresses */}
                  {!showAddressForm && (
                    <div className="space-y-3">
                      {addresses.length === 0 ? (
                        <div className="text-center py-8">
                          <MapPin className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                          <p className="text-gray-600 mb-3 text-[11px]">No saved addresses</p>
                          <button
                            onClick={() => setShowAddressForm(true)}
                            className="inline-flex items-center gap-1 bg-[#415f2d] text-white px-4 py-2 rounded-lg hover:bg-[#344b24] transition-all font-semibold text-[11px]"
                          >
                            <Plus className="w-4 h-4" />
                            Add Address
                          </button>
                        </div>
                      ) : (
                        addresses.map((address) => {
                          const isSelected = selectedAddressId === address._id;
                          return (
                            <div
                              key={address._id}
                              onClick={() => setSelectedAddressId(address._id)}
                              className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#415f2d] bg-[#415f2d]/5 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                                      isSelected
                                        ? 'bg-[#415f2d] text-white'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {address.type || 'home'}
                                    </span>
                                    {address.isDefault && (
                                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-700">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-900 font-semibold mb-1 text-[11px]">{address.name}</p>
                                  <p className="text-gray-700 text-[10px] mb-1">{address.street}</p>
                                  <p className="text-gray-600 text-[10px]">
                                    {address.city}, {address.state} - {address.pincode}
                                  </p>
                                  {address.landmark && (
                                    <p className="text-gray-500 text-[10px] mt-0.5">Near: {address.landmark}</p>
                                  )}
                                  <p className="text-gray-600 text-[10px] mt-1">
                                    Phone: {address.phone}
                                  </p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  isSelected
                                    ? 'border-[#415f2d] bg-[#415f2d]'
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
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
                      <p className="text-[10px] text-yellow-800 font-semibold">Loading payment gateway...</p>
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
                          <h4 className="text-[11px] font-semibold text-gray-900 line-clamp-1">
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
                      <span className="font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 text-[11px]">
                        <span>Discount {couponCode && `(${couponCode})`}</span>
                        <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600 text-[11px]">
                      <span>Shipping (₹30)</span>
                      <span className="font-semibold">₹{deliveryCharge}</span>
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
