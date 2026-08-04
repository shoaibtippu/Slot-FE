'use client';

import React, { useState } from 'react';
import { Select } from '../ui/Select';

export const AnalyticsChartsSection: React.FC = () => {
  const [timeframe, setTimeframe] = useState('This Week');

  const weeklyData = [
    { day: 'MON', height: '40%', active: false },
    { day: 'TUE', height: '60%', active: false },
    { day: 'WED', height: '50%', active: false },
    { day: 'THU', height: '90%', active: true },
    { day: 'FRI', height: '70%', active: false },
    { day: 'SAT', height: '80%', active: false },
    { day: 'SUN', height: '45%', active: false },
  ];

  const sportsData = [
    { name: 'Cricket', percentage: '60%', slots: '50 slots', color: 'bg-[#0b3327]' },
    { name: 'Football', percentage: '25%', slots: '21 slots', color: 'bg-emerald-600' },
    { name: 'Tennis', percentage: '15%', slots: '13 slots', color: 'bg-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Bookings Bar Chart Card */}
      <div className="bg-white rounded-2xl p-6 shadow-2xs border border-gray-200/80 space-y-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Weekly Bookings</h3>
          <Select
            variant="compact"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            options={[
              { value: 'This Week', label: 'This Week' },
              { value: 'Last Week', label: 'Last Week' },
              { value: 'This Month', label: 'This Month' },
            ]}
          />
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-gray-100">
          {weeklyData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div
                className={`
                  w-full rounded-t-lg transition-all duration-300
                  ${item.active ? 'bg-[#0b3327]' : 'bg-[#a7f3d0]/80 group-hover:bg-emerald-300'}
                `}
                style={{ height: item.height }}
              />
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-700">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Most Booked Sports Donut Chart Card */}
      <div className="bg-white rounded-2xl p-6 shadow-2xs border border-gray-200/80 space-y-4 flex flex-col justify-between">
        <h3 className="text-sm font-bold text-gray-900">Most Booked Sports</h3>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          {/* Custom SVG Donut Chart */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                className="text-emerald-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Cricket 60% */}
              <path
                className="text-[#0b3327]"
                strokeDasharray="60, 100"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Football 25% */}
              <path
                className="text-emerald-600"
                strokeDasharray="25, 100"
                strokeDashoffset="-60"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-gray-900">84</span>
              <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                BOOKINGS
              </span>
            </div>
          </div>

          {/* Legend Details */}
          <div className="space-y-3 w-full max-w-xs">
            {sportsData.map((sport, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${sport.color}`} />
                  <span className="font-bold text-gray-800">{sport.name}</span>
                </div>
                <span className="text-gray-500 font-medium text-[11px]">
                  {sport.percentage} ({sport.slots})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
