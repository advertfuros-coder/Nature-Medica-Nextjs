import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import ReturnsTable from '@/components/admin/ReturnsTable';

export default async function AdminReturnsPage({ searchParams }) {
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const status = searchParams.status || 'all';
  const limit = 20;
  const skip = (page - 1) * limit;

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

  // Get counts for each status
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Return & Exchange Requests</h1>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([key, count]) => (
          <a
            key={key}
            href={`?status=${key}`}
            className={`px-4 py-2 rounded-lg font-semibold ${
              status === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')} ({count})
          </a>
        ))}
      </div>

      <ReturnsTable 
        returns={JSON.parse(JSON.stringify(returns))}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
