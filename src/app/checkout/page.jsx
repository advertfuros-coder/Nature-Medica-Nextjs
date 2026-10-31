'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { clearCart, applyCoupon, removeCoupon, removeFromCart, updateQuantity, addToCart } from '@/store/slices/cartSlice';
import { Check, MapPin, Plus, Shield, Truck, Package, X, Loader2, Tag, Trash2, Minus, Zap, AlertCircle, Lock } from 'lucide-react';
import Script from 'next/script';
import { trackPurchase, trackAddShippingInfo, trackAddPaymentInfo, trackBeginCheckout } from '@/utils/analytics';
import AddressDeliverabilityCard from '@/components/customer/AddressDeliverabilityCard';
import AddressLocationSearch from '@/components/customer/AddressLocationSearch';
import { calculateAddressHygieneScore } from '@/lib/addressIntelligence';

// Utility to get default or first address id
function chooseDefaultAddressId(addresses) {
  if (!addresses || addresses.length === 0) return null;
  const defaultAddr = addresses.find(a => a.isDefault);
  return defaultAddr ? defaultAddr._id : addresses[0]._id;
}

const PREPAID_DISCOUNT = 50;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, totalPrice, discount, couponCode } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [areaOptions, setAreaOptions] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod' (partial_cod removed)
  const [bumpProduct, setBumpProduct] = useState(null); // one-click add-on offer
  const [isOrderPlacing, setIsOrderPlacing] = useState(false); // Flag to prevent cart redirect during order placement
  // The cart lives in localStorage; render nothing until mounted so server and client markup match
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Guest user details
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    houseNumber: '', // Flat / House / Door / Floor / Room No. & Building
    street: '', // Road, Colony, Sector, Area
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
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await response.json();

      if (response.ok && data[0]?.Status === 'Success' && data[0]?.PostOffice && data[0].PostOffice.length > 0) {
        const postOffices = data[0].PostOffice;

        const firstOffice = postOffices[0];
        setNewAddress(prev => ({
          ...prev,
          state: firstOffice.State || '',
          city: firstOffice.District || ''
        }));

        setAreaOptions(postOffices.map(office => ({
          name: office.Name,
          taluka: office.Block,
          division: office.Division
        })));

        setPincodeError('');
      } else {
        setPincodeError('Pincode details not found. Please enter City and State manually.');
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
    // Don't redirect if we're currently placing an order
    if (isOrderPlacing) return;

    if (!items || items.length === 0) {
      router.push('/cart');
      return;
    }
    // Only fetch addresses if user is authenticated
    if (isAuthenticated) {
      fetchUserAddresses();
    } else {
      // For guest users, show the address form by default
      setShowAddressForm(true);
    }
  }, [isAuthenticated, items?.length, router, isOrderPlacing]);



  useEffect(() => {
    if (addresses.length > 0 && !addresses.find(addr => addr._id === selectedAddressId)) {
      setSelectedAddressId(chooseDefaultAddressId(addresses));
    }
  }, [addresses, selectedAddressId]);

  // Load the checkout add-on offer (product with a bumpPrice configured)
  useEffect(() => {
    let cancelled = false;
    const ownedIds = items.filter((item) => item.variant !== 'bump').map((item) => item.product._id).join(',');
    fetch(`/api/products/bump?exclude=${ownedIds}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setBumpProduct(data.product || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Track begin_checkout on page load
  useEffect(() => {
    if (items && items.length > 0) {
      const deliveryCharge = totalPrice >= 499 ? 0 : 49;
      const finalPrice = totalPrice - discount + deliveryCharge;
      trackBeginCheckout(items.map(item => ({ ...item.product, quantity: item.quantity })), finalPrice, couponCode || '');
    }
  }, []); // Only on mount

  // Track payment method selection
  useEffect(() => {
    if (items && items.length > 0 && paymentMethod) {
      const deliveryCharge = totalPrice >= 499 ? 0 : 49;
      const finalPrice = totalPrice - discount + deliveryCharge;
      trackAddPaymentInfo(items.map(item => ({ ...item.product, quantity: item.quantity })), finalPrice, paymentMethod, couponCode || '');
    }
  }, [paymentMethod]); // Track when payment method changes

  const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

  // Real-time Ekart & Shiprocket Deliverability Intelligence
  const currentAddressHygiene = calculateAddressHygieneScore({
    houseNumber: newAddress.houseNumber,
    street: newAddress.street,
    landmark: newAddress.landmark,
    city: newAddress.city,
    state: newAddress.state,
    pincode: newAddress.pincode,
    phone: newAddress.phone
  });

  const selectedAddressHygiene = selectedAddress
    ? calculateAddressHygieneScore({
        street: selectedAddress.street,
        landmark: selectedAddress.landmark,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        phone: selectedAddress.phone
      })
    : null;

  const handleLocationSelect = (loc) => {
    setNewAddress((prev) => ({
      ...prev,
      houseNumber: loc.houseNumber || prev.houseNumber,
      street: loc.street || prev.street,
      city: loc.city || prev.city,
      state: loc.state || prev.state,
      pincode: loc.pincode || prev.pincode,
      landmark: loc.landmark || prev.landmark,
    }));
  };

  const handleAreaSelect = (areaName) => {
    setNewAddress((prev) => ({
      ...prev,
      street: prev.street ? `${prev.street}, ${areaName}` : areaName,
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'pincode' || name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');

      if (name === 'phone') {
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

    if (!currentAddressHygiene.isDeliverable) {
      alert(
        currentAddressHygiene.warnings[0] ||
        'Please provide a complete address with House/Flat No. and Street (Minimum 60% Deliverability Score required).'
      );
      return;
    }

    // For guest users, we don't save the address, just keep it in state
    if (!isAuthenticated) {
      return;
    }

    // For authenticated users, save to their account with combined street & hygiene score
    const combinedStreet = `${newAddress.houseNumber ? newAddress.houseNumber.trim() + ', ' : ''}${newAddress.street.trim()}`;
    const payload = {
      ...newAddress,
      street: combinedStreet,
      addressScore: currentAddressHygiene.score,
      addressQuality: currentAddressHygiene.tierLabel
    };

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchUserAddresses();
        setShowAddressForm(false);
        setNewAddress({
          name: '',
          phone: '',
          houseNumber: '',
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

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, orderValue: totalPrice })
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(applyCoupon({ code: data.coupon.code, discount: data.discount }));
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon');
      }
    } catch (error) {
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };



  const handleRemoveItem = (productId, variant) => {
    dispatch(removeFromCart({ productId, variant }));
    // Remove coupon when cart is modified
    if (couponCode) {
      dispatch(removeCoupon());
    }
  };

  const handleUpdateQuantity = (productId, variant, newQuantity) => {
    // If quantity would become 0 or less, remove the item from cart
    if (newQuantity < 1) {
      handleRemoveItem(productId, variant);
      return;
    }
    dispatch(updateQuantity({ productId, variant, quantity: newQuantity }));
    // Remove coupon when cart is modified
    if (couponCode) {
      dispatch(removeCoupon());
    }
  };

  const handlePlaceOrder = async () => {
    // Address Deliverability & Hygiene Validation (Ekart & Shiprocket Standards)
    if (!isAuthenticated) {
      if (!currentAddressHygiene.isDeliverable) {
        alert(
          currentAddressHygiene.warnings[0] ||
          'Please complete your address with House/Flat No. and Street (Minimum 60% Deliverability Score required to prevent courier return).'
        );
        return;
      }
    } else {
      // For authenticated users, require address selection
      if (!selectedAddress) {
        alert('Please select a delivery address');
        return;
      }
      if (selectedAddressHygiene && !selectedAddressHygiene.isDeliverable) {
        alert(
          `Your selected delivery address is incomplete (${selectedAddressHygiene.tierLabel}). Please click 'Add New' above to enter your House/Room number so your order is not returned.`
        );
        return;
      }
    }

    setLoading(true);

    try {
      // Use guest address or selected address
      const guestCombinedStreet = `${newAddress.houseNumber ? newAddress.houseNumber.trim() + ', ' : ''}${newAddress.street.trim()}`;
      const effectiveNewAddress = {
        ...newAddress,
        street: guestCombinedStreet,
        addressScore: currentAddressHygiene.score,
        addressQuality: currentAddressHygiene.tierLabel,
      };
      const shippingAddress = isAuthenticated ? selectedAddress : effectiveNewAddress;
      const userEmail = isAuthenticated ? user?.email : '';
      const userName = isAuthenticated ? user?.name : newAddress.name;

      /* 
      // Calculate partial COD amounts (20% advance)
      const advanceAmount = Math.round(finalPrice * 0.20);
      const codBalance = finalPrice - advanceAmount;
      */

      // Prepare order data
      const orderPayload = {
        items: items.map(item => ({
          product: item.product._id,
          title: item.product.title,
          image: item.product.images[0]?.url || '',
          quantity: item.quantity,
          price: item.price,
          variant: item.variant || '',
        })),
        totalPrice,
        discount: discount + prepaidDiscount,
        finalPrice,
        shippingAddress,
        paymentMode: paymentMethod, // 'online', 'cod', or 'partial_cod'
        couponCode,
        isGuest: !isAuthenticated,
        guestEmail: userEmail,
        guestName: userName,
        /*
        // Partial COD specific fields
        isPartialCOD: paymentMethod === 'partial_cod',
        advancePaid: paymentMethod === 'partial_cod' ? advanceAmount : 0,
        codAmountToCollect: paymentMethod === 'partial_cod' ? codBalance : 0,
        */
      };

      // Handle COD orders differently - create order directly
      if (paymentMethod === 'cod') {
        setIsOrderPlacing(true); // Prevent cart redirect
        try {
          const res = await fetch('/api/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
          });

          const data = await res.json();

          if (res.ok && data.orderId) {
            // Track purchase event
            trackPurchase({
              orderId: data.orderId,
              items: items.map(item => ({
                product: item.product,
                title: item.product.title,
                quantity: item.quantity,
                price: item.price
              })),
              finalPrice: finalPrice,
              tax: 0,
              shippingCharges: deliveryCharge,
              couponCode: couponCode || ''
            });

            // Clear cart and redirect to success page
            dispatch(clearCart());
            // Use replace to ensure immediate redirect without back button issues
            router.replace(`/checkout/success?orderId=${data.orderId}`);
          } else {
            alert(data.error || 'Failed to place order. Please try again.');
            setLoading(false);
            setIsOrderPlacing(false);
          }
        } catch (error) {
          console.error('COD order error:', error);
          alert('Failed to place order. Please try again.');
          setLoading(false);
          setIsOrderPlacing(false);
        }
        return;
      }

      // Handle online payment orders (both full prepaid and partial COD)
      // Store order data in sessionStorage to create after payment success
      sessionStorage.setItem('pendingOrderData', JSON.stringify(orderPayload));

      try {
        // Pre-generate a proper order ID (NM format) for Cashfree
        const orderIdRes = await fetch('/api/orders/generate-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const { orderId: properOrderId } = await orderIdRes.json();

        if (!properOrderId) {
          alert('Failed to generate order ID. Please try again.');
          setLoading(false);
          sessionStorage.removeItem('pendingOrderData');
          return;
        }

        // Store the pre-generated order ID
        sessionStorage.setItem('preGeneratedOrderId', properOrderId);

        // For partial COD, send only the advance amount to Cashfree (Commented out partial logic)
        // const amountToCharge = paymentMethod === 'partial_cod' ? advanceAmount : finalPrice;
        const amountToCharge = finalPrice;

        const sessionRes = await fetch('/api/cashfree/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: amountToCharge,
            address: shippingAddress,
            items: items,
            email: userEmail,
            orderId: properOrderId, // Use proper NM ID for Cashfree
            /*
            isPartialCOD: paymentMethod === 'partial_cod',
            codBalance: paymentMethod === 'partial_cod' ? codBalance : 0
            */
          }),
        });

        const sessionData = await sessionRes.json();

        if (sessionData.payment_session_id) {
          // Store the Cashfree order ID to verify later
          sessionStorage.setItem('cashfreeOrderId', sessionData.order_id);

          // Use the mode returned from the API (sandbox for TEST, production for PROD)
          const cashfree = window.Cashfree({
            mode: sessionData.mode || "sandbox"
          });
          cashfree.checkout({
            paymentSessionId: sessionData.payment_session_id,
            returnUrl: `${window.location.origin}/payment/status?order_id=${sessionData.order_id}`
          });
        } else {
          alert('Failed to initiate payment session');
          setLoading(false);
          sessionStorage.removeItem('pendingOrderData');
        }
      } catch (error) {
        console.error('Payment initiation error:', error);
        alert('Failed to initiate payment');
        setLoading(false);
        sessionStorage.removeItem('pendingOrderData');
      }
    } catch (error) {
      console.error('Place order error:', error);
      setLoading(false);
      alert('Failed to place order. Please try again.');
    }
  };


  // Allow rendering for both authenticated users and guests, just check for items
  if (!mounted || items.length === 0) return null;

  const deliveryCharge = totalPrice >= 499 ? 0 : 49;

  // Calculate total MRP and savings
  const totalMRP = items.reduce((sum, item) => {
    const mrp = item.product.mrp || item.price; // Fallback to price if MRP not available
    return sum + (mrp * item.quantity);
  }, 0);

  const mrpSavings = totalMRP - totalPrice; // Savings from MRP to selling price
  const totalSavings = mrpSavings + discount; // Total savings including coupon discount

  // Flat incentive for paying online (UPI / cards / net banking) instead of COD
  const bumpInCart = bumpProduct
    ? items.find((item) => item.product._id === bumpProduct._id)
    : null;

  const toggleBump = () => {
    if (!bumpProduct) return;
    if (bumpInCart) {
      dispatch(removeFromCart({ productId: bumpProduct._id, variant: bumpInCart.variant }));
    } else if (bumpProduct.offerPrice < bumpProduct.price) {
      // Special price: the 'bump' variant tells the server to apply bumpPrice
      dispatch(addToCart({
        product: { ...bumpProduct, price: bumpProduct.offerPrice },
        quantity: 1,
        variant: 'bump',
      }));
    } else {
      dispatch(addToCart({ product: bumpProduct, quantity: 1 }));
    }
  };

  const prepaidDiscount = paymentMethod === 'online' ? PREPAID_DISCOUNT : 0;
  const finalPrice = totalPrice - discount - prepaidDiscount + deliveryCharge;

  const canPlace = !loading && (isAuthenticated
    ? Boolean(selectedAddress) && !(selectedAddressHygiene && !selectedAddressHygiene.isDeliverable)
    : currentAddressHygiene.isDeliverable);

  const youSave = totalSavings + prepaidDiscount;
  const itemCount = items.reduce((n, item) => n + item.quantity, 0);

  const inputCls =
    'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-[#2d4e24] focus:ring-2 focus:ring-[#2d4e24]/15 transition-all';

  const payLabel = loading ? null : paymentMethod === 'online'
    ? `Pay ₹${finalPrice.toLocaleString('en-IN')} securely`
    : `Place order · ₹${finalPrice.toLocaleString('en-IN')}`;

  const PlaceOrderButton = ({ className = '' }) => (
    <button
      onClick={handlePlaceOrder}
      disabled={!canPlace}
      className={`w-full bg-[#2d4e24] text-white py-3.5 rounded-xl hover:bg-[#223d1b] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing order...</span>
        </>
      ) : (
        <>
          {paymentMethod === 'online' ? <Lock className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
          <span>{payLabel}</span>
        </>
      )}
    </button>
  );

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-[#f7f9f6] pb-44 lg:pb-12">
        {/* Header band with steps */}
        <section className="bg-gradient-to-b from-green-50/70 to-[#f7f9f6]">
          <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">Secure Checkout</h1>
              <p className="text-sm text-gray-600 mt-1">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} · ₹{finalPrice.toLocaleString('en-IN')} to pay
              </p>
            </div>
            <ol className="flex items-center gap-2 text-xs font-bold">
              {['Delivery', 'Payment', 'Done'].map((label, i) => (
                <li key={label} className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${i < 2 ? 'bg-[#2d4e24] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                    {i + 1}
                  </span>
                  <span className={i < 2 ? 'text-gray-900' : 'text-gray-400'}>{label}</span>
                  {i < 2 && <span className="w-6 sm:w-10 h-px bg-gray-300" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-6 xl:gap-8 items-start">
            {/* LEFT: delivery + payment */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Step 1: Delivery */}
              <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#2d4e24] text-white flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {isAuthenticated ? 'Delivery address' : 'Your details'}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {isAuthenticated ? 'Select or add where we should deliver' : 'Where should we deliver your order?'}
                      </p>
                    </div>
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="inline-flex items-center gap-1 text-[#2d4e24] hover:text-[#1e3418] font-bold text-sm cursor-pointer"
                    >
                      {showAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {showAddressForm ? 'Cancel' : 'Add new'}
                    </button>
                  )}
                </header>

                <div className="p-5">
                  {showAddressForm && (
                    <form onSubmit={isAuthenticated ? handleAddAddress : (e) => e.preventDefault()}>
                      <AddressLocationSearch
                        onAddressSelect={handleLocationSelect}
                        areaOptions={areaOptions}
                        onAreaSelect={handleAreaSelect}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
                        <Field label="Full name" required className="lg:col-span-3">
                          <input type="text" name="name" value={newAddress.name} onChange={handleAddressInputChange} required placeholder="Recipient full name" className={inputCls} />
                        </Field>

                        <Field label="Phone number" required hint="For delivery updates" className="lg:col-span-3">
                          <input type="tel" name="phone" value={newAddress.phone} onChange={handleAddressInputChange} required maxLength={10} pattern="^[6-9][0-9]{9}$" placeholder="10-digit mobile number" className={inputCls} />
                        </Field>

                        <Field label="PIN code" required className="lg:col-span-2">
                          <div className="relative">
                            <input type="text" name="pincode" value={newAddress.pincode} onChange={handleAddressInputChange} required maxLength={6} placeholder="6-digit PIN" className={inputCls} />
                            {pincodeLoading && (
                              <Loader2 className="w-4 h-4 text-[#2d4e24] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          {pincodeError && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><X className="w-3 h-3" />{pincodeError}</p>
                          )}
                        </Field>

                        <Field label="City / District" required className="lg:col-span-2">
                          <input type="text" name="city" value={newAddress.city} onChange={handleAddressInputChange} required placeholder="City" className={inputCls} />
                        </Field>

                        <Field label="State" required className="lg:col-span-2">
                          <input type="text" name="state" value={newAddress.state} onChange={handleAddressInputChange} required placeholder="State" className={inputCls} />
                        </Field>

                        <Field label="House / flat / building" required className="sm:col-span-2 lg:col-span-6">
                          <input type="text" name="houseNumber" value={newAddress.houseNumber || ''} onChange={handleAddressInputChange} required placeholder="e.g. Flat 302, Palm Heights" className={inputCls} />
                        </Field>

                        <Field label="Street, colony or area" required className="sm:col-span-2 lg:col-span-6">
                          <input type="text" name="street" value={newAddress.street} onChange={handleAddressInputChange} required placeholder="e.g. MG Road, Sector 15" className={inputCls} />
                        </Field>

                        <Field label="Landmark" hint="Optional, helps the courier find you" className="sm:col-span-2 lg:col-span-6">
                          <input type="text" name="landmark" value={newAddress.landmark} onChange={handleAddressInputChange} placeholder="e.g. Near Metro Station" className={inputCls} />
                        </Field>

                        <div className="sm:col-span-2 lg:col-span-6">
                          <span className="block text-xs font-bold text-gray-700 mb-1.5">Address type</span>
                          <div className="grid grid-cols-3 gap-2 max-w-sm">
                            {['home', 'work', 'other'].map((type) => (
                              <label
                                key={type}
                                className={`flex items-center justify-center px-3 py-2 border-2 rounded-xl cursor-pointer transition-all text-sm font-bold capitalize ${newAddress.type === type
                                  ? 'border-[#2d4e24] bg-[#eef5ec] text-[#2d4e24]'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                  }`}
                              >
                                <input type="radio" name="type" value={type} checked={newAddress.type === type} onChange={handleAddressInputChange} className="sr-only" />
                                {type}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Only surface the quality card when the address needs fixing */}
                      {(newAddress.houseNumber || newAddress.street || newAddress.landmark) && !currentAddressHygiene.isDeliverable && (
                        <div className="mt-4">
                          <AddressDeliverabilityCard hygiene={currentAddressHygiene} />
                        </div>
                      )}

                      {isAuthenticated && (
                        <button
                          type="submit"
                          disabled={pincodeLoading || !currentAddressHygiene.isDeliverable}
                          className="mt-5 w-full sm:w-auto bg-[#2d4e24] text-white px-8 py-3 rounded-xl hover:bg-[#223d1b] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-sm cursor-pointer"
                        >
                          Save address
                        </button>
                      )}
                    </form>
                  )}

                  {!showAddressForm && (
                    <div>
                      {addresses.length === 0 ? (
                        <div className="text-center py-8">
                          <MapPin className="mx-auto w-10 h-10 text-gray-300 mb-2" />
                          <p className="text-gray-600 mb-3 text-sm">No saved addresses yet</p>
                          <button onClick={() => setShowAddressForm(true)} className="inline-flex items-center gap-1.5 bg-[#2d4e24] text-white px-5 py-2.5 rounded-xl hover:bg-[#223d1b] transition-all font-bold text-sm cursor-pointer">
                            <Plus className="w-4 h-4" /> Add address
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          {addresses.map((address) => {
                            const isSelected = selectedAddressId === address._id;
                            const addrHygiene = calculateAddressHygieneScore({
                              street: address.street,
                              landmark: address.landmark,
                              city: address.city,
                              state: address.state,
                              pincode: address.pincode,
                              phone: address.phone
                            });

                            return (
                              <div
                                key={address._id}
                                onClick={() => setSelectedAddressId(address._id)}
                                className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all ${isSelected
                                  ? 'border-[#2d4e24] bg-[#eef5ec]/50 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isSelected ? 'bg-[#2d4e24] text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {address.type || 'home'}
                                      </span>
                                      {address.isDefault && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">Default</span>
                                      )}
                                    </div>
                                    <p className="text-gray-900 font-bold text-sm">{address.name}</p>
                                    <p className="text-gray-700 text-sm mt-0.5">{address.street}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{address.city}, {address.state} - {address.pincode}</p>
                                    {address.landmark && <p className="text-gray-500 text-xs mt-0.5">Landmark: {address.landmark}</p>}
                                    <p className="text-gray-500 text-xs mt-1">Phone: {address.phone}</p>

                                    {!addrHygiene.isDeliverable && (
                                      <p className="mt-2 flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5">
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                        This address looks incomplete. Use &quot;Add new&quot; and include your flat or house number.
                                      </p>
                                    )}
                                  </div>
                                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#2d4e24] bg-[#2d4e24]' : 'border-gray-300'}`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Step 2: Payment */}
              <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#2d4e24] text-white flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Payment method</h2>
                      <p className="text-xs text-gray-500">All transactions are secure</p>
                    </div>
                  </div>
                </header>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Online */}
                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`cursor-pointer p-5 border-2 rounded-2xl transition-all relative ${paymentMethod === 'online'
                      ? 'border-[#2d4e24] bg-[#eef5ec]/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <span className="absolute -top-2.5 left-4 bg-[#2d4e24] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Save ₹{PREPAID_DISCOUNT}
                    </span>
                    <div className="flex items-start gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${paymentMethod === 'online' ? 'border-[#2d4e24] bg-[#2d4e24]' : 'border-gray-300'}`}>
                        {paymentMethod === 'online' && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#2d4e24]" /> UPI, cards &amp; net banking
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Get an instant ₹{PREPAID_DISCOUNT} off when you pay online.
                        </p>
                        <Image
                          src="/checkout/online.png"
                          alt="UPI, cards and net banking accepted"
                          width={220}
                          height={32}
                          className="h-6 w-auto object-contain mt-3"
                        />
                        <p className="flex items-center gap-1.5 text-xs text-[#2d4e24] font-medium mt-3">
                          <Shield className="w-3.5 h-3.5" /> Secured by Cashfree
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`cursor-pointer p-5 border-2 rounded-2xl transition-all ${paymentMethod === 'cod'
                      ? 'border-[#2d4e24] bg-[#eef5ec]/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${paymentMethod === 'cod' ? 'border-[#2d4e24] bg-[#2d4e24]' : 'border-gray-300'}`}>
                        {paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" /> Cash on delivery
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Pay in cash or UPI to the delivery agent when your parcel arrives.
                        </p>
                        {paymentMethod === 'cod' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaymentMethod('online');
                            }}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2d4e24] underline cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" /> Switch to online and save ₹{PREPAID_DISCOUNT}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT: order summary */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden lg:sticky lg:top-24">
                <header className="px-5 py-4 bg-[#2d4e24] text-white flex items-center justify-between">
                  <h2 className="text-base font-bold tracking-tight">Order summary</h2>
                  <span className="text-xs font-semibold text-emerald-100">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                </header>

                <div className="p-5 space-y-4">
                  {/* Items */}
                  <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => {
                      const isGift = item.variant === 'gift';
                      return (
                        <li key={`${item.product._id}-${item.variant || ''}`} className="flex gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f4f7f2] flex-shrink-0">
                            <img src={item.product.images?.[0]?.url || '/placeholder.png'} alt={item.product.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.product.title}</h3>
                              {!isGift && (
                                <button onClick={() => handleRemoveItem(item.product._id, item.variant)} className="text-gray-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer" aria-label="Remove item">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                              {isGift ? (
                                <span className="text-[11px] font-bold text-[#2d4e24] bg-[#eef5ec] px-2 py-0.5 rounded-full">Free gift</span>
                              ) : (
                                <div className="flex items-center rounded-full border border-gray-200">
                                  <button onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#2d4e24] cursor-pointer" aria-label="Decrease quantity">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                                  <button onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#2d4e24] cursor-pointer" aria-label="Increase quantity">
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              <span className="text-sm font-bold text-gray-900">
                                {isGift ? 'FREE' : `₹${(item.price * item.quantity).toLocaleString('en-IN')}`}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* One-click add-on offer */}
                  {bumpProduct && (
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${bumpInCart ? 'border-[#2d4e24] bg-[#eef5ec]/60' : 'border-gray-300 bg-gray-50/60 hover:border-[#2d4e24]'}`}
                    >
                      <input type="checkbox" checked={Boolean(bumpInCart)} onChange={toggleBump} className="w-4 h-4 accent-[#2d4e24] flex-shrink-0" />
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                        <Image src={bumpProduct.images?.[0]?.url || '/placeholder.png'} alt={bumpProduct.title} fill sizes="44px" className="object-contain p-0.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#2d4e24]">Add to your order</p>
                        <p className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">{bumpProduct.shortTitle || bumpProduct.title}</p>
                        <p className="text-xs mt-0.5">
                          <span className="font-bold text-[#2d4e24]">₹{bumpProduct.offerPrice.toLocaleString('en-IN')}</span>{' '}
                          {(bumpProduct.mrp || bumpProduct.price) > bumpProduct.offerPrice && (
                            <span className="text-gray-400 line-through">₹{(bumpProduct.mrp || bumpProduct.price).toLocaleString('en-IN')}</span>
                          )}
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Coupon */}
                  <div>
                    {!couponCode ? (
                      <div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                              placeholder="Coupon code"
                              className={`${inputCls} pl-9`}
                            />
                          </div>
                          <button
                            onClick={handleApplyCoupon}
                            disabled={!couponInput || couponLoading}
                            className="bg-gray-900 text-white px-4 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm cursor-pointer"
                          >
                            {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                          </button>
                        </div>
                        {couponError && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><X className="w-3 h-3" /> {couponError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-[#eef5ec] border border-[#2d4e24]/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#2d4e24]" />
                          <div>
                            <p className="text-sm font-bold text-[#2d4e24]">{couponCode}</p>
                            <p className="text-[11px] text-gray-600">Coupon applied</p>
                          </div>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-gray-500 hover:text-gray-900 p-1 cursor-pointer" aria-label="Remove coupon">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price breakdown */}
                  <dl className="space-y-2.5 pt-4 border-t border-gray-100 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <dt>Subtotal</dt>
                      <dd className="font-semibold text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</dd>
                    </div>
                    {prepaidDiscount > 0 && (
                      <div className="flex justify-between text-[#2d4e24]">
                        <dt>Online payment discount</dt>
                        <dd className="font-semibold">-₹{prepaidDiscount.toLocaleString('en-IN')}</dd>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-[#2d4e24]">
                        <dt>Discount {couponCode && `(${couponCode})`}</dt>
                        <dd className="font-semibold">-₹{discount.toLocaleString('en-IN')}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <dt>Delivery</dt>
                      <dd className={`font-semibold ${deliveryCharge === 0 ? 'text-[#2d4e24]' : 'text-gray-900'}`}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
                      <dt className="text-base font-bold text-gray-900">Total</dt>
                      <dd className="text-2xl font-bold text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</dd>
                    </div>
                    {youSave > 0 && (
                      <p className="text-xs font-semibold text-[#2d4e24] bg-[#eef5ec] rounded-lg px-3 py-2 text-center">
                        You are saving ₹{youSave.toLocaleString('en-IN')} on this order
                      </p>
                    )}
                  </dl>

                  {paymentMethod === 'cod' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className="w-full flex items-center justify-between gap-2 text-xs font-bold text-[#2d4e24] bg-[#f4f7f2] border border-[#2d4e24]/15 rounded-xl px-3 py-2.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Pay via UPI and save ₹{PREPAID_DISCOUNT}</span>
                      <span>Switch</span>
                    </button>
                  )}

                  <div className="hidden lg:block">
                    <PlaceOrderButton />
                  </div>

                  {/* Why the button is disabled */}
                  {!loading && !canPlace && (
                    <p className="flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>
                        {isAuthenticated
                          ? (!selectedAddress
                            ? 'Select a delivery address to continue.'
                            : 'Your selected address looks incomplete. Add a new one with your flat or house number.')
                          : (currentAddressHygiene.warnings[0] || 'Complete your house number and street to continue.')}
                      </span>
                    </p>
                  )}

                  <ul className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    {[
                      { icon: Shield, label: 'Secure payments' },
                      { icon: Truck, label: 'Free shipping ₹499+' },
                      { icon: Package, label: '7-day returns' },
                    ].map(({ icon: Icon, label }) => (
                      <li key={label} className="flex flex-col items-center text-center gap-1.5">
                        <span className="w-9 h-9 rounded-full bg-[#eef5ec] text-[#2d4e24] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile sticky pay bar (above the bottom navigation) */}
        <div className="lg:hidden fixed bottom-[calc(60px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <p className="text-[11px] text-gray-500 font-medium">Total</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">₹{finalPrice.toLocaleString('en-IN')}</p>
            </div>
            <PlaceOrderButton className="py-3" />
          </div>
        </div>
      </div>
    </>
  );
}

// Labelled form field used by the address form
function Field({ label, required, hint, className = '', children }) {
  return (
    <div className={className}>
      <label className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {hint && <span className="font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
