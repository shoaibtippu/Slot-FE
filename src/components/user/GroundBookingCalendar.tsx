'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { GroundScheduleSlot } from '@/services/userGroundsService';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  schedules: GroundScheduleSlot[];
  selectedDate: string;
  onDateSelect: (dateStr: string) => void;
}

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function isDayOpen(schedules: GroundScheduleSlot[], dayIndex: number): boolean {
  const name = DAY_NAMES[dayIndex];
  const s = schedules.find((x) => x.dayOfWeek === name);
  return s?.isAvailable ?? false;
}

export function GroundBookingCalendar({ schedules, selectedDate, onDateSelect }: Props) {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const prevYear = () => setViewYear(y => y - 1);
  const nextYear = () => setViewYear(y => y + 1);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDayClick = (day: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    if (dateStr < todayStr) return;
    const dayIndex = new Date(viewYear, viewMonth, day).getDay();
    if (!isDayOpen(schedules, dayIndex)) return;
    onDateSelect(dateStr);
  };

  // Legend: open days of week for this ground
  const openDays = DAY_NAMES.filter((_, i) => isDayOpen(schedules, i));

  return (
    <div className="space-y-4">
      {/* Open days legend */}
      {openDays.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] text-gray-400 font-medium">Open:</span>
          {openDays.map((d) => (
            <span key={d} className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
              {d.slice(0, 3)}
            </span>
          ))}
        </div>
      )}

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button type="button" onClick={prevYear} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" title="Previous year">
            <ChevronsLeft className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" title="Previous month">
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        <h4 className="text-sm font-extrabold text-gray-900 tracking-tight select-none">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h4>

        <div className="flex items-center gap-1">
          <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" title="Next month">
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button type="button" onClick={nextYear} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" title="Next year">
            <ChevronsRight className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {SHORT_DAY.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1.5 select-none">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`e-${idx}`} className="bg-white aspect-square" />;
            }

            const dateStr = toDateStr(viewYear, viewMonth, day);
            const isPast = dateStr < todayStr;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const dayIndex = new Date(viewYear, viewMonth, day).getDay();
            const isOpen = isDayOpen(schedules, dayIndex);
            const isBookable = !isPast && isOpen;

            let cellClass = 'bg-white aspect-square flex items-center justify-center text-xs font-bold transition-all select-none ';
            let innerClass = 'w-8 h-8 flex items-center justify-center rounded-full transition-all ';

            if (isSelected) {
              innerClass += 'bg-[#0b3327] text-white shadow-md';
            } else if (isToday && isBookable) {
              cellClass += 'cursor-pointer hover:bg-emerald-50 ';
              innerClass += 'ring-2 ring-[#0b3327] text-[#0b3327] hover:bg-emerald-100 ';
            } else if (isToday) {
              innerClass += 'ring-2 ring-gray-300 text-gray-400 ';
            } else if (isBookable) {
              cellClass += 'cursor-pointer hover:bg-emerald-50 ';
              innerClass += 'text-gray-900 hover:bg-emerald-600 hover:text-white ';
            } else if (isPast) {
              innerClass += 'text-gray-300 ';
            } else {
              // future but closed
              innerClass += 'text-gray-300 ';
            }

            return (
              <div
                key={dateStr}
                className={cellClass}
                onClick={() => isBookable ? handleDayClick(day) : undefined}
                title={
                  isSelected ? 'Selected'
                  : isPast ? 'Past date'
                  : isOpen ? `Book for ${dateStr}`
                  : `Closed on ${DAY_NAMES[dayIndex]}s`
                }
              >
                <span className={innerClass}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[11px] font-medium text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0b3327] inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> Unavailable
        </span>
      </div>
    </div>
  );
}
