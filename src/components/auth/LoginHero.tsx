import React from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, Zap } from 'lucide-react';

export const LoginHero: React.FC = () => {
  return (
    <div className="flex flex-col justify-between p-8 lg:p-12 xl:p-16 h-full w-full bg-[#f8fafc] text-gray-900 overflow-hidden select-none">
      {/* Top Left Logo */}
      <div>
        <Logo size="md" variant="dark" />
      </div>

      {/* Main Copy & Feature Cards */}
      <div className="my-auto space-y-6 max-w-xl">
        <div className="space-y-3">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#0b3327] leading-[1.15] tracking-tight">
            Elevate Your Game with Precision Management.
          </h1>
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed max-w-md">
            Join the elite network of facility owners and athletes using Slot to streamline bookings and maximize performance.
          </p>
        </div>

        {/* Feature Cards 2-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Card 1: High Trust Security */}
          <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0b3327]">
              <ShieldCheck className="w-5 h-5 text-[#0b3327]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
              High Trust Security
            </h3>
            <p className="text-xs text-gray-500 leading-snug">
              Bank-grade encryption for all transactions and user data.
            </p>
          </div>

          {/* Card 2: Instant Booking */}
          <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0b3327]">
              <Zap className="w-5 h-5 text-[#0b3327]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
              Instant Booking
            </h3>
            <p className="text-xs text-gray-500 leading-snug">
              Real-time availability updates across all platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Footer */}
      <div>
        <p className="text-xs text-gray-400 font-medium">
          © 2024 Slot Sports. All rights reserved.
        </p>
      </div>
    </div>
  );
};
