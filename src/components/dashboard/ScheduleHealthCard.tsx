import React from 'react';

interface ScheduleHealthProps {
  completedDays?: number;
  totalDays?: number;
}

export const ScheduleHealthCard: React.FC<ScheduleHealthProps> = ({
  completedDays = 5,
  totalDays = 7,
}) => {
  const percentage = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="bg-[#ecfdf5] rounded-2xl p-5 border border-emerald-100 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-emerald-950">Schedule Health</h3>
        <span className="text-xs font-bold text-emerald-900">
          {completedDays}/{totalDays} Days Set
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#0b3327] h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[11px] text-emerald-900/80 leading-relaxed">
        You&apos;ve set operating hours for most weekdays. Remember to block weekends if you&apos;re not hosting events then.
      </p>
    </div>
  );
};
