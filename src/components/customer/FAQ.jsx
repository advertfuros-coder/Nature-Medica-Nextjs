'use client';

import { useState } from 'react';
import { 
  ChevronRight, 
  CreditCard, 
  Truck, 
  RefreshCw,
  Shield,
  Gift,
  Package,
  AlertCircle,
  Phone,
  Clock
} from 'lucide-react';

const faqs = [
  {
    icon: CreditCard,
    question: "What payment methods do you accept?",
    answer: "We accept Credit/Debit Cards, UPI, Net Banking, Wallets, and Cash on Delivery (COD).",
  },
  {
    icon: Truck,
    question: "How long does shipping take?",
    answer: "Standard delivery: 3-5 days. Express shipping: 1-2 days for metro cities.",
  },
  {
    icon: RefreshCw,
    question: "What is your return policy?",
    answer: "7-day return policy for unopened products. Contact within 48 hours for damaged items.",
  },
  {
    icon: Shield,
    question: "Are products certified?",
    answer: "Yes, all products are 100% natural, lab-tested, and certified.",
  },
  {
    icon: Gift,
    question: "Do you offer free shipping?",
    answer: "Yes! Free shipping on orders above ₹499.",
  },
  {
    icon: Package,
    question: "How to track my order?",
    answer: "Tracking number sent via email/SMS. Check 'My Orders' section.",
  },
  {
    icon: AlertCircle,
    question: "Any side effects?",
    answer: "Natural ingredients, generally safe. Consult doctor before use.",
  },
  {
    icon: Clock,
    question: "Can I cancel my order?",
    answer: "Cancel within 2 hours by contacting support.",
  },
  {
    icon: Gift,
    question: "Any discounts available?",
    answer: "Yes! First-time customers get 10% off with code WELCOME10.",
  },
  {
    icon: Phone,
    question: "How to contact support?",
    answer: "Email: support@naturemedica.com or call +91-XXXXXXXXXX.",
  }
];

export default function FAQCompactList() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-8 bg-[#FFFDF7]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">
            Frequently Asked Questions
          </h2>
          <p className="text-[10px] text-gray-500">Find quick answers below</p>
        </div>

        <div className="space-y-1">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-lg transition-all duration-300 ${
                  isOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-2.5 flex items-center gap-3 text-left"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${
                    isOpen ? 'bg-[#415f2d]/10' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-3 h-3 ${
                      isOpen ? 'text-[#415f2d]' : 'text-gray-600'
                    }`} />
                  </div>

                  <span className="flex-1 text-[11px] font-medium text-gray-900">
                    {faq.question}
                  </span>

                  <ChevronRight
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-90 text-[#415f2d]' : ''
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 pb-2.5' : 'max-h-0'
                  }`}
                >
                  <p className="text-[10px] text-gray-600 leading-relaxed px-2.5 pl-11">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
