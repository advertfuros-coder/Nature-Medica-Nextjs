'use client';

import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FiUser size={20} />
          <span>Admin</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
