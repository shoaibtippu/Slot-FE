import React, { useState } from 'react';
import { Timer } from 'lucide-react';

export const BookingThresholdCard: React.FC = () => {
  const [duration, setDuration] = useState('1 Hour');

  return (
    <div className="bg-[#0b3327] text-white rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
      {/* Background Watermark Clock */}
      <div className="absolute -right-4 -bottom-4 text-emerald-900/40 pointer-events-none">
        <Timer className="w-32 h-32" />
      </div>

      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 text-emerald-200">
          <Timer className="w-4 h-4 text-emerald-300" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-100">
            Booking Threshold
          </h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
            Minimum Duration
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full appearance-none rounded-xl bg-[#06241b] border border-emerald-700/60 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="30 Mins">30 Mins</option>
            <option value="1 Hour">1 Hour</option>
            <option value="1.5 Hours">1.5 Hours</option>
            <option value="2 Hours">2 Hours</option>
          </select>
        </div>

        <p className="text-[11px] text-emerald-200/80 leading-snug">
          Ensures high efficiency for slot management and prevents tiny gaps.
        </p>
      </div>
    </div>
  );
};
