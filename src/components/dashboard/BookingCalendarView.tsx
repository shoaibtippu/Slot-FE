'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  X,
  Calendar as CalendarIcon,
  Grid,
  ListFilter,
  Plus,
  MapPin,
  User,
} from 'lucide-react';
import { Booking, BookingStatus } from './BookingsList';

interface BookingCalendarViewProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Standard operational hours for ground timeline (6 AM to 11 PM)
const OPERATIONAL_HOURS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

const SPORT_ICONS: Record<string, string> = {
  Cricket: '🏏',
  Football: '⚽',
  Tennis: '🎾',
  Badminton: '🏸',
};

export const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({
  bookings,
  onSelectBooking,
  onUpdateStatus,
}) => {
  const [calendarSubMode, setCalendarSubMode] = useState<'month' | 'day'>('month');

  // Month & Year state (August 2024 sample)
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(7); // August (0-indexed = 7)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(10); // Default to Aug 10

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonthIndex(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonthIndex(m => m + 1);
    }
  };

  const handlePrevDay = () => {
    if (selectedDayNumber > 1) {
      setSelectedDayNumber(d => d - 1);
    }
  };

  const handleNextDay = () => {
    if (selectedDayNumber < 31) {
      setSelectedDayNumber(d => d + 1);
    }
  };

  // Generate days for Month view
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Find bookings for any day number
  const getBookingsForDay = (day: number) => {
    const monthPrefix = monthNames[currentMonthIndex].slice(0, 3);
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    return bookings.filter(b => {
      return (
        b.date.includes(`${monthPrefix} ${day}`) ||
        b.date.includes(`${monthPrefix} ${dayStr}`)
      );
    });
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Completed':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Selected Day's bookings for Day Timeline view
  const dayBookings = getBookingsForDay(selectedDayNumber);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-5">
      {/* ── Calendar Sub-Header & Mode Switcher ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              {calendarSubMode === 'month'
                ? `${monthNames[currentMonthIndex]} ${currentYear}`
                : `Daily Schedule Timeline: ${monthNames[currentMonthIndex]} ${selectedDayNumber}, ${currentYear}`}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {calendarSubMode === 'month'
                ? 'Monthly grid overview of ground reservations.'
                : 'Detailed hour-by-hour ground schedules, slots, and reservations.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sub-Mode Switcher: Month Grid vs Daily Timeline */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setCalendarSubMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                calendarSubMode === 'month'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Month Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setCalendarSubMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                calendarSubMode === 'day'
                  ? 'bg-[#0b3327] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Timeline</span>
            </button>
          </div>

          {/* Stepper Navigation */}
          {calendarSubMode === 'month' ? (
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-gray-700 min-w-[90px] text-center">
                {monthNames[currentMonthIndex]}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={handlePrevDay}
                className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-gray-700 min-w-[100px] text-center">
                Aug {selectedDayNumber}, 2024
              </span>
              <button
                type="button"
                onClick={handleNextDay}
                className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MODE 1: MONTH GRID VIEW ── */}
      {calendarSubMode === 'month' && (
        <div className="space-y-4">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-500 uppercase tracking-wider py-2 bg-gray-50 rounded-xl">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2 auto-rows-fr">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[110px] bg-gray-50/40 rounded-xl border border-dashed border-gray-100"
                  />
                );
              }

              const cellBookings = getBookingsForDay(day);
              const isToday = day === 10 && currentMonthIndex === 7 && currentYear === 2024;

              return (
                <div
                  key={day}
                  className={`min-h-[120px] p-2 rounded-xl border flex flex-col justify-start transition-all ${
                    isToday
                      ? 'bg-emerald-50/30 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDayNumber(day);
                        setCalendarSubMode('day');
                      }}
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-md hover:scale-105 transition-transform cursor-pointer ${
                        isToday
                          ? 'bg-[#0b3327] text-white shadow-2xs'
                          : 'text-gray-700 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                      title="Click to view detailed daily schedule timeline"
                    >
                      {day}
                    </button>

                    {cellBookings.length > 0 && (
                      <span className="text-[10px] font-bold text-gray-400">
                        {cellBookings.length} booking{cellBookings.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Cell Bookings */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-0.5">
                    {cellBookings.map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => onSelectBooking(booking)}
                        className={`group p-2 rounded-lg border text-left cursor-pointer transition-all hover:shadow-sm ${getStatusBadgeClass(
                          booking.status
                        )}`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="truncate max-w-[90px]">{booking.startTime}</span>
                          <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-white/70">
                            {booking.sport}
                          </span>
                        </div>
                        <p className="text-xs font-black truncate mt-0.5">
                          {booking.player.name}
                        </p>
                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-black/5">
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {booking.status}
                          </span>
                          {booking.status === 'Pending' ? (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                title="Accept Booking"
                                onClick={() => onUpdateStatus(booking.id, 'Confirmed')}
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                title="Decline Booking"
                                onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] font-bold opacity-75">
                              PKR {booking.totalPKR.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODE 2: DAILY SCHEDULE TIMELINE VIEW ── */}
      {calendarSubMode === 'day' && (
        <div className="space-y-4">
          {/* Day Summary Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Selected Date</p>
              <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                {monthNames[currentMonthIndex]} {selectedDayNumber}, {currentYear}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Daily Bookings</p>
              <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                {dayBookings.length} Slots Reserved
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Pending Requests</p>
              <p className="text-sm font-extrabold text-amber-700 mt-0.5">
                {dayBookings.filter(b => b.status === 'Pending').length} Pending Approval
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Day Revenue</p>
              <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                PKR {dayBookings.reduce((sum, b) => sum + b.totalPKR, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Operational Hours Timeline List */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white divide-y divide-gray-100">
            {OPERATIONAL_HOURS.map((hourStr) => {
              // Find matching bookings for this hour slot
              const matchingBookings = dayBookings.filter((b) => {
                const startHourNum = parseInt(b.startTime.split(':')[0], 10);
                const currentHourNum = parseInt(hourStr.split(':')[0], 10);
                const isPM = hourStr.includes('PM');
                const bIsPM = b.startTime.includes('PM');
                return startHourNum === currentHourNum && isPM === bIsPM;
              });

              return (
                <div
                  key={hourStr}
                  className="flex flex-col sm:flex-row items-stretch min-h-[72px] hover:bg-gray-50/50 transition-colors"
                >
                  {/* Left Column: Time Axis */}
                  <div className="w-full sm:w-36 bg-gray-50/80 px-4 py-3 border-r border-gray-200/80 flex items-center gap-2 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-extrabold text-gray-700">{hourStr}</span>
                  </div>

                  {/* Right Column: Bookings or Open Available Slot */}
                  <div className="flex-1 p-3 flex items-center">
                    {matchingBookings.length > 0 ? (
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                        {matchingBookings.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => onSelectBooking(b)}
                            className={`p-3 rounded-xl border flex items-center justify-between shadow-2xs cursor-pointer transition-all hover:shadow-md ${getStatusBadgeClass(
                              b.status
                            )}`}
                          >
                            <div className="space-y-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{SPORT_ICONS[b.sport]}</span>
                                <span className="text-xs font-black truncate">{b.player.name}</span>
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white/80 border border-black/10">
                                  {b.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-[11px] font-medium text-gray-700">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  {b.facility} {b.pitch ? `(${b.pitch})` : ''}
                                </span>
                                <span className="font-bold">
                                  {b.startTime} - {b.endTime} ({b.durationHrs}h)
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons or Financial summary */}
                            <div className="flex items-center gap-2 shrink-0">
                              {b.status === 'Pending' ? (
                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateStatus(b.id, 'Confirmed')}
                                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateStatus(b.id, 'Cancelled')}
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <div className="text-right">
                                  <p className="text-xs font-black text-gray-900">
                                    PKR {b.totalPKR.toLocaleString()}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-500">
                                    Adv: PKR {b.advancePKR.toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Open Available Slot Indicator */
                      <div className="w-full flex items-center justify-between text-xs text-gray-400 font-medium py-1 px-2 border border-dashed border-gray-200 rounded-xl bg-gray-50/20">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          Open Slot Available
                        </span>
                        <button
                          type="button"
                          onClick={() => alert(`Create custom walk-in booking for ${hourStr} on Aug ${selectedDayNumber}`)}
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> + Reserve Slot
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
