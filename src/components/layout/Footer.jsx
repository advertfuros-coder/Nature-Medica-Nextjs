import Link from 'next/link';
import Image from 'next/image';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';
import logo from '@/assets/logo.webp';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
     

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Brand & Contact - Takes more space */}
          <div className="lg:col-span-5">
            <Image 
              src={logo} 
              alt="NatureMedica Logo" 
              width={200} 
              height={70}
              className="mb-4 sm:mb-5"
            />
            <p className="text-gray-600 mb-5 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Your trusted partner in natural health and wellness. Quality products delivered with care.
            </p>

            {/* Contact Cards */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 bg-[#415f2d] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-4 h-4 text-[#ffffff]" />
                </div>
                <div>
                  <p className="font-light text-gray-900 mb-1 text-sm sm:text-base">Visit Our Store</p>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    1st Floor, LHPS Building, Friends Colony, Sector-7,<br />
                    Kamla Nehru Nagar, Vikas Nagar,<br />
                    Lucknow, Uttar Pradesh 226022
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 bg-[#415f2d] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-4 h-4 text-[#ffffff]" />
                </div>
                <div>
                  <p className="font-light text-gray-900 mb-1 text-sm sm:text-base">Call Us</p>
                  <a href="tel:8400043322" className="text-sm sm:text-base font-light text-[#415f2d] hover:text-[#344b24]">
                    +91 8400043322
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 bg-[#415f2d] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-4 h-4 text-[#ffffff]" />
                </div>
                <div>
                  <p className="font-light text-gray-900 mb-1 text-sm sm:text-base">Email Us</p>
                  <a href="mailto:support@naturemedica.com" className="text-[#415f2d] hover:text-[#344b24] font-medium text-xs sm:text-sm">
                    support@naturemedica.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {/* Shop */}
              <div>
                <h4 className="font-light text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 border-b-2 border-[#415f2d] inline-block pb-2">
                  Shop
                </h4>
                <ul className="space-y-3 mt-3 sm:mt-4 text-xs sm:text-sm">
                  <li>
                    <Link href="/products" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>All Products</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=supplements" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Supplements</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=vitamins" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Vitamins</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=organic-foods" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Organic Foods</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-light text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 border-b-2 border-[#415f2d] inline-block pb-2">
                  Support
                </h4>
                <ul className="space-y-3 mt-3 sm:mt-4 text-xs sm:text-sm">
                  <li>
                    <Link href="/orders" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Track Order</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>About Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Contact Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>FAQ</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-light text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 border-b-2 border-[#415f2d] inline-block pb-2">
                  Legal
                </h4>
                <ul className="space-y-3 mt-3 sm:mt-4 text-xs sm:text-sm">
                  <li>
                    <Link href="/privacy" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Privacy Policy</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Terms & Conditions</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Refund Policy</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping" className="text-gray-600 hover:text-[#415f2d] transition-colors flex items-center gap-2 group">
                      <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>Shipping Policy</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Copyright */}
            <p className="text-gray-600 text-center md:text-left text-xs sm:text-sm">
              © {new Date().getFullYear()} <span className="font-light text-gray-900">NatureMedica</span>. All rights reserved.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium text-xs sm:text-sm">Follow Us:</span>
              <div className="flex gap-2">
                <a 
                  href="#" 
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#415f2d] hover:bg-[#415f2d] flex items-center justify-center transition-all group shadow-sm"
                  aria-label="Facebook"
                >
                  <FiFacebook className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#415f2d] hover:bg-[#415f2d] flex items-center justify-center transition-all group shadow-sm"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#415f2d] hover:bg-[#415f2d] flex items-center justify-center transition-all group shadow-sm"
                  aria-label="Twitter"
                >
                  <FiTwitter className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#415f2d] hover:bg-[#415f2d] flex items-center justify-center transition-all group shadow-sm"
                  aria-label="YouTube"
                >
                  <FiYoutube className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">Payment:</span>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-light text-gray-700">
                  UPI
                </div>
                <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-light text-gray-700">
                  Cards
                </div>
                <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-light text-gray-700">
                  COD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
