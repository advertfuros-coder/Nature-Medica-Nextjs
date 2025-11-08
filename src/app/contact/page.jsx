'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Send,
  Clock,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();
  const user = useSelector((state) => state.user?.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        // Reset form
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          subject: '',
          message: ''
        });
        // Redirect after 2 seconds
        setTimeout(() => router.push('/'), 2000);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 8400043322',
      link: 'tel:+918400043322',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'naturemedica09@gmail.com',
      link: 'mailto:naturemedica09@gmail.com',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Lucknow, Uttar Pradesh 226022',
      link: 'https://maps.google.com/?q=Lucknow+226022',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon - Sat: 9 AM - 6 PM',
      link: null,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-slideUp">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-[#3a5d1e] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4818]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Contact Us</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white p-6 text-center">
        <MessageCircle className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">We're Here to Help</h2>
        <p className="text-sm opacity-90">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Get In Touch
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <a
                key={index}
                href={info.link || '#'}
                target={info.link ? '_blank' : undefined}
                rel={info.link ? 'noopener noreferrer' : undefined}
                className={`bg-white rounded-xl p-4 ${info.link ? 'hover:shadow-md' : ''} transition-shadow`}
              >
                <div className={`w-10 h-10 ${info.color} rounded-full flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">{info.title}</h4>
                <p className="text-sm font-semibold text-gray-900 break-words">{info.value}</p>
              </a>
            );
          })}
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Send us a Message</h3>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] border border-gray-200"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] border border-gray-200"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] border border-gray-200"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] border border-gray-200"
                required
              >
                <option value="">Select a subject</option>
                <option value="order">Order Issue</option>
                <option value="product">Product Inquiry</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="return">Return & Refund</option>
                <option value="payment">Payment Issue</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] border border-gray-200 resize-none"
                rows="5"
                placeholder="Tell us how we can help you..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3a5d1e] text-white py-4 rounded-lg font-semibold hover:bg-[#2d4818] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Need Quick Answers?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Check our Help Center for instant answers to common questions.
          </p>
          <button
            onClick={() => router.push('/help')}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Visit Help Center
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
