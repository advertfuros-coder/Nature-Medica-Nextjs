import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Analytics from '@/models/Analytics';
import User from '@/models/User';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    // Fetch completed orders of the day
    const orders = await Order.find({
      paymentStatus: 'completed',
      createdAt: { $gte: startOfDay }
    }).populate('items.product');

    const salesCount = orders.length;
    const revenue = orders.reduce((sum, o) => sum + o.finalPrice, 0);

    // Collect top-selling products
    const productSales = {};
    const categoryRevenue = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        productSales[item.product] = (productSales[item.product] || 0) + item.quantity;

        const category = item.product.category.toString();
        categoryRevenue[category] = (categoryRevenue[category] || 0) + item.price * item.quantity;
      });
    });

    const newUsers = await User.countDocuments({
      createdAt: { $gte: startOfDay },
      role: 'customer'
    });

    const topProducts = Object.entries(productSales)
      .slice(0, 5)
      .map(([productId, count]) => ({
        product: productId,
        count
      }));

    await Analytics.findOneAndUpdate(
      { date: startOfDay },
      { salesCount, revenue, topSelling: topProducts, newUsers, categoryWiseRevenue: categoryRevenue },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Analytics data generated' });
  } catch (error) {
    console.error('Analytics generation error:', error);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}
