'use client';

export default function InfoStrip() {
  const info = [
    {
      title: 'Home Delivery',
      description: 'Order before 10pm for delivery within 3 working days.',
    },
    {
      title: 'Nature Medica Offer',
      description: 'Get an extra 20% off your first order when you shop on the Nature Medica.',
    },
    {
      title: 'Rewards for Life',
      description: 'Join today and earn points on every purchase to redeem on your next order.',
    },
    {
      title: 'Free Wellness Advice',
      description: 'Chat with a specialist live or book a 15-minute consultation today.',
    },
  ];

  return (
    <section className="bg-gray-50 py-6 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {info.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
              {item.title}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}