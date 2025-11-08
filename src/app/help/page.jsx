'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I track my order?',
      answer: 'You can track your order by going to My Orders section and clicking on the order you want to track. You\'ll see real-time tracking information there.'
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for most products. Items must be unused and in original packaging. Shipping charges are non-refundable.'
    },
    {
      id: 3,
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days. Express delivery is available for select locations and takes 1-2 business days.'
    },
    {
      id: 4,
      question: 'Do you offer Cash on Delivery?',
      answer: 'Yes, Cash on Delivery (COD) is available for orders up to ₹50,000. Additional COD charges may apply.'
    },
    {
      id: 5,
      question: 'How can I cancel my order?',
      answer: 'You can cancel your order from the My Orders section before it\'s shipped. Once shipped, cancellation is not possible, but you can return the product.'
    },
    {
      id: 6,
      question: 'Are the products authentic?',
      answer: 'Yes, all our products are 100% authentic and sourced directly from authorized distributors and manufacturers.'
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Help Center</h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="px-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Frequently Asked Questions
        </h2>

        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
              {expandedFaq === faq.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {expandedFaq === faq.id && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support Button */}
      <div className="p-4 mt-6">
        <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-xl p-6 text-white text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Still need help?</h3>
          <p className="text-sm opacity-90 mb-4">Our support team is here to assist you</p>
          <button
            onClick={() => router.push('/contact')}
            className="w-full bg-white text-[#3a5d1e] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
