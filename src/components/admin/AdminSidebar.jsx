'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingBag, 
  FiGrid, 
  FiTag, 
  FiStar, 
  FiImage,
  FiUsers,
  FiAperture
} from 'react-icons/fi';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: FiHome },
  { href: '/admin/products', label: 'Products', icon: FiPackage },
  { href: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { href: '/admin/returns', label: 'Returns', icon: FiAperture },
  { href: '/admin/categories', label: 'Categories', icon: FiGrid },
  { href: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { href: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { href: '/admin/banners', label: 'Banners', icon: FiImage },
  { href: '/admin/users', label: 'Users', icon: FiUsers },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
      <div className="p-6">
        <Link href="/admin">
          <h2 className="text-2xl font-bold text-green-400">NatureMedica</h2>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </Link>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
