'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FiX } from 'react-icons/fi';

const sortOptions = [
  { value: '', label: 'Newest First' },
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

// Category pills + sort, replacing the old sidebar so the grid can use the full width
export default function ProductsToolbar({ categories = [], totalProducts = 0 }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  const apply = (key, value) => {
    const params = new URLSearchParams(searchParams);
    // Search is ignored when a category is chosen, so drop it
    if (key === 'category') params.delete('search');
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  };

  const pill = (active) =>
    `flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold border transition-all cursor-pointer ${
      active
        ? 'bg-[#2d4e24] text-white border-[#2d4e24] shadow-sm'
        : 'bg-white text-gray-700 border-gray-200 hover:border-[#2d4e24] hover:text-[#2d4e24]'
    }`;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-4">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button type="button" onClick={() => apply('category', '')} className={pill(!category)}>
          All
        </button>
        {categories.map((c) => (
          <button key={c._id} type="button" onClick={() => apply('category', c.slug)} className={pill(category === c.slug)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            <span className="font-bold text-gray-900">{totalProducts}</span> {totalProducts === 1 ? 'product' : 'products'}
          </span>
          {search && (
            <button
              type="button"
              onClick={() => apply('search', '')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eef5ec] text-[#2d4e24] text-xs font-bold cursor-pointer"
            >
              “{search}” <FiX className="w-3 h-3" />
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          Sort
          <select
            value={sort}
            onChange={(e) => apply('sort', e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm normal-case tracking-normal font-semibold text-gray-900 bg-white focus:border-[#2d4e24] focus:ring-2 focus:ring-[#2d4e24]/20 outline-none cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
