import React from 'react';
import { Check } from 'lucide-react';

export const PricingStepProgress: React.FC = () => {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold select-none">
      {/* Step 1: Basic Info (Completed) */}
      <div className="flex items-center gap-1.5 text-gray-500">
        <div className="w-4.5 h-4.5 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 text-[10px]">
          <Check className="w-3 h-3 text-gray-600" />
        </div>
        <span className="tracking-wider uppercase text-[11px]">BASIC INFO</span>
      </div>

      <div className="w-8 h-0.5 bg-gray-200" />

      {/* Step 2: Pricing (Active) */}
      <div className="flex items-center gap-1.5 text-gray-900 font-bold">
        <div className="w-5 h-5 rounded-full border-2 border-gray-900 bg-white flex items-center justify-center text-gray-900 text-[11px]">
          2
        </div>
        <span className="tracking-wider uppercase text-xs">PRICING</span>
      </div>

      <div className="w-8 h-0.5 bg-gray-200" />

      {/* Step 3: Review */}
      <div className="flex items-center gap-1.5 text-gray-400">
        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-[11px]">
          3
        </div>
        <span className="tracking-wider uppercase text-[11px]">REVIEW</span>
      </div>
    </div>
  );
};
