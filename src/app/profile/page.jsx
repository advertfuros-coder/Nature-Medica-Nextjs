'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Edit,
  Mail,
  Phone,
  Shield,
  CreditCard,
  Gift,
  Star,
  MessageCircle,
  Share2,
  FileText
} from 'lucide-react';
import { logout } from '@/store/slices/userSlice';
import { clearCart } from '@/store/slices/cartSlice';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user || { user: null, isAuthenticated: false });
  const { user, isAuthenticated } = userState;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Redirect if not authenticated (client-side only)
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth');
    }
  }, [isAuthenticated, user, router]);

  // Don't render until we've checked authentication
  if (!isAuthenticated || !user) {
    return null;
  }

  const firstName = user?.name?.split(' ')[0] || 'User';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(logout());
      dispatch(clearCart());
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Menu sections
  const accountSection = [
    { icon: Package, label: 'My Orders', href: '/orders', badge: null },
    // { icon: MapPin, label: 'Addresses', href: '/addresses', badge: user?.addresses?.length || 0 },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', badge: null },
    { icon: CreditCard, label: 'Payment Methods', href: '/payment-methods', badge: null },
  ];

  const appSection = [
    { icon: Bell, label: 'Notifications', href: '/notifications', badge: '2' },
    { icon: Gift, label: 'Offers & Rewards', href: '/offers', badge: null },
    { icon: Star, label: 'Rate Us', href: '#', badge: null },
    { icon: Share2, label: 'Share App', href: '#', badge: null },
  ];

  const supportSection = [
    { icon: HelpCircle, label: 'Help Center', href: '/help', badge: null },
    { icon: MessageCircle, label: 'Contact Us', href: '/contact', badge: null },
    { icon: FileText, label: 'Terms & Conditions', href: '/terms', badge: null },
    { icon: Shield, label: 'Privacy Policy', href: '/privacy', badge: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with User Info */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">My Account</h1>
          <button
            onClick={() => router.push('/profile/edit')}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#3a5d1e] font-bold text-2xl flex-shrink-0 shadow-lg">
            {firstName.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold mb-1 truncate">{user.name}</h2>
            <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Phone className="w-3 h-3" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white mt-3 mb-3">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {accountSection.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-[#3a5d1e] text-white text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Features Section */}
      <div className="bg-white mb-3">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">App Features</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {appSection.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => item.href !== '#' && router.push(item.href)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white mb-3">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Support</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {supportSection.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mb-6">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors border-2 border-red-100"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-sm font-semibold text-red-600">Sign Out</span>
        </button>
      </div>

      {/* App Info */}
      <div className="px-4 py-6 text-center text-xs text-gray-500">
        <p className="mb-1">Nature Medica</p>
        <p>Version 1.0.0</p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-slideUp">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Sign Out?</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to sign out from your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
