'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Package, Sparkles, ChevronDown, LogOut, User, Heart, Store } from 'lucide-react';
import { logout } from '@/store/slices/userSlice';
import { clearCart } from '@/store/slices/cartSlice';
import Image from 'next/image';
import logo from '@/assets/logor.webp';
import PromoStripSimple from '../customer/PromoStripSimple';
import NewsletterPopup from '../customer/NewsletterPopup';
import FranchiseModal from '../customer/FranchiseModal';
import { useWishlist } from '@/hooks/useWishlist';

export default function SearchFirstHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState({ products: [], brands: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const cartState = useSelector((state) => state.cart || { items: [] });
  const totalItems = cartState.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const userState = useSelector((state) => state.user || { user: null, isAuthenticated: false });
  const { user, isAuthenticated } = userState;

  // Get wishlist count
  const { wishlistCount } = useWishlist();

  const quickLinks = ['Cold Cream', 'Alovera Gel', 'Serum', "Facewash", "Sanitary", "Oral"];

  // Typing animation state
  const [placeholder, setPlaceholder] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = quickLinks[currentIndex];
    let timeout;

    if (!isDeleting && currentCharIndex <= currentWord.length) {
      timeout = setTimeout(() => {
        setPlaceholder(currentWord.substring(0, currentCharIndex));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 150);
    } else if (isDeleting && currentCharIndex >= 0) {
      timeout = setTimeout(() => {
        setPlaceholder(currentWord.substring(0, currentCharIndex));
        setCurrentCharIndex(currentCharIndex - 1);
      }, 100);
    } else if (currentCharIndex === currentWord.length + 1) {
      timeout = setTimeout(() => setIsDeleting(true), 1000);
    } else if (currentCharIndex === -1) {
      setIsDeleting(false);
      setCurrentIndex((currentIndex + 1) % quickLinks.length);
      setCurrentCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, currentIndex, quickLinks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions({ products: [], brands: [] });
        setShowSearchSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchSuggestions(data);
          setShowSearchSuggestions(true);
        }
      } catch (error) {
        console.error('Search suggestions error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchSuggestions(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (slug) => {
    setShowSearchSuggestions(false);
    setSearchQuery('');
    router.push(`/products/${slug}`);
  };

  const handleBrandClick = (brand) => {
    setShowSearchSuggestions(false);
    setSearchQuery(brand);
    router.push(`/products?search=${encodeURIComponent(brand)}`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(logout());
      dispatch(clearCart());
      setShowUserMenu(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get first name from user
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <PromoStripSimple />
      <div className="max-w-6xl mx-auto px-4 pb-2 -my-1">
        {/* Top Row */}
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src={logo} alt="Nature Medica" className="h-14  w-auto" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Take Franchise Button */}
            <button
              onClick={() => setIsFranchiseModalOpen(true)}
              className='flex items-center gap-1 px- 4 py-2 rounded-lg hover:bg-gray-100 transition-colors group'
             >
              <Store className="w-4 h-4 flex text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-700 group-hover:text-[#3a5d1e] tracking-tight"> Franchise</span>
            </button>

            {/* Orders Link */}
            <Link
              href="/orders"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Package className="w-5 h-5 text-gray-600 group-hover:text-[#3a5d1e]" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#3a5d1e]">Orders</span>
            </Link>

            {/* Wishlist Link */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="My Wishlist"
              >
                <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      {firstName}
                      <ChevronDown className="w-3 h-3" />
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute z-50 right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-slideDown">
                    {/* User Info */}
                    <div className="p-4 bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white">
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-xs opacity-90 mt-1">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 ">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">My Profile</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">My Orders</span>
                      </Link>

                      <div className="border-t border-gray-200 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-[#3a5d1e] text-white rounded-lg font-medium hover:bg-[#2d4818] transition-colors text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3a5d1e] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-gray-100 rounded-full px-6 py-2 hover:shadow-md transition-shadow focus-within:shadow-md focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3a5d1e]/20 text-sm">
              <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder={`Search for ${placeholder}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchSuggestions(true)}
                className="flex-1 bg-transparent focus:outline-none text-xs text-gray-900 placeholder:text-gray-500"
              />
              <button type="submit" className="ml-3 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-500 hover:text-yellow-600 transition-colors" />
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && (searchSuggestions.products.length > 0 || searchSuggestions.brands.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {/* Brand Suggestions */}
                {searchSuggestions.brands.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Brands</p>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.brands.map((brand, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleBrandClick(brand)}
                          className="px-3 py-1 bg-gray-100 hover:bg-[#3a5d1e]/10 text-sm rounded-full text-gray-700 hover:text-[#3a5d1e] transition-colors"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Suggestions */}
                {searchSuggestions.products.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Products</p>
                    {searchSuggestions.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.slug)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#3a5d1e]">₹{product.price}</p>
                          {product.mrp > product.price && (
                            <p className="text-xs text-gray-400 line-through">₹{product.mrp}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Searching...
                  </div>
                )}
              </div>
            )}

            {/* Quick Links */}

          </div>
        </form>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-t border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className="flex flex-col items-center justify-center flex-1 group">
            <div className="p-2">
              <Image src={logo} alt="Home" className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-gray-600 group-hover:text-[#3a5d1e]">Home</span>
          </Link>

          <Link href="/products" className="flex flex-col items-center justify-center flex-1 group">
            <Search className="w-5 h-5 text-gray-600 group-hover:text-[#3a5d1e]" />
            <span className="text-[10px] text-gray-600 group-hover:text-[#3a5d1e] mt-1">Search</span>
          </Link>

          {/* Wishlist (Mobile) */}
          {isAuthenticated && (
            <Link href="/wishlist" className="flex flex-col items-center justify-center flex-1 group relative">
              <Heart className="w-5 h-5 text-gray-600 group-hover:text-[#3a5d1e]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-1/4 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] text-gray-600 group-hover:text-[#3a5d1e] mt-1">Wishlist</span>
            </Link>
          )}

          <Link href="/orders" className="flex flex-col items-center justify-center flex-1 group">
            <Package className="w-5 h-5 text-gray-600 group-hover:text-[#3a5d1e]" />
            <span className="text-[10px] text-gray-600 group-hover:text-[#3a5d1e] mt-1">Orders</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center justify-center flex-1 group relative">
            <ShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-[#3a5d1e]" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-1/4 bg-[#3a5d1e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="text-[10px] text-gray-600 group-hover:text-[#3a5d1e] mt-1">Cart</span>
          </Link>

          {isAuthenticated && user ? (
            <Link href="/profile" className="flex flex-col items-center justify-center flex-1 group">
              <div className="w-6 h-6 bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-full flex items-center justify-center text-white font-semibold text-[10px]">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <span className="text-[10px] text-gray-600 group-hover:text-[#3a5d1e] mt-1">{firstName}</span>
            </Link>
          ) : (
            <Link href="/auth" className="flex flex-col items-center justify-center flex-1 group">
              <User className="w-5 h-5 text-gray-600 group-hover:text-[#3a5d1e]" />
              <span className="text-[10px] text-gray-600 group-hover:text-[#3a5d1e] mt-1">Account</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <FranchiseModal
        isOpen={isFranchiseModalOpen}
        onClose={() => setIsFranchiseModalOpen(false)}
      />
    </header>
  );
}
