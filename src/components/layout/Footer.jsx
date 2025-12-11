'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail, FiArrowRight, FiSend } from 'react-icons/fi';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#2a3f1f] via-[#415f2d] to-[#2a3f1f] text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative">

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand & Contact - Takes more space */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <Image
                  src="/naturemedicalogo.png"
                  alt="NatureMedica Logo"
                  width={220}
                  height={80}
                  className="bg-white p-3 rounded-lg mb-4 hover:scale-105 sc0 transition-transform"
                />
                <p className="text-green-100 leading-relaxed text-sm md:text-base">
                  Your trusted partner in natural health and wellness. We bring you the finest quality products with care and dedication.
                </p>
              </div>

              {/* Contact Cards with Enhanced Design */}
              <div className="space-y-4">
                <a
                  href="https://maps.google.com/?q=1st+Floor,+LHPS+Building,+Friends+Colony,+Sector-7,+Kamla+Nehru+Nagar,+Vikas+Nagar,+Lucknow,+Uttar+Pradesh+226022"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/10 hover:border-green-300/30 transition-all hover:translate-x-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <FiMapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white mb-1">Visit Our Store</p>
                    <p className="text-sm text-green-100 leading-relaxed">
                      1st Floor, LHPS Building, Friends Colony, Sector-7,
                      Kamla Nehru Nagar, Vikas Nagar, Lucknow, Uttar Pradesh 226022
                    </p>
                  </div>
                </a>

                <a
                  href="tel:8400043322"
                  className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/10 hover:border-green-300/30 transition-all hover:translate-x-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <FiPhone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Call Us</p>
                    <p className="text-lg font-medium text-green-200 group-hover:text-white transition-colors">
                      +91 8400043322
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:support@naturemedica.com"
                  className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/10 hover:border-green-300/30 transition-all hover:translate-x-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <FiMail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Email Us</p>
                    <p className="text-green-200 group-hover:text-white transition-colors">
                      support@naturemedica.com
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links Grid - Enhanced Design */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-8">


                {/* Support */}
                <div>
                  <h4 className="font-bold text-white text-lg mb-4 relative inline-block">
                    Support
                    <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></span>
                  </h4>
                  <ul className="space-y-3 mt-6">
                    {[
                      { href: '/orders', label: 'Track Order' },
                      { href: '/about', label: 'About Us' },
                      { href: '/contact', label: 'Contact Us' },
                      { href: '/faq', label: 'FAQ' },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-green-100 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                          <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="font-bold text-white text-lg mb-4 relative inline-block">
                    Legal
                    <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></span>
                  </h4>
                  <ul className="space-y-3 mt-6">
                    {[
                      { href: '/privacy', label: 'Privacy Policy' },
                      { href: '/terms', label: 'Terms & Conditions' },
                      { href: '/refund', label: 'Refund Policy' },
                      { href: '/shipping', label: 'Shipping Policy' },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-green-100 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                          <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <p className="text-green-100 text-sm text-center md:text-left">
                © {new Date().getFullYear()} <span className="font-semibold text-white">Nature Medica</span>. All rights reserved.
              </p>

              {/* Social Media - Enhanced */}
              <div className="flex items-center gap-4">
                <span className="text-green-100 font-medium text-sm">Follow Us:</span>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61584706168474"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 flex items-center justify-center transition-all hover:scale-110 hover:rotate-6 group"
                    aria-label="Facebook"
                  >
                    <FiFacebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.instagram.com/nature_medica_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110 hover:rotate-6 group"
                    aria-label="Instagram"
                  >
                    <FiInstagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Payment Methods - Enhanced */}
              <div className="flex items-center gap-3">
                <span className="text-green-100 text-sm font-medium">We Accept:</span>
                <div className="flex gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:scale-105 transform">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png"
                      alt="UPI"
                      className="h-5 w-auto object-contain"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:scale-105 transform">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                      alt="Visa"
                      className="h-5 w-auto object-contain"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:scale-105 transform">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2897/2897832.png"
                      alt="Mastercard"
                      className="h-5 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
