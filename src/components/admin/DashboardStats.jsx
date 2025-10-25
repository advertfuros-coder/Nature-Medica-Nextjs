import { FiShoppingBag, FiPackage, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function DashboardStats({ 
  totalOrders, 
  totalProducts, 
  totalUsers, 
  totalRevenue 
}) {
  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: FiShoppingBag,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Products',
      value: totalProducts,
      icon: FiPackage,
      color: 'bg-green-500'
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: FiUsers,
      color: 'bg-purple-500'
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
