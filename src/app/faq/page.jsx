'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  HelpCircle, 
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  User,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function FAQPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: HelpCircle },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'products', label: 'Products', icon: Shield },
    { id: 'account', label: 'Account', icon: User }
  ];

  const faqs = [
    // Orders
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: `To place an order:
        1. Browse products and add items to your cart
        2. Click on the cart icon and review your items
        3. Proceed to checkout and enter shipping details
        4. Choose payment method and complete payment
        5. You'll receive an order confirmation email`
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: `You can cancel your order before it's shipped:
        - Go to "My Orders" section
        - Select the order you want to cancel
        - Click "Cancel Order" button
        - Once shipped, you'll need to return the product instead
        
        For modifications, please contact us immediately at +91 8400043322`
    },
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: `Track your order easily:
        - Check your email for tracking details
        - Go to "My Orders" in your account
        - Click on the order to see real-time tracking
        - You'll also receive SMS updates on order status`
    },
    {
      category: 'orders',
      question: 'What if my order is delayed?',
      answer: `If your order is delayed beyond the estimated delivery date:
        - Check tracking status in "My Orders"
        - Contact the courier directly using AWB number
        - Reach out to our support team for assistance
        - We'll help expedite delivery or offer alternatives`
    },

    // Payments
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: `We accept multiple payment methods:
        - Credit/Debit Cards (Visa, Mastercard, RuPay)
        - UPI (GPay, PhonePe, Paytm, etc.)
        - Net Banking
        - Digital Wallets (Paytm, PhonePe, Amazon Pay)
        - Cash on Delivery (COD) - available for eligible orders
        
        All payments are processed securely through Razorpay`
    },
    {
      category: 'payments',
      question: 'Is Cash on Delivery (COD) available?',
      answer: `Yes! COD is available with these conditions:
        - Available for most locations across India
        - COD charges: ₹40 per order
        - Maximum order value: ₹50,000
        - Payment in exact amount preferred
        - Have your order number ready when paying`
    },
    {
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: `Absolutely! Your payment security is our priority:
        - All payments processed through Razorpay (PCI DSS certified)
        - 256-bit SSL encryption for all transactions
        - We never store your complete card details
        - Two-factor authentication for added security`
    },
    {
      category: 'payments',
      question: 'My payment failed but money was deducted. What should I do?',
      answer: `Don't worry! Here's what happens:
        - If payment fails, amount is usually auto-refunded in 5-7 days
        - Check your bank/UPI app for refund status
        - Contact your bank if not refunded within 7 days
        - Email us at naturemedica09@gmail.com with transaction details
        - We'll help resolve the issue immediately`
    },

    // Shipping
    {
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: `Yes! Free shipping on orders above ₹1499
        - Standard delivery: 3-7 business days
        - Orders below ₹499: ₹40 shipping charge
        - Express delivery: ₹99 (where available)
        - We ship pan-India through trusted partners`
    },
    {
      category: 'shipping',
      question: 'How long does delivery take?',
      answer: `Delivery timelines:
        - Metro cities: 3-5 business days
        - Tier 2 cities: 4-6 business days
        - Remote areas: 5-7 business days
        - Express delivery: 1-3 business days (select locations)
        
        You'll receive estimated delivery date at checkout`
    },
    {
      category: 'shipping',
      question: 'Can I change my delivery address?',
      answer: `Yes, but only before the order is shipped:
        - Contact us immediately at +91 8400043322
        - Provide your order number and new address
        - We'll update it if the order hasn't been dispatched
        - Once shipped, address cannot be changed`
    },
    {
      category: 'shipping',
      question: 'What if no one is available to receive the delivery?',
      answer: `If delivery attempt fails:
        - Courier will try 2-3 times over 3 days
        - You'll receive SMS/call notifications
        - Contact courier to reschedule delivery
        - Package returns to us after failed attempts
        - Return shipping charges may apply for re-delivery`
    },

    // Returns & Refunds
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: `7-day return policy from date of delivery:
        - Products must be unused and in original packaging
        - Tags and labels should be intact
        - Include original invoice with return
        - Some products (opened supplements) not eligible
        - Contact us within 7 days to initiate return`
    },
    {
      category: 'returns',
      question: 'How do I return a product?',
      answer: `To return a product:
        1. Email naturemedica09@gmail.com or call +91 8400043322
        2. Provide order number and reason for return
        3. We'll approve and send return instructions
        4. Pack securely with invoice and ship to our address
        5. Refund processed within 7-10 days of receiving item`
    },
    {
      category: 'returns',
      question: 'How long does refund take?',
      answer: `Refund timeline by payment method:
        - Credit/Debit Card: 5-7 business days
        - UPI/Net Banking: 3-5 business days
        - Wallets: 2-3 business days
        - COD orders: 7-10 days (bank transfer)
        
        You'll receive email confirmation when refund is initiated`
    },
    {
      category: 'returns',
      question: 'Who pays for return shipping?',
      answer: `Return shipping costs:
        - Defective/Wrong items: We pay return shipping
        - Change of mind: Customer pays return shipping
        - Shipping charges are non-refundable
        - Use courier service we recommend for faster processing`
    },

    // Products
    {
      category: 'products',
      question: 'Are your products 100% authentic?',
      answer: `Yes! All products are 100% authentic:
        - Sourced directly from authorized distributors
        - Original manufacturer packaging and seals
        - Batch numbers and expiry dates clearly mentioned
        - Quality checked before dispatch
        - Certificates available on request`
    },
    {
      category: 'products',
      question: 'How do I know which product is right for me?',
      answer: `Choosing the right product:
        - Read detailed product descriptions
        - Check customer reviews and ratings
        - Consult product labels for ingredients
        - Contact our wellness experts for guidance
        - Always consult your healthcare provider before starting supplements`
    },
    {
      category: 'products',
      question: 'Do you have expiry date guarantee?',
      answer: `Yes! We ensure:
        - Minimum 6 months shelf life on delivery
        - Expiry date clearly printed on packaging
        - FIFO (First In First Out) inventory system
        - Immediate replacement if expired product received
        - Contact us immediately if you receive product near expiry`
    },
    {
      category: 'products',
      question: 'Can I get product recommendations?',
      answer: `Absolutely! Get personalized recommendations:
        - Chat with our wellness experts
        - Call us at +91 8400043322
        - Email your health goals to naturemedica09@gmail.com
        - Check our blog for wellness guides
        - Note: We provide guidance, not medical advice`
    },

    // Account
    {
      category: 'account',
      question: 'Do I need an account to place an order?',
      answer: `No, you can checkout as guest, but creating account has benefits:
        - Track orders easily
        - Save multiple addresses
        - Quick checkout process
        - Access order history
        - Exclusive member offers
        - Early access to new products`
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: `To reset your password:
        1. Go to login page
        2. Click "Forgot Password"
        3. Enter your registered email
        4. Check email for reset link
        5. Click link and create new password
        
        If you don't receive email, check spam folder or contact support`
    },
    {
      category: 'account',
      question: 'Can I change my registered email/phone?',
      answer: `Yes! Update your details:
        - Go to "My Profile" section
        - Click "Edit Profile"
        - Update email or phone number
        - Verify with OTP
        - Changes saved automatically
        
        For security, some changes may require additional verification`
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: `To delete your account:
        - Email us at naturemedica09@gmail.com
        - Subject: "Account Deletion Request"
        - Include registered email/phone
        - We'll process within 48 hours
        - Note: All order history and data will be permanently deleted
        - Pending orders must be completed/cancelled first`
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Frequently Asked Questions</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white p-6 text-center">
        <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-3">How Can We Help You?</h2>
        <p className="text-sm opacity-90">
          Find answers to commonly asked questions about our products and services
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#3a5d1e] shadow-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-[#3a5d1e] text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#3a5d1e]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredFaqs.length}</span> question{filteredFaqs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* FAQs List */}
      <div className="p-4 space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-sm text-gray-600 mb-4">
              Try different keywords or browse all categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-6 py-2 bg-[#3a5d1e] text-white rounded-lg font-medium hover:bg-[#2d4818]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            const CategoryIcon = categories.find(c => c.id === faq.category)?.icon || HelpCircle;

            return (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 pr-4">
                    <div className="w-8 h-8 bg-[#3a5d1e]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CategoryIcon className="w-4 h-4 text-[#3a5d1e]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                      {!isExpanded && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {faq.answer.substring(0, 80)}...
                        </p>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pl-16">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="p-4 mt-6">
        <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-xl p-6 text-white text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="font-bold text-lg mb-2">Still Have Questions?</h3>
          <p className="text-sm opacity-90 mb-4">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/contact')}
              className="w-full bg-white text-[#3a5d1e] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+918400043322"
                className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">Call Us</span>
              </a>
              <a
                href="mailto:naturemedica09@gmail.com"
                className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email Us</span>
              </a>
            </div>
          </div>
          
          <p className="text-xs opacity-75 mt-4">
            Response time: Within 24 hours • Mon-Sat: 9 AM - 6 PM IST
          </p>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
