'use client';

import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';
import { useAddGround } from '@/context/AddGroundContext';

export const PeakHourPricingCard: React.FC = () => {
  const { data, updateStep2 } = useAddGround();
  const { peakEnabled: isEnabled, peakStart: startTime, peakEnd: endTime, peakPrice, currency } = data.step2;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 space-y-5 h-full flex flex-col justify-between">
      {/* Header with Enable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-900">
          <TrendingUp className="w-5 h-5 text-[#0b3327]" />
          <h3 className="text-sm font-bold">Peak-Hour Pricing</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateStep2({ peakEnabled: !isEnabled })}
            className={`
              relative w-9 h-5 rounded-full transition-colors cursor-pointer focus:outline-none
              ${isEnabled ? 'bg-[#15803d]' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-xs
                ${isEnabled ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </button>
          <span className="text-xs font-medium text-gray-600">Enable</span>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${isEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
        {/* Start Time */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            START TIME
          </label>
          <div className="relative flex items-center">
            <Clock className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={startTime}
              onChange={(e) => updateStep2({ peakStart: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 pl-9 text-xs font-semibold text-gray-800 focus:outline-none focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        {/* End Time */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            END TIME
          </label>
          <div className="relative flex items-center">
            <Clock className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={endTime}
              onChange={(e) => updateStep2({ peakEnd: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 pl-9 text-xs font-semibold text-gray-800 focus:outline-none focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Peak Price */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            PEAK PRICE
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 font-bold text-gray-700 text-xs">{currency}</span>
            <input
              type="text"
              value={peakPrice}
              onChange={(e) => updateStep2({ peakPrice: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 pl-10 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};