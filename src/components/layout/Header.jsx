'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  MapPin,
  Home,
  Pill,
  Apple
} from 'lucide-react';
import { logout } from '@/store/slices/userSlice'; // Changed from clearUser
import { clearCart } from '@/store/slices/cartSlice';
import logo from '@/assets/logor.webp';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  // Safe Redux selectors with defaults
  const cartState = useSelector((state) => state.cart || { items: [], total: 0 });
  const totalItems = cartState.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  const userState = useSelector((state) => state.user || { user: null, isAuthenticated: false });
  const { user = null, isAuthenticated = false } = userState;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(logout()); // Use logout instead of clearUser
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
    { name: 'Beauty & Personal Care', href: '/products?category=supplements', icon: Pill },
    { name: 'Supplements', href: '/products?category=supplements', icon: Pill },
    { name: 'Vitamins', href: '/products?category=vitamins', icon: Apple },
    { name: 'Organic Foods', href: '/products?category=organic-foods', icon: Apple },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Desktop View - Amazon Style */}
      <div className="hidden lg:block">
        {/* Main Header - Light Background */}
        <div className="bg-white shadow-sm">
          <div className="max-w-[1500px] mx-auto px-4">
            <div className="flex items-center gap-5 py-2">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 border border-transparent hover:border-gray-300 rounded px-2 py-1 transition-colors">
                <Image src={logo} alt="Nature Medica" className="h-10 w-auto" />
              </Link>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
                <div className="flex items-center bg-white rounded-lg overflow-hidden border-2 border-gray-300 focus-within:border-[#3a5d1e]">
                  <select className="bg-gray-100 border-none px-3 py-2.5 text-sm text-gray-700 focus:outline-none hover:bg-gray-200 cursor-pointer">
                    <option>All</option>
                    <option>Supplements</option>
                    <option>Vitamins</option>
                    <option>Organic Foods</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search NatureMedica"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm text-gray-900 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#3a5d1e] px-6 py-2.5 hover:bg-[#2d4818] transition-colors"
                  >
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </div>
              </form>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Account & Lists */}
                {isAuthenticated && user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="text-gray-900 border border-transparent hover:border-gray-300 rounded px-2 py-1 transition-colors"
                    >
                      <p className="text-xs text-gray-600">Hello, {user.name?.split(' ')[0] || 'User'}</p>
                      <p className="font-bold text-sm flex items-center gap-1">
                        Account & Lists
                        <ChevronDown className="w-3 h-3" />
                      </p>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b">
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setShowUserMenu(false)}>
                            Your Orders
                          </Link>
                          {/* <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setShowUserMenu(false)}>
                            Your Wish List
                          </Link> */}
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth" className="text-gray-900 border border-transparent hover:border-gray-300 rounded px-2 py-1 transition-colors">
                    <p className="text-xs text-gray-600">Hello, sign in</p>
                    <p className="font-bold text-sm">Account & Lists</p>
                  </Link>
                )}

                {/* Returns & Orders */}
                <Link href="/orders" className="text-gray-900 border border-transparent hover:border-gray-300 rounded px-2 py-1 transition-colors">
                  <p className="text-xs text-gray-600">Returns</p>
                  <p className="font-bold text-sm">& Orders</p>
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative text-gray-900 border border-transparent hover:border-gray-300 rounded px-3 py-1 transition-colors flex items-center gap-2">
                  <div className="relative">
                    <ShoppingBag className="w-8 h-8" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FF8914] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems > 9 ? '9+' : totalItems}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-sm">Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-[#3a5d1e] text-white">
          <div className="max-w-[1500px] mx-auto px-4">
            <ul className="flex items-center gap-5 py-2 text-sm">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href} className="hover:border hover:border-white rounded px-2 py-1 transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            {/* Uncomment if you want to keep the menu button for future use */}
            {/* <button onClick={() => setShowMobileMenu(true)} className="p-2 text-gray-900">
              <Menu className="w-6 h-6" />
            </button> */}
            <div className="w-10 h-10 rounded-full overflow-hidden" />
            <Link href="/" className="f">
              <Image src={logo} alt="Nature Medica" className="w-22" />
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-900">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF8914] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>
          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search NatureMedica"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-xs text-gray-900 bg-gray-100 focus:outline-none"
              />
            </div>
          </form>
        </div>
        {/* Category Bar and Mobile Menu Drawer removed for bottom nav */}
        {/* 
        <div className="bg-[#3a5d1e] text-white px-3 py-2 overflow-x-auto">
          <div className="flex items-center gap-4 text-sm whitespace-nowrap">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="hover:underline">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        */}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-t border-t border-gray-200">
        <div className="flex justify-around items-center h-14">
          {[
            {
              label: 'Home',
              href: '/',
              icon: Home,
              isActive: pathname === '/',
            },
            {
              label: 'Shop',
              href: '/products',
              icon: ShoppingBag,
              isActive: pathname.startsWith('/products'),
            },
            // {
            //   label: 'Wishlist',
            //   href: '/wishlist',
            //   icon: Heart,
            //   isActive: pathname.startsWith('/wishlist'),
            // },
            {
              label: 'Orders',
              href: '/orders',
              icon: Package2,
              isActive: pathname.startsWith('/orders'),
            },
            // {
            //   label: 'Account',
            //   href: isAuthenticated && user ? '/profile' : '/auth',
            //   icon: UserCircle2,
            //   isActive:
            //     (isAuthenticated && user && pathname.startsWith('/profile')) ||
            //     (!isAuthenticated && pathname.startsWith('/auth')),
            // },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 group transition-colors ${
                  item.isActive ? 'text-[#3a5d1e] font-semibold' : 'text-gray-500'
                } hover:text-[#3a5d1e]`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[11px] leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
