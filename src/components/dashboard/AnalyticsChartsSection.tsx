'use client';

import React from 'react';
import { WeeklyBookingItem } from '@/types/grounds';

interface AnalyticsChartsSectionProps {
  weeklyBookings?: WeeklyBookingItem[];
  pendingBookings?: number;
  confirmedBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  isLoading?: boolean;
}

const STATUS_COLORS = [
  { label: 'Confirmed', color: 'bg-emerald-500', key: 'confirmed' as const },
  { label: 'Pending',   color: 'bg-amber-400',   key: 'pending'   as const },
  { label: 'Completed', color: 'bg-blue-500',     key: 'completed' as const },
  { label: 'Cancelled', color: 'bg-red-400',      key: 'cancelled' as const },
];

const DONUT_HEX = ['#10b981', '#f59e0b', '#3b82f6', '#f87171'];

export const AnalyticsChartsSection: React.FC<AnalyticsChartsSectionProps> = ({
  weeklyBookings = [],
  pendingBookings = 0,
  confirmedBookings = 0,
  completedBookings = 0,
  cancelledBookings = 0,
  isLoading = false,
}) => {
  const maxCount = Math.max(...weeklyBookings.map((d) => d.count), 1);

  const statusData = [
    { ...STATUS_COLORS[0], count: confirmedBookings },
    { ...STATUS_COLORS[1], count: pendingBookings },
    { ...STATUS_COLORS[2], count: completedBookings },
    { ...STATUS_COLORS[3], count: cancelledBookings },
  ];

  const totalStatus = statusData.reduce((s, d) => s + d.count, 0);
  const divisor = totalStatus || 1;

  // SVG donut (cx=60, cy=60, r=40, strokeWidth=18)
  const radius = 40;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * radius;

  let offsetPct = 0;
  const arcs = statusData.map((item, i) => {
    const pct = item.count / divisor;
    const dash = pct * circ;
    const arc = {
      color: DONUT_HEX[i],
      dasharray: `${dash} ${circ - dash}`,
      dashoffset: -(offsetPct * circ),
    };
    offsetPct += pct;
    return arc;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Weekly Bookings Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-5">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Weekly Bookings</h3>
          <p className="text-xs text-gray-500 mt-0.5">Bookings by date — last 7 days</p>
        </div>

        {isLoading ? (
          <div className="flex items-end justify-between gap-2 h-32">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-gray-100 rounded-t-lg animate-pulse" style={{ height: '60%' }} />
                <div className="w-6 h-2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : weeklyBookings.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs text-gray-400 font-medium">
            No booking data available
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2" style={{ height: '8rem' }}>
            {weeklyBookings.map((item, i) => {
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-bold text-gray-500">
                    {item.count > 0 ? item.count : ''}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-[#a7f3d0] hover:bg-emerald-500 transition-colors duration-300"
                    style={{ height: `${Math.max(pct, item.count > 0 ? 8 : 3)}%`, minHeight: '3px' }}
                    title={`${item.day}: ${item.count} bookings`}
                  />
                  <span className="text-[10px] font-bold text-gray-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Status Donut */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-5">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Booking Status</h3>
          <p className="text-xs text-gray-500 mt-0.5">Distribution across all your grounds</p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full border-8 border-gray-100 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-100 animate-pulse" />
                  <div className="h-2.5 bg-gray-100 rounded animate-pulse flex-1" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f3f4f6" strokeWidth="18" />
                {totalStatus === 0 ? null : arcs.map((arc, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth="18"
                    strokeDasharray={arc.dasharray}
                    strokeDashoffset={arc.dashoffset}
                    className="transition-all duration-700"
                  />
                ))}
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    transform: `rotate(90deg)`,
                    transformOrigin: `${cx}px ${cy}px`,
                    fill: '#111827',
                    fontSize: '13px',
                    fontWeight: 800,
                  }}
                >
                  {totalStatus}
                </text>
              </svg>
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              {statusData.map((item, i) => {
                const pct = totalStatus > 0 ? Math.round((item.count / totalStatus) * 100) : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-[11px] font-bold text-gray-600">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-black text-gray-900">{item.count}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
