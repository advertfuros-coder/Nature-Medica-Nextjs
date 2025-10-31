'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight, FiCalendar, FiUser } from 'react-icons/fi';
import { useRef, useEffect } from 'react';

const blogs = [
  {
    id: 1,
    title: '10 Natural Remedies to Boost Your Immune System',
    slug: '10-natural-remedies-boost-immune-system',
    excerpt: 'Discover powerful Ayurvedic herbs and supplements for your immunity.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600',
    category: 'Immunity',
    author: 'Dr. Priya Sharma',
    date: '2025-10-15'
  },
  {
    id: 2,
    title: 'Complete Guide to Ashwagandha Benefits',
    slug: 'complete-guide-ashwagandha-benefits-uses',
    excerpt: 'All about this powerful adaptogenic herb and its many uses.',
    image: 'https://images.unsplash.com/photo-1599932158043-34ce49e5742f?w=600',
    category: 'Wellness',
    author: 'Ayush Verma',
    date: '2025-10-12'
  },
  {
    id: 3,
    title: 'Why Turmeric Should Be in Your Diet',
    slug: 'turmeric-daily-routine-benefits',
    excerpt: 'Explore the anti-inflammatory properties of turmeric.',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600',
    category: 'Health',
    author: 'Dr. Rajesh Kumar',
    date: '2025-10-08'
  },
  {
    id: 4,
    title: 'Vitamin D Deficiency in India',
    slug: 'vitamin-d-deficiency-india',
    excerpt: 'Learn causes, symptoms, and solutions for vitamin D issues.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600',
    category: 'Nutrition',
    author: 'Dr. Ananya Gupta',
    date: '2025-10-01'
  }
];

export default function HomeBlogCarousel() {
  const carouselRef = useRef();

  // Marquee style auto-scroll (pause on hover)
  useEffect(() => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    let interval = null;

    const scroll = () => {
      if (el.scrollLeft < el.scrollWidth - el.clientWidth)
        el.scrollLeft += 1;
      else
        el.scrollLeft = 0;
    };

    interval = setInterval(scroll, 15);

    el.addEventListener('mouseenter', () => clearInterval(interval));
    el.addEventListener('mouseleave', () => {
      interval = setInterval(scroll, 15);
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="my-12">
      <div className="flex items-center justify-between px-3 mb-3">
        <h2 className="text-2xl font-bold text-[#3a5d1e]">Latest from Our Blog</h2>
        <Link 
          href="/blog"
          className="flex gap-2 items-center px-4 py-2 rounded-lg border-2 border-[#3a5d1e] text-[#3a5d1e] hover:bg-[#3a5d1e] hover:text-white font-semibold transition-colors"
        >
          View All
          <FiChevronRight />
        </Link>
      </div>
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto hide-scrollbar gap-6 px-3 py-2"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {blogs.concat(blogs).map((blog, idx) => (
          <Link 
            href={`/blog/${blog.slug}`}
            key={blog.id + '-carousel-' + idx}
            className="min-w-[300px] max-w-xs flex-shrink-0 rounded-xl bg-white shadow-lg transition-transform hover:scale-105 duration-300 group"
          >
            <div className="h-44 rounded-t-xl overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex flex-col h-40">
              <span className="inline-block px-2 py-1 text-xs bg-green-50 text-[#3a5d1e] font-semibold rounded mb-1">
                {blog.category}
              </span>
              <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-2">
                {blog.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex-1">{blog.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                <FiUser className="w-4 h-4" />
                {blog.author}
                <span className="mx-1">•</span>
                <FiCalendar className="w-4 h-4" />
                {new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
