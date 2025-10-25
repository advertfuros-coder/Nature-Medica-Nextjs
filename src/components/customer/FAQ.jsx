'use client';

import { useState } from 'react';
import { 
  FiChevronDown, 
  FiHelpCircle, 
  FiCreditCard, 
  FiTruck, 
  FiRefreshCw,
  FiShield,
  FiGift,
  FiPackage,
  FiAlertCircle,
  FiPhone,
  FiUsers,
  FiClock
} from 'react-icons/fi';

const faqsWithIcons = [
  {
    icon: FiCreditCard,
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment options including Credit/Debit Cards, UPI, Net Banking, and Wallets through our secure Razorpay payment gateway. We also offer Cash on Delivery (COD) for select locations."
  },
  {
    icon: FiTruck,
    question: "How long does shipping take?",
    answer: "We typically process orders within 24-48 hours. Standard delivery takes 3-5 business days, while express shipping is available in 1-2 business days for metro cities. You'll receive tracking information once your order is shipped."
  },
  {
    icon: FiRefreshCw,
    question: "What is your return and refund policy?",
    answer: "We offer a 7-day return policy for unopened products. If you receive a damaged or incorrect item, please contact us within 48 hours of delivery. Refunds are processed within 5-7 business days after we receive the returned product."
  },
  {
    icon: FiShield,
    question: "Are your products certified and safe?",
    answer: "Yes, all our products are 100% natural, lab-tested, and certified by relevant authorities. We ensure the highest quality standards and follow strict manufacturing practices."
  },
  {
    icon: FiGift,
    question: "Do you offer free shipping?",
    answer: "Yes! We offer free shipping on all orders above ₹499. For orders below this amount, a nominal shipping fee of ₹50 applies."
  },
  {
    icon: FiPackage,
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the 'My Orders' section."
  },
  {
    icon: FiAlertCircle,
    question: "Are there any side effects to your products?",
    answer: "Our products are made from natural ingredients and are generally safe. However, we recommend consulting with a healthcare professional before starting any new supplement."
  },
  {
    icon: FiClock,
    question: "Can I cancel or modify my order?",
    answer: "You can cancel or modify your order within 2 hours of placing it by contacting our customer support."
  },
  {
    icon: FiGift,
    question: "Do you offer discounts or coupons?",
    answer: "Yes! We regularly offer promotional discounts and exclusive coupon codes. First-time customers get 10% off with code WELCOME10."
  },
  {
    icon: FiPhone,
    question: "How do I contact customer support?",
    answer: "You can reach us via email at support@naturemedica.com or call us at +91-XXXXXXXXXX (Mon-Sat, 9 AM - 6 PM IST)."
  }
];

export default function FAQStyled() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {faqsWithIcons.map((faq, index) => {
          const Icon = faq.icon;
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                isOpen ? 'shadow-xl ring-2 ring-green-500' : 'hover:shadow-lg'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-5 flex items-start gap-4 text-left focus:outline-none"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isOpen ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {faq.question}
                  </h3>
                  
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen
                        ? 'max-h-96 opacity-100 mt-2'
                        : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                <FiChevronDown
                  className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
