'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  MapPin, 
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle,
  Search,
  Gift,
  AlertTriangle,
  Phone,
  Mail
} from 'lucide-react';

export default function ShippingPolicyPage() {
  const router = useRouter();
  const [pincode, setPincode] = useState('');
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  const lastUpdated = 'November 9, 2025';

  const shippingMethods = [
    {
      name: 'Standard Delivery',
      icon: Truck,
      duration: '3-7 business days',
      cost: 'FREE on orders ₹499+',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      name: 'Express Delivery',
      icon: Package,
      duration: '1-3 business days',
      cost: '₹99 (where available)',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const deliveryPartners = [
    { name: 'Shiprocket', description: 'Pan-India coverage' },
    { name: 'Delhivery', description: 'Fast & reliable' },
    { name: 'Ekart', description: 'Efficient delivery' }
  ];

  const nonServiceableItems = [
    'Products marked as "Out of Stock"',
    'International shipping (currently unavailable)',
    'Orders to PO Box addresses',
    'Restricted items as per courier policies'
  ];

  const packagingSteps = [
    {
      icon: Package,
      title: 'Secure Packaging',
      description: 'Products wrapped in bubble wrap and sealed boxes'
    },
    {
      icon: CheckCircle,
      title: 'Quality Check',
      description: 'Each order inspected before dispatch'
    },
    {
      icon: Gift,
      title: 'Tamper-Proof',
      description: 'Sealed with tamper-proof tape for safety'
    }
  ];

  const checkPincodeServiceability = async () => {
    if (pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }
    
    setCheckingDelivery(true);
    // Simulate API call
    setTimeout(() => {
      setCheckingDelivery(false);
      alert(`Delivery available at ${pincode}! Standard delivery: 3-7 days`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Shipping Policy</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Truck className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Fast & Reliable Shipping</h2>
          <p className="text-sm opacity-90 mb-2">
            We deliver your wellness products safely and on time, anywhere in India
          </p>
          <p className="text-xs opacity-75">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Free Shipping Banner */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-white" />
            <h3 className="text-lg font-bold text-white">FREE SHIPPING</h3>
          </div>
          <p className="text-white text-sm font-medium">
            On all orders above ₹499
          </p>
        </div>
      </div>

      {/* Pincode Checker */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3a5d1e]" />
            Check Delivery Availability
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter your pincode to check if we deliver to your location
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength="6"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit pincode"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#3a5d1e]"
            />
            <button
              onClick={checkPincodeServiceability}
              disabled={checkingDelivery}
              className="px-6 py-3 bg-[#3a5d1e] text-white rounded-lg font-semibold hover:bg-[#2d4818] disabled:opacity-50 flex items-center gap-2"
            >
              {checkingDelivery ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Shipping Methods */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Methods</h2>
        <div className="space-y-3">
          {shippingMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{method.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{method.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#3a5d1e] font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        <span>{method.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Timeline */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Timeline</h2>
        <div className="bg-white rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Order Placed</h4>
                <p className="text-sm text-gray-600">You receive instant order confirmation</p>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Instant
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Order Processing</h4>
                <p className="text-sm text-gray-600">We pack and prepare your order</p>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                1-2 Days
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">In Transit</h4>
                <p className="text-sm text-gray-600">Order shipped and on the way</p>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                2-5 Days
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#3a5d1e] rounded-full flex items-center justify-center flex-shrink-0 text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Delivered</h4>
                <p className="text-sm text-gray-600">Package delivered at your doorstep</p>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                Done!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Charges */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Charges</h2>
        <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Order Value</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Shipping Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-sm text-gray-700">Below ₹499</td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">₹40</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-3 px-4 text-sm text-gray-700 font-medium">₹499 and above</td>
                <td className="py-3 px-4 text-sm text-green-600 text-right font-bold">FREE</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-700">Express Delivery</td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">₹99</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-700">Remote Areas</td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">₹60-₹100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Packaging */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How We Pack Your Order</h2>
        <div className="grid grid-cols-1 gap-3">
          {packagingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-4 flex items-start gap-4 border-2 border-gray-200">
                <div className="w-12 h-12 bg-[#3a5d1e]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#3a5d1e]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Partners */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Our Delivery Partners</h2>
        <div className="bg-white rounded-xl p-4 grid grid-cols-3 gap-4">
          {deliveryPartners.map((partner, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{partner.name}</p>
              <p className="text-xs text-gray-600">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <div className="p-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Information</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Delivery timelines are estimates and may vary based on location and courier availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Orders placed before 2 PM are usually processed the same day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Ensure someone is available to receive the delivery during business hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>ID proof may be required for delivery verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Inspect the package before accepting - refuse if damaged</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Serviceable */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 border-2 border-red-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Currently Not Serviceable
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {nonServiceableItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Track Your Order
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Once your order is shipped, you'll receive tracking details via:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Email notification with tracking link</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">SMS with AWB number</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Real-time tracking in "My Orders" section</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-xl p-6 text-white text-center">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="font-bold text-lg mb-2">Questions About Shipping?</h3>
          <p className="text-sm opacity-90 mb-4">
            Our team is here to help with all your delivery queries
          </p>
          
          <div className="space-y-3">
            <a href="tel:+917007016231" className="block w-full bg-white text-[#3a5d1e] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              <Phone className="w-4 h-4 inline mr-2" />
              Call: +91 7007016231
            </a>
            <a href="mailto:naturemedica09@gmail.com" className="block w-full bg-white/20 backdrop-blur-sm py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
              <Mail className="w-4 h-4 inline mr-2" />
              Email: naturemedica09@gmail.com
            </a>
          </div>
          
          <p className="text-xs opacity-75 mt-4">
            Monday - Saturday: 9 AM - 6 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}
