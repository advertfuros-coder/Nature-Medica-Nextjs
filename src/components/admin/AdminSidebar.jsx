'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingBag,
  Grid3x3,
  Tag,
  Star,
  Image as ImageIcon,
  Users,
  RotateCcw,
  Layers,
  ChevronLeft,
  ChevronRight,
  Contact2,
  Settings
} from 'lucide-react';
import logo from '@/assets/logor.webp';
import Image from 'next/image';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/collections', label: 'Collections', icon: Layers },
  { href: '/admin/returns', label: 'Returns', icon: RotateCcw },
  { href: '/admin/categories', label: 'Categories', icon: Grid3x3 },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  // { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/contacts', label: 'Customer Inquiry', icon: Contact2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-200 flex-shrink-0 shadow-lg h-screen sticky top-0 overflow-hidden transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 relative">
        {!isCollapsed && (
          <Link href="/admin" className="block mb-4">
            <Image
              src={logo}
              alt="Nature Medica"
              width={140}
              height={55}
              className="mx-auto"
            />
          </Link>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right- top-8 bg-white border-2 border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors shadow-md"
          style={{ borderColor: '#3A5D1E' }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" style={{ color: '#3A5D1E' }} />
          ) : (
            <ChevronLeft className="w-4 h-4" style={{ color: '#3A5D1E' }} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-[#3A5D1E] to-[#4a7025] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#3A5D1E]'}`} />
                {!isCollapsed && (
                  <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
