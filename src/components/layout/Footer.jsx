import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">NatureMedica</h3>
            <p className="text-gray-400 mb-4">
              Your trusted source for natural health and wellness products.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products" className="hover:text-green-400">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=supplements" className="hover:text-green-400">
                  Supplements
                </Link>
              </li>
              <li>
                <Link href="/products?category=vitamins" className="hover:text-green-400">
                  Vitamins
                </Link>
              </li>
              <li>
                <Link href="/products?category=organic-foods" className="hover:text-green-400">
                  Organic Foods
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/orders" className="hover:text-green-400">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-green-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-green-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-green-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-green-400">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-green-400">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NatureMedica. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
