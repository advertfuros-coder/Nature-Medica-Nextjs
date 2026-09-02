'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Package,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Heart,
  Store,
  Menu,
  X,
  ChevronRight,
  Flame,
  Tag,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  PhoneCall,
  Grid,
} from 'lucide-react';
import { logout } from '@/store/slices/userSlice';
import { clearCart } from '@/store/slices/cartSlice';
import Image from 'next/image';
import logo from '@/assets/logor.webp';
import PromoStripSimple from '../customer/PromoStripSimple';
import FranchiseModal from '../customer/FranchiseModal';
import { useWishlist } from '@/hooks/useWishlist';

export default function SearchFirstHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState({ products: [], brands: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const menuRef = useRef(null);
  const shopDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const cartState = useSelector((state) => state.cart || { items: [] });
  const totalItems = cartState.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const userState = useSelector((state) => state.user || { user: null, isAuthenticated: false });
  const { user, isAuthenticated } = userState;

  const { wishlistCount } = useWishlist();

  const quickSearchWords = [
    'Kumkumadi Oil',
    'Aloe Vera Gel',
    'Vitamin C Serum',
    'Herbal Face Wash',
    'Cold Cream',
    'Rose Water',
    'Neem Soap',
  ];

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Handle body scroll lock on mobile drawer & search drawer
  useEffect(() => {
    if (isMobileMenuOpen || isSearchDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isSearchDrawerOpen]);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isSearchDrawerOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isSearchDrawerOpen]);

  // Typing animation state for search placeholder
  const [placeholder, setPlaceholder] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = quickSearchWords[currentIndex];
    let timeout;

    if (!isDeleting && currentCharIndex <= currentWord.length) {
      timeout = setTimeout(() => {
        setPlaceholder(currentWord.substring(0, currentCharIndex));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 120);
    } else if (isDeleting && currentCharIndex >= 0) {
      timeout = setTimeout(() => {
        setPlaceholder(currentWord.substring(0, currentCharIndex));
        setCurrentCharIndex(currentCharIndex - 1);
      }, 60);
    } else if (currentCharIndex === currentWord.length + 1) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (currentCharIndex === -1) {
      setIsDeleting(false);
      setCurrentIndex((currentIndex + 1) % quickSearchWords.length);
      setCurrentCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, currentIndex, quickSearchWords]);

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setShowShopDropdown(false);
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
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchSuggestions({
            products: Array.isArray(data.products) ? data.products : [],
            brands: Array.isArray(data.brands) ? data.brands : [],
          });
        }
      } catch (error) {
        console.error('Search suggestions error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchDrawerOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (slug) => {
    setIsSearchDrawerOpen(false);
    setSearchQuery('');
    router.push(`/products/${slug}`);
  };

  const handleBrandClick = (brand) => {
    setIsSearchDrawerOpen(false);
    setSearchQuery(brand);
    router.push(`/products?search=${encodeURIComponent(brand)}`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(logout());
      dispatch(clearCart());
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header className="sticky top-0 bg-white   z-50 transition-all duration-300">
      {/* Top Pastel Announcement Bar (D'you Style in Sage Palette) */}
      <PromoStripSimple />

      {/* Main Header Container */}
      <div className="max-wxl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* =========================================
              LEFT: Brand Logo & Mobile Hamburger
             ========================================= */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-gray-700 hover:text-[#2d4e24] hover:bg-[#eef5ec] active:scale-95 transition-all"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <Link href="/" className="flex items-center group transition-transform duration-200 hover:scale-[1.01]">
              <Image
                src={logo}
                alt="Nature Medica"
                priority
                className="h-9 sm:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* =========================================
              CENTER: Navigation Links (D'you Uppercase Style)
             ========================================= */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {/* SHOP + Dropdown */}
            <div
              className="relative"
              ref={shopDropdownRef}
              onMouseEnter={() => setShowShopDropdown(true)}
              onMouseLeave={() => setShowShopDropdown(false)}
            >
              <Link
                href="/products"
                className={`flex items-center gap-1 text-[13px] font-bold tracking-widest uppercase transition-colors py-2 ${
                  pathname?.startsWith('/products') ? 'text-[#2d4e24]' : 'text-gray-800 hover:text-[#2d4e24]'
                }`}
              >
                <span>SHOP +</span>
              </Link>

              {/* Shop Mega Dropdown */}
              {showShopDropdown && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <Link
                      href="/products"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eef5ec] text-gray-800 hover:text-[#2d4e24] text-xs font-bold transition-colors group"
                      onClick={() => setShowShopDropdown(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Grid className="w-3.5 h-3.5 text-[#2d4e24]" />
                        All Products
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href="/products?sort=bestseller"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eef5ec] text-gray-800 hover:text-[#2d4e24] text-xs font-bold transition-colors group"
                      onClick={() => setShowShopDropdown(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        Bestsellers
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1">Categories</p>

                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/products?category=${category._id}`}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eef5ec] text-gray-700 hover:text-[#2d4e24] text-xs font-semibold transition-colors group"
                        onClick={() => setShowShopDropdown(false)}
                      >
                        <span>{category.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`text-[13px] font-bold tracking-widest uppercase transition-colors ${
                pathname === '/about' ? 'text-[#2d4e24]' : 'text-gray-800 hover:text-[#2d4e24]'
              }`}
            >
              ABOUT US
            </Link>

            <button
              onClick={() => setIsFranchiseModalOpen(true)}
              className="text-[13px] font-bold tracking-widest uppercase text-gray-800 hover:text-[#2d4e24] transition-colors cursor-pointer"
            >
              FRANCHISE
            </button>

            <Link
              href="/faq"
              className={`text-[13px] font-bold tracking-widest uppercase transition-colors ${
                pathname === '/faq' ? 'text-[#2d4e24]' : 'text-gray-800 hover:text-[#2d4e24]'
              }`}
            >
              FAQS
            </Link>

            <Link
              href="/contact"
              className={`text-[13px] font-bold tracking-widest uppercase transition-colors ${
                pathname === '/contact' ? 'text-[#2d4e24]' : 'text-gray-800 hover:text-[#2d4e24]'
              }`}
            >
              CONTACT
            </Link>
          </nav>

          {/* =========================================
              RIGHT: Currency, Search, Profile, Cart
             ========================================= */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency Indicator (D'you style: INR ▾) */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-gray-700 px-2 py-1 rounded-md hover:bg-gray-50 cursor-default">
              <span>INR</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>

            {/* Search Icon Button (Opens Slide-out Drawer) */}
            <button
              onClick={() => setIsSearchDrawerOpen(true)}
              className="p-2 rounded-full text-gray-800 hover:text-[#2d4e24] hover:bg-[#eef5ec] transition-all cursor-pointer group"
              title="Search products"
              aria-label="Search"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* User Profile / Sign In */}
            <div className="relative" ref={menuRef}>
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-full text-gray-800 hover:text-[#2d4e24] hover:bg-[#eef5ec] transition-all cursor-pointer group"
                    title={user.name}
                    aria-label="Account"
                  >
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-4 bg-[#2d4e24] text-white">
                        <p className="font-bold text-sm truncate">{user.name}</p>
                        <p className="text-[11px] text-emerald-100/80 truncate">{user.email}</p>
                      </div>

                      <div className="py-2 px-1 text-xs font-semibold">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-[#eef5ec] text-gray-700 hover:text-[#2d4e24] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-[#eef5ec] text-gray-700 hover:text-[#2d4e24] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-4 h-4 text-gray-400" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          href="/wishlist"
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-[#eef5ec] text-gray-700 hover:text-[#2d4e24] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span>My Wishlist</span>
                        </Link>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-bold w-full text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/auth"
                  className="p-2 rounded-full text-gray-800 hover:text-[#2d4e24] hover:bg-[#eef5ec] transition-all inline-block group"
                  title="Sign In / Register"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              )}
            </div>

            {/* Shopping Bag / Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-gray-800 hover:text-[#2d4e24] hover:bg-[#eef5ec] transition-all group flex items-center justify-center cursor-pointer"
              title="Shopping Bag"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#2d4e24] text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center ring-2 ring-white shadow-xs">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>


      {/* =========================================
          SLIDE-OUT SEARCH DRAWER (Matching Image 2)
         ========================================= */}
      <div
        className={`fixed inset-0 z-[120] transition-all duration-300 ${
          isSearchDrawerOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
            isSearchDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsSearchDrawerOpen(false)}
        />

        {/* Slide-out Panel from Right (Rounded Left Corners) */}
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[440px] md:w-[480px] bg-white sm:rounded-l-3xl shadow-2xl flex flex-col p-6 sm:p-8 transform transition-transform duration-300 ease-out ${
            isSearchDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Top Search Input & Close Circle Button */}
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search for ${placeholder}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full text-lg sm:text-xl font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Circular Close Button (Exact D'you reference style) */}
            <button
              onClick={() => setIsSearchDrawerOpen(false)}
              className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all flex-shrink-0 cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body (Trending / Results) */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-6 space-y-6">
            
            {/* Quick Suggestions / Popular Tags */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSearchWords.map((keyword, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(keyword);
                      setIsSearchDrawerOpen(false);
                      router.push(`/products?search=${encodeURIComponent(keyword)}`);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-[#eef5ec] hover:text-[#2d4e24] border border-transparent hover:border-[#b9d3ad] text-xs font-semibold text-gray-700 transition-all"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Matching Products Autocomplete */}
            {searchQuery.trim().length >= 2 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Matching Products
                </p>

                {isSearching ? (
                  <div className="py-8 text-center text-xs font-semibold text-gray-400 flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#2d4e24] border-t-transparent rounded-full animate-spin" />
                    <span>Searching products...</span>
                  </div>
                ) : searchSuggestions.products?.length > 0 ? (
                  <div className="space-y-2">
                    {searchSuggestions.products.map((product) => (
                      <button
                        key={product.id || product._id || product.slug}
                        type="button"
                        onClick={() => handleSuggestionClick(product.slug)}
                        className="w-full flex items-center gap-3.5 p-2.5 hover:bg-[#eef5ec] rounded-2xl transition-all text-left group"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-14 h-14 object-cover rounded-xl border border-gray-100 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-[#2d4e24] truncate transition-colors">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            {product.brand || 'Nature Medica'}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-[#2d4e24]">₹{product.price}</p>
                          {product.mrp > product.price && (
                            <p className="text-xs text-gray-400 line-through">₹{product.mrp}</p>
                          )}
                        </div>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full mt-4 py-3 bg-[#2d4e24] hover:bg-[#223d1b] text-white font-bold text-xs rounded-full shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                      <span>View All Results For &ldquo;{searchQuery}&rdquo;</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-gray-500">
                    No products found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* =========================================
          MOBILE DRAWER NAVIGATION (Slide-in)
         ========================================= */}
      <div
        className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`relative w-[85%] sm:w-[360px] h-full bg-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Top */}
          <div className="p-4 bg-[#2d4e24] text-white flex items-center justify-between">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="bg-white/95 p-1 px-2.5 rounded-xl">
              <Image src={logo} alt="Nature Medica" className="h-8 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
            {/* User Greeting */}
            {isAuthenticated && user ? (
              <div className="p-3.5 bg-[#eef5ec] rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2d4e24] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Welcome,</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#2d4e24] text-white py-3 rounded-xl font-bold text-xs shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
            )}

            {/* Nav Links */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Navigation</p>
              
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eef5ec] text-gray-800 font-bold text-xs"
              >
                <span>SHOP ALL</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eef5ec] text-gray-700 font-medium text-xs"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsFranchiseModalOpen(true);
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eef5ec] text-[#2d4e24] font-bold text-xs w-full text-left"
              >
                <span>FRANCHISE INQUIRY</span>
                <Store className="w-4 h-4 text-[#2d4e24]" />
              </button>

              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eef5ec] text-gray-800 font-bold text-xs"
              >
                <span>ABOUT US</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eef5ec] text-gray-800 font-bold text-xs"
              >
                <span>FAQS</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eef5ec] text-gray-800 font-bold text-xs"
              >
                <span>CONTACT US</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Nature Medica • Ayurvedic Wellness</p>
          </div>
        </div>
      </div>

      {/* Franchise Modal */}
      <FranchiseModal
        isOpen={isFranchiseModalOpen}
        onClose={() => setIsFranchiseModalOpen(false)}
      />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5">
        <div className="flex justify-around items-center h-12">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === '/' ? 'text-[#2d4e24] font-bold' : 'text-gray-500'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Image src={logo} alt="Home" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          <Link
            href="/products"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === '/products' ? 'text-[#2d4e24] font-bold' : 'text-gray-500'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Shop</span>
          </Link>

          <button
            onClick={() => setIsSearchDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500"
          >
            <Search className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Search</span>
          </button>

          <Link
            href="/wishlist"
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
              pathname === '/wishlist' ? 'text-[#2d4e24] font-bold' : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Wishlist</span>
          </Link>

          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
              pathname === '/cart' ? 'text-[#2d4e24] font-bold' : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#2d4e24] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Cart</span>
          </Link>
        </div>
      </nav>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
}

