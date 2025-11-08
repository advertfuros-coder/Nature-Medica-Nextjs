'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  RotateCcw, 
  CreditCard, 
  Clock, 
  CheckCircle,
  XCircle,
  Package,
  Truck,
  AlertCircle,
  Mail,
  Phone,
  FileText
} from 'lucide-react';

export default function RefundPolicyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('returns');

  const lastUpdated = 'November 9, 2025';

  const eligibleItems = [
    'Unopened and unused products',
    'Products in original packaging with tags',
    'Products with valid invoice/receipt',
    'Products within 7 days of delivery',
    'Defective or damaged products',
    'Wrong products delivered'
  ];

  const nonEligibleItems = [
    'Opened dietary supplements or consumables',
    'Products without original packaging',
    'Products beyond 7-day return window',
    'Products showing signs of use',
    'Sale or clearance items (unless defective)',
    'Gift cards or e-vouchers'
  ];

  const refundTimeline = [
    {
      step: '1',
      title: 'Initiate Return',
      description: 'Contact us within 7 days of delivery',
      duration: 'Day 1',
      icon: Mail
    },
    {
      step: '2',
      title: 'Return Approval',
      description: 'We review and approve your return request',
      duration: '1-2 Days',
      icon: CheckCircle
    },
    {
      step: '3',
      title: 'Ship Product',
      description: 'Pack and ship the product to our return address',
      duration: '2-3 Days',
      icon: Truck
    },
    {
      step: '4',
      title: 'Quality Check',
      description: 'We inspect the returned product',
      duration: '2-3 Days',
      icon: Package
    },
    {
      step: '5',
      title: 'Refund Processed',
      description: 'Money credited to your original payment method',
      duration: '5-7 Days',
      icon: CreditCard
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Refund Policy</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <RotateCcw className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">7-Day Return & Refund Policy</h2>
          <p className="text-sm opacity-90 mb-2">
            We want you to be completely satisfied with your purchase. If you're not happy, we're here to help.
          </p>
          <p className="text-xs opacity-75">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#3a5d1e] mb-1">7 Days</div>
              <div className="text-xs text-gray-600">Return Window</div>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <div className="text-2xl font-bold text-[#3a5d1e] mb-1">5-7 Days</div>
              <div className="text-xs text-gray-600">Refund Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#3a5d1e] mb-1">100%</div>
              <div className="text-xs text-gray-600">Money Back</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('returns')}
              className={`py-3 text-sm font-medium transition-colors ${
                activeTab === 'returns'
                  ? 'bg-[#3a5d1e] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Returns
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`py-3 text-sm font-medium transition-colors ${
                activeTab === 'refunds'
                  ? 'bg-[#3a5d1e] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Refunds
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'returns' ? (
              <div className="space-y-4">
                {/* Return Eligibility */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Eligible for Return
                  </h3>
                  <ul className="space-y-2">
                    {eligibleItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Eligible */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Not Eligible for Return
                  </h3>
                  <ul className="space-y-2">
                    {nonEligibleItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Once we receive and inspect your returned item, we will process your refund to the original payment method within 5-7 business days.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Refund Timeline by Payment Method:
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-700">Credit/Debit Card</span>
                      <span className="font-semibold text-gray-900">5-7 business days</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-700">UPI / Net Banking</span>
                      <span className="font-semibold text-gray-900">3-5 business days</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-700">Wallet</span>
                      <span className="font-semibold text-gray-900">2-3 business days</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Cash on Delivery</span>
                      <span className="font-semibold text-gray-900">7-10 business days (bank transfer)</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Process Timeline */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Return & Refund Process</h2>
        <div className="bg-white rounded-xl p-4 space-y-4">
          {refundTimeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#3a5d1e] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    {index < refundTimeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to Initiate Return */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            How to Initiate a Return
          </h3>
          
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Contact Us</p>
                <p className="text-sm text-gray-600 mt-1">
                  Email us at naturemedica09@gmail.com or call +91 7007016231 within 7 days of delivery
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Provide Details</p>
                <p className="text-sm text-gray-600 mt-1">
                  Share your order number, reason for return, and product photos if applicable
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Get Approval</p>
                <p className="text-sm text-gray-600 mt-1">
                  We'll review your request and send return instructions within 24 hours
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium text-gray-900">Pack & Ship</p>
                <p className="text-sm text-gray-600 mt-1">
                  Securely pack the product with invoice and ship to our return address
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Important Notes */}
      <div className="p-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Shipping charges are non-refundable (except for defective/wrong items)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Return shipping costs are borne by the customer unless the product is defective or wrong</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Partial refunds may apply if the product is not in original condition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>We reserve the right to refuse returns that don't meet our criteria</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Defective/Damaged Products */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 border-2 border-red-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            Received Defective or Damaged Product?
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            If you receive a defective or damaged product, we'll make it right immediately:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Free return shipping</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Immediate replacement or full refund</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Priority processing within 24 hours</span>
            </li>
          </ul>
          <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Note:</strong> Please take photos/video of the damaged product and packaging before opening. This helps us process your claim faster.
          </p>
        </div>
      </div>

      {/* Contact Support */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-xl p-6 text-white text-center">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="font-bold text-lg mb-2">Need Help with a Return?</h3>
          <p className="text-sm opacity-90 mb-4">
            Our customer support team is ready to assist you
          </p>
          
          <div className="space-y-3 mb-4">
            <a href="tel:+917007016231" className="block w-full bg-white text-[#3a5d1e] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              <Phone className="w-4 h-4 inline mr-2" />
              Call: +91 7007016231
            </a>
            <a href="mailto:naturemedica09@gmail.com" className="block w-full bg-white/20 backdrop-blur-sm py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
              <Mail className="w-4 h-4 inline mr-2" />
              Email: naturemedica09@gmail.com
            </a>
          </div>
          
          <p className="text-xs opacity-75">
            Monday - Saturday: 9 AM - 6 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}
