import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import ReviewList from '@/components/admin/ReviewList';

export default async function AdminReviewsPage({ searchParams }) {
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  let query = {};
  
  if (searchParams.status === 'pending') {
    query.approved = false;
  } else if (searchParams.status === 'approved') {
    query.approved = true;
  }

  const reviews = await Review.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name')
    .populate('product', 'title')
    .lean();

  const totalReviews = await Review.countDocuments(query);
  const totalPages = Math.ceil(totalReviews / limit);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Reviews</h1>
      <ReviewList 
        reviews={JSON.parse(JSON.stringify(reviews))}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
