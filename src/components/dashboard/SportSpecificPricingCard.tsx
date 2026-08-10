'use client';

import React, { useState } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';
import { useAddGround } from '@/context/AddGroundContext';

export const SportSpecificPricingCard: React.FC = () => {
  const { data, updateStep2 } = useAddGround();
  const { sportPrices, currency } = data.step2;
  const [isOpen, setIsOpen] = useState(false);

  const setSportPrice = (sport: keyof typeof sportPrices, value: string) => {
    updateStep2({ sportPrices: { ...sportPrices, [sport]: value } });
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200/80">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
            <Trophy className="w-4.5 h-4.5 text-[#0b3327]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">
              Sport-Specific Pricing
            </h4>
            <p className="text-[11px] text-gray-500">
              Click to override pricing for individual sports
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-gray-800">Football Turf</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-gray-600 text-[10px]">
                {currency}
              </span>
              <input
                type="text"
                value={sportPrices.football}
                onChange={(e) => setSportPrice('football', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs pl-9"
              />
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-gray-800">Padel Court</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-gray-600 text-[10px]">
                {currency}
              </span>
              <input
                type="text"
                value={sportPrices.padel}
                onChange={(e) => setSportPrice('padel', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs pl-9"
              />
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-gray-800">Badminton Court</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-gray-600 text-[10px]">
                {currency}
              </span>
              <input
                type="text"
                value={sportPrices.badminton}
                onChange={(e) => setSportPrice('badminton', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs pl-9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};