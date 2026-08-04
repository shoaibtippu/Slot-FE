'use client';

import React, { useState } from 'react';
import { CreditCard, Info } from 'lucide-react';

export const AdvancePaymentCard: React.FC = () => {
  const [percentage, setPercentage] = useState(50);

  const steps = [10, 25, 50, 75, 100];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 space-y-5 h-full flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900">
            <CreditCard className="w-5 h-5 text-[#0b3327]" />
            <h3 className="text-sm font-bold">Advance Payment</h3>
          </div>
          <p className="text-xs text-gray-500">
            Required deposit to confirm a booking.
          </p>
        </div>

        <span className="bg-[#a7f3d0]/80 text-[#0b3327] font-extrabold text-xs px-3 py-1 rounded-lg">
          {percentage}%
        </span>
      </div>

      {/* Slider Controls */}
      <div className="space-y-2 pt-1">
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b3327]"
        />

        <div className="flex justify-between text-[11px] font-semibold text-gray-400">
          {steps.map((step) => (
            <span
              key={step}
              onClick={() => setPercentage(step)}
              className={`cursor-pointer hover:text-gray-700 ${
                percentage === step ? 'text-[#0b3327] font-bold' : ''
              }`}
            >
              {step}%
            </span>
          ))}
        </div>
      </div>

      {/* Info Banner Box */}
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-2 text-[11px] text-emerald-950 font-medium">
        <Info className="w-4 h-4 text-[#0b3327] shrink-0" />
        <span>Higher deposits reduce no shows but may lower booking volume.</span>
      </div>
    </div>
  );
};
