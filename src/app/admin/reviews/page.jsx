import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import ReviewList from '@/components/admin/ReviewList';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage({ searchParams }) {
  await connectDB();

  // ✅ Await searchParams (Next.js 15)
  const params = await searchParams;

  const page = parseInt(params?.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  let query = {};

  if (params?.status === 'pending') {
    query.approved = false;
  } else if (params?.status === 'approved') {
    query.approved = true;
  }

  try {
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('product', 'title image')
      .lean();

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    // ✅ Filter out reviews with deleted products/users or keep them with placeholder
    const validReviews = reviews.map(review => ({
      ...review,
      user: review.user || { name: 'Deleted User', email: '' },
      product: review.product || { title: 'Deleted Product', image: '' }
    }));

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Reviews Management</h1>
        <ReviewList
          reviews={JSON.parse(JSON.stringify(validReviews))}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Error Loading Reviews</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }
}
