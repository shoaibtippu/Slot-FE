'use client';

import React, { useState } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';

export const SportSpecificPricingCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <input
              type="text"
              defaultValue="$ 45.00/hr"
              className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs"
            />
          </div>
          <div className="p-3 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-gray-800">Padel Court</span>
            <input
              type="text"
              defaultValue="$ 60.00/hr"
              className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs"
            />
          </div>
          <div className="p-3 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-gray-800">Badminton Court</span>
            <input
              type="text"
              defaultValue="$ 30.00/hr"
              className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
