'use client';

import React, { useState } from 'react';
import { Clock, Copy, Trash2, ChevronDown, Trophy } from 'lucide-react';

interface DaySchedule {
  day: string;
  enabled: boolean;
  openTime: string;
  closeTime: string;
}

const TIME_OPTIONS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

export const WeeklyScheduleBuilder: React.FC = () => {
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { day: 'Monday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
    { day: 'Tuesday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
    { day: 'Wednesday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
    { day: 'Thursday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
    { day: 'Friday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
    { day: 'Saturday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
    { day: 'Sunday', enabled: true, openTime: '08:00 AM', closeTime: '10:00 PM' },
  ]);

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleToggle = (index: number) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleCopyMondayToAll = () => {
    const monday = schedules[0];
    setSchedules((prev) =>
      prev.map((item) => ({
        ...item,
        openTime: monday.openTime,
        closeTime: monday.closeTime,
        enabled: monday.enabled,
      }))
    );
  };

  return (
    <div className="space-y-4">
      {/* Weekly Availability Main Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 space-y-5">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-gray-900">
            <Clock className="w-4.5 h-4.5 text-gray-700" />
            <h3 className="text-sm font-bold">Weekly Availability</h3>
          </div>

          <button
            type="button"
            onClick={handleCopyMondayToAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Monday to All
          </button>
        </div>

        {/* 7 Days Schedule List */}
        <div className="space-y-3.5">
          {schedules.map((item, index) => (
            <div
              key={item.day}
              className={`
                flex items-center justify-between gap-4 p-2 rounded-xl transition-colors
                ${item.enabled ? 'bg-white' : 'bg-gray-50/70 opacity-60'}
              `}
            >
              {/* Toggle + Day Name */}
              <div className="flex items-center gap-4 w-32 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className={`
                    relative w-9 h-5 rounded-full transition-colors cursor-pointer focus:outline-none
                    ${item.enabled ? 'bg-[#15803d]' : 'bg-gray-300'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-xs
                      ${item.enabled ? 'translate-x-4' : 'translate-x-0'}
                    `}
                  />
                </button>
                <span className="text-xs font-bold text-gray-800">{item.day}</span>
              </div>

              {/* Time Select Dropdowns */}
              <div className="flex items-center gap-2 flex-1 max-w-md">
                {/* Open Time */}
                <div className="relative flex-1">
                  <select
                    value={item.openTime}
                    disabled={!item.enabled}
                    onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs focus:outline-none focus:border-emerald-600 cursor-pointer disabled:bg-gray-100"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        Open {t}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-gray-400 font-medium text-xs">–</span>

                {/* Close Time */}
                <div className="relative flex-1">
                  <select
                    value={item.closeTime}
                    disabled={!item.enabled}
                    onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs focus:outline-none focus:border-emerald-600 cursor-pointer disabled:bg-gray-100"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        Close {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delete Icon */}
              <button
                type="button"
                onClick={() => handleToggle(index)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Per-sport Availability Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200/80">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#0b3327]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                Advanced: Per-sport availability
              </h4>
              <p className="text-[11px] text-gray-500">
                Override general hours for specific sporting activities
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isAdvancedOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isAdvancedOpen && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600 space-y-2">
            <p>Select specific sports (Football, Padel, Badminton, Cricket) to define individual operating hours.</p>
          </div>
        )}
      </div>
    </div>
  );
};
