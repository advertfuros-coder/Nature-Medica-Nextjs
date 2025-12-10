import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import Order from '@/models/Order'; // Add this import
import User from '@/models/User'; // Add this import
import ReturnsTable from '@/components/admin/ReturnsTable';

export const dynamic = 'force-dynamic';

export default async function AdminReturnsPage({ searchParams }) {
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const status = searchParams.status || 'all';
  const limit = 20;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};
  if (status !== 'all') {
    query.status = status;
  }

  const returns = await ReturnRequest.find(query)
    .populate('user', 'name email phone')
    .populate('order', 'orderId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalReturns = await ReturnRequest.countDocuments(query);
  const totalPages = Math.ceil(totalReturns / limit);

  // Get status counts
  const statusCounts = {
    all: await ReturnRequest.countDocuments(),
    pending: await ReturnRequest.countDocuments({ status: 'pending' }),
    approved: await ReturnRequest.countDocuments({ status: 'approved' }),
    rejected: await ReturnRequest.countDocuments({ status: 'rejected' }),
    pickup_scheduled: await ReturnRequest.countDocuments({ status: 'pickup_scheduled' }),
    picked_up: await ReturnRequest.countDocuments({ status: 'picked_up' }),
    refunded: await ReturnRequest.countDocuments({ status: 'refunded' }),
    completed: await ReturnRequest.countDocuments({ status: 'completed' })
  };

  return (
    <div className='p-4 md:p-8 lg:p-8'>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Returns & Refunds</h1>
        <p className="text-gray-600 mt-2">Manage customer return requests</p>
      </div>

      <ReturnsTable
        returns={JSON.parse(JSON.stringify(returns))}
        statusCounts={statusCounts}
        currentStatus={status}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
