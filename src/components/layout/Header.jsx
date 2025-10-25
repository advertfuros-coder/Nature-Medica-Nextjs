'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  UserCircle2, 
  Search, 
  LogOut, 
  Package2, 
  Heart,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Clock,
  Home,
  Pill,
  Apple,
  Flame
} from 'lucide-react';
import { clearUser } from '@/store/slices/userSlice';
import { clearCart } from '@/store/slices/cartSlice';
import logo from '@/assets/logor.webp';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { totalItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(clearUser());
      dispatch(clearCart());
      setShowUserMenu(false);
      setShowMobileMenu(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const categories = [
    { name: 'Shop All', href: '/products', icon: Home },
    { name: 'Supplements', href: '/products?category=supplements', icon: Pill },
    { name: 'Vitamins', href: '/products?category=vitamins', icon: Apple },
    { name: 'Organic Foods', href: '/products?category=organic-foods', icon: Apple, badge: 'New' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      
      {/* Main Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center  justify-between  gap-2 sm:gap-4 lg:gap-6">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
              <Image src={logo} alt="Nature Medica" className="h-12 sm:h-16 lg:h-20 w-auto" />
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-3xl">
              <div className="relative w-full group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#415F2D] transition-colors" />
                <input
                  type="text"
                  placeholder="Search for natural health products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#415F2D] focus:ring-4 focus:ring-[#415F2D] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#415F2D] text-white px-6 py-2 rounded-lg hover:bg-[#415F2D] transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Icon - Mobile/Tablet */}
              <button 
                onClick={() => setShowMobileSearch(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
                aria-label="Search"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>

              {/* Wishlist - Hidden on Mobile */}
              <button className="hidden md:flex flex-col items-center p-2 hover:bg-gray-50 rounded-xl transition-colors group">
                <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
                <span className="hidden lg:block text-xs text-gray-600 mt-0.5">Wishlist</span>
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative flex flex-col items-center p-2 hover:bg-gray-50 rounded-xl transition-colors group active:scale-95">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#415F2D] transition-colors" />
                <span className="hidden lg:block text-xs text-gray-600 mt-0.5">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200 active:scale-95"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-400 via-[#415F2D] to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name?.split(' ')[0]}</p>
                      <p className="text-xs text-gray-500">My Account</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform hidden md:block ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                      <div className="bg-gradient-to-r from-[#415F2D] to-emerald-600 px-4 sm:px-5 py-3 sm:py-4 text-white">
                        <p className="font-bold text-base sm:text-lg truncate">{user?.name}</p>
                        <p className="text-xs sm:text-sm text-[#415F2D]opacity-90 truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">My Orders</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">Wishlist</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-red-50 w-full text-left transition-colors text-red-600 font-medium active:bg-red-100"
                        >
                          <LogOut className="w-5 h-5 flex-shrink-0" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#415F2D] to-emerald-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl hover:from-[#415F2D] hover:to-emerald-700 transition-all font-semibold shadow-md hover:shadow-lg text-sm sm:text-base active:scale-95"
                >
                  <UserCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="bg-white border-t border-gray-100 hidden lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-10 py-4">
            <li>
              <Link 
                href="/" 
                className="text-gray-700 hover:text-[#415F2D] font-semibold transition-colors relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#415F2D] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.name}>
                <Link 
                  href={category.href} 
                  className="text-gray-700 hover:text-[#415F2D] font-semibold transition-colors relative group flex items-center gap-2"
                >
                  {category.name}
                  {category.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {category.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#415F2D] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
            <li>
             
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-fadeIn" onClick={() => setShowMobileSearch(false)}>
          <div className="bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-gray-800 flex-1">Search Products</h3>
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close search"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#415F2D] focus:ring-4 focus:ring-[#415F2D] text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#415F2D] text-white px-5 py-2 rounded-lg hover:bg-[#415F2D] transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-fadeIn" onClick={() => setShowMobileMenu(false)}>
          {/* Mobile Menu Sidebar */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl animate-slideInLeft overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="bg-gradient-to-r from-[#415F2D] to-emerald-600 p-5">
              <div className="flex items-center justify-between mb-4">
                <Image src={logo} alt="Nature Medica" className="h-10 w-auto" />
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#415F2D] font-bold text-lg shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-base truncate">{user?.name}</p>
                    <p className="text-sm text-[#415F2D]truncate">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center gap-2 bg-white text-[#415F2D] px-6 py-3 rounded-xl hover:bg-[#415F2D]transition-colors font-bold shadow-md w-full"
                >
                  <UserCircle2 className="w-5 h-5" />
                  Sign In / Register
                </Link>
              )}
            </div>

            {/* Menu Navigation */}
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-[#415F2D]text-gray-700 hover:text-[#415F2D] font-semibold transition-colors active:bg-[#415F2D]"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Home className="w-5 h-5 flex-shrink-0" />
                    <span>Home</span>
                  </Link>
                </li>
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <li key={category.name}>
                      <Link 
                        href={category.href} 
                        className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-[#415F2D]text-gray-700 hover:text-[#415F2D] font-semibold transition-colors active:bg-[#415F2D]"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 flex-shrink-0" />
                          <span>{category.name}</span>
                        </div>
                        {category.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {category.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
                <li>
                 
                </li>
              </ul>

              {/* User Actions */}
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 px-4">My Account</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors active:bg-gray-100"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Package2 className="w-5 h-5 flex-shrink-0 text-gray-600" />
                        <span>My Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors active:bg-gray-100"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Heart className="w-5 h-5 flex-shrink-0 text-gray-600" />
                        <span>Wishlist</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-red-50 w-full text-left text-red-600 font-medium transition-colors active:bg-red-100"
                      >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 px-4 space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Contact Us</h3>
                <a href="tel:18001234567" className="flex items-center gap-3 text-gray-600 hover:text-[#415F2D] transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">1800-123-4567</span>
                </a>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Mon-Sat: 9AM - 9PM</span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
