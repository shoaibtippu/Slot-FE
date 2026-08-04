import React, { useState } from 'react';
import { Timer } from 'lucide-react';
import { Select } from '../ui/Select';

export const BookingThresholdCard: React.FC = () => {
  const [duration, setDuration] = useState('1 Hour');

  return (
    <div className="bg-[#0b3327] text-white rounded-2xl p-5 shadow-sm space-y-4 relative">
      {/* Background Watermark Clock Container */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -right-4 -bottom-4 text-emerald-900/40">
          <Timer className="w-32 h-32" />
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 text-emerald-200">
          <Timer className="w-4 h-4 text-emerald-300" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-100">
            Booking Threshold
          </h3>
        </div>

        <Select
          label="MINIMUM DURATION"
          variant="dark"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          options={[
            { value: '30 Mins', label: '30 Mins' },
            { value: '1 Hour', label: '1 Hour' },
            { value: '1.5 Hours', label: '1.5 Hours' },
            { value: '2 Hours', label: '2 Hours' },
          ]}
        />

        <p className="text-[11px] text-emerald-200/80 leading-snug">
          Ensures high efficiency for slot management and prevents tiny gaps.
        </p>
      </div>
    </div>
  );
};
