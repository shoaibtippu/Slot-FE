import React from 'react';
import { Lock } from 'lucide-react';

export const SecurityNotice: React.FC = () => {
  return (
    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
      <Lock className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
      <p className="text-xs text-slate-600 leading-snug">
        <span className="font-bold text-slate-800">Security Notice:</span> Your account will be temporarily locked after 5 failed login attempts to protect your data.
      </p>
    </div>
  );
};
