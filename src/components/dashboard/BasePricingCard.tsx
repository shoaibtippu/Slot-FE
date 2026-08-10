'use client';

import React from 'react';
import { Banknote } from 'lucide-react';
import { useAddGround } from '@/context/AddGroundContext';

export const BasePricingCard: React.FC = () => {
  const { data, updateStep2 } = useAddGround();
  const { basePrice, currency } = data.step2;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-gray-900">
          <Banknote className="w-5 h-5 text-[#0b3327]" />
          <h3 className="text-sm font-bold">Base Pricing</h3>
        </div>
        <p className="text-xs text-gray-500">
          Set the standard hourly rate for your facility.
        </p>
      </div>

      <div className="relative flex items-center pt-2">
        <span className="absolute left-4 font-bold text-gray-700 text-xs">{currency}</span>
        <input
          type="text"
          value={basePrice}
          onChange={(e) => updateStep2({ basePrice: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pl-12 pr-24 text-sm font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
        />
        <span className="absolute right-3 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          PER HOUR
        </span>
      </div>
    </div>
  );
};