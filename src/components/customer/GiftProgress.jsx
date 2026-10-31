import { FiCheck, FiGift } from 'react-icons/fi';
import { MILESTONES } from '@/lib/giftTiers';

// Milestone progress: free shipping, then free gifts
export default function GiftProgress({ subtotal = 0 }) {
  const top = MILESTONES[MILESTONES.length - 1].threshold;
  const percent = Math.min(100, Math.round((subtotal / top) * 100));
  const next = MILESTONES.find((m) => subtotal < m.threshold);

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-xs">
      <p className="text-xs sm:text-sm font-bold text-gray-900 mb-3">
        {next ? (
          <span>
            Add <strong className="text-[#2d4e24]">₹{(next.threshold - subtotal).toLocaleString('en-IN')}</strong> more
            to unlock <strong className="text-[#2d4e24]">{next.label}</strong>
          </span>
        ) : (
          <span>🎉 You have unlocked every reward!</span>
        )}
      </p>

      <div className="relative h-2 rounded-full bg-gray-100 mb-7">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-[#2d4e24] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
        {MILESTONES.map((m) => {
          const reached = subtotal >= m.threshold;
          return (
            <div
              key={m.threshold}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${(m.threshold / top) * 100}%` }}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  reached ? 'bg-[#2d4e24] border-[#2d4e24] text-white' : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {reached ? <FiCheck className="w-3 h-3" /> : <FiGift className="w-2.5 h-2.5" />}
              </span>
              <span className="absolute top-6 whitespace-nowrap text-[10px] font-semibold text-gray-600">
                ₹{m.threshold}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
