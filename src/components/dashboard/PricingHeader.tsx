import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

export const PricingHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#0b3327] text-white px-6 py-3 flex items-center justify-between shadow-sm shrink-0">
      {/* Title */}
      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
        Pricing & Advance Settings
      </h1>

      {/* Center Search Facilities Bar */}
      <div className="flex-1 max-w-xs mx-6">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-emerald-200/70 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full rounded-xl bg-emerald-950/60 border border-emerald-700/50 px-3 py-1.5 pl-9 text-xs text-white placeholder:text-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition-all"
          />
        </div>
      </div>

      {/* Right Icons & Support */}
      <div className="flex items-center gap-4 text-emerald-100">
        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
        </button>

        <button
          type="button"
          aria-label="Help"
          className="p-1.5 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <a
          href="#"
          className="text-xs font-medium hover:text-white transition-colors ml-1"
        >
          Support
        </a>
      </div>
    </header>
  );
};
