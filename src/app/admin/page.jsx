import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Category from '@/models/Category';
import { cookies } from 'next/headers';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrders from '@/components/admin/RecentOrders';
import SalesChart from '@/components/admin/SalesChart';
import CategoryChart from '@/components/admin/CategoryChart';
import TopProductsChart from '@/components/admin/TopProductsChart';

export default async function AdminDashboard() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      redirect('/admin/login');
    }

    await connectDB();

    // Get statistics
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalPrice' } } }
    ]);
    
    const totalRevenue = revenue[0]?.total || 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .lean();

    // Get sales data for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo },
          paymentStatus: 'completed'
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$finalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get category-wise revenue
    const categoryRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

        <DashboardStats
          totalOrders={totalOrders}
          totalProducts={totalProducts}
          totalUsers={totalUsers}
          totalRevenue={totalRevenue}
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <SalesChart data={JSON.parse(JSON.stringify(salesData))} />
          <CategoryChart data={JSON.parse(JSON.stringify(categoryRevenue))} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <TopProductsChart data={JSON.parse(JSON.stringify(topProducts))} />
          <RecentOrders orders={JSON.parse(JSON.stringify(recentOrders))} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    redirect('/admin/login');
  }
}
