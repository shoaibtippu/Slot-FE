'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  CreditCard,
  MapPin,
  CalendarDays,
  Phone,
  Hash,
  ReceiptText,
  LayoutList,
  Calendar as CalendarIcon,
  Check,
  X,
} from 'lucide-react';
import { SideDrawer } from '../common/SideDrawer';
import { BookingCalendarView } from './BookingCalendarView';

export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

export interface Booking {
  id: string;
  player: { name: string; role: string; initials: string; avatarColor: string; phone?: string };
  facility: string;
  pitch?: string;
  sport: 'Cricket' | 'Football' | 'Tennis' | 'Badminton';
  date: string;
  startTime: string;
  endTime: string;
  durationHrs: number;
  totalPKR: number;
  advancePKR: number;
  advancePaid: boolean;
  status: BookingStatus;
}

const GROUNDS = [
  'All Facilities',
  'Green Valley Cricket Ground',
  'Elite Arena',
  'City Sports Complex',
  'North Lahore Ground',
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-0042',
    player: { name: 'James Duckworth', role: '4.8 · Regular', initials: 'JD', avatarColor: 'bg-blue-100 text-blue-700', phone: '+92 300 9876543' },
    facility: 'Elite Arena', pitch: 'Pitch A', sport: 'Cricket',
    date: 'Aug 10, 2024', startTime: '06:00 PM', endTime: '08:00 PM', durationHrs: 2,
    totalPKR: 5000, advancePKR: 1500, advancePaid: true, status: 'Confirmed',
  },
  {
    id: 'BK-0043',
    player: { name: 'Salman Ali', role: 'Regular Player', initials: 'SA', avatarColor: 'bg-emerald-100 text-emerald-700', phone: '+92 301 2345678' },
    facility: 'Green Valley Main', pitch: undefined, sport: 'Football',
    date: 'Aug 12, 2024', startTime: '09:00 PM', endTime: '09:30 PM', durationHrs: 0.5,
    totalPKR: 3500, advancePKR: 1000, advancePaid: false, status: 'Pending',
  },
  {
    id: 'BK-0044',
    player: { name: 'Ayesha Tariq', role: 'New User', initials: 'AT', avatarColor: 'bg-purple-100 text-purple-700', phone: '+92 321 8765432' },
    facility: 'City Sports Complex', pitch: 'Court 2', sport: 'Tennis',
    date: 'Aug 14, 2024', startTime: '10:00 AM', endTime: '11:00 AM', durationHrs: 1,
    totalPKR: 2000, advancePKR: 500, advancePaid: true, status: 'Completed',
  },
  {
    id: 'BK-0045',
    player: { name: 'Hamza Malik', role: 'Regular Player', initials: 'HM', avatarColor: 'bg-amber-100 text-amber-700', phone: '+92 333 4567890' },
    facility: 'Elite Arena', pitch: 'Pitch B', sport: 'Cricket',
    date: 'Aug 15, 2024', startTime: '04:00 PM', endTime: '07:00 PM', durationHrs: 3,
    totalPKR: 7500, advancePKR: 2500, advancePaid: false, status: 'Cancelled',
  },
  {
    id: 'BK-0046',
    player: { name: 'Omar Farooq', role: 'Captain', initials: 'OF', avatarColor: 'bg-rose-100 text-rose-700', phone: '+92 345 6789012' },
    facility: 'Green Valley Main', pitch: undefined, sport: 'Football',
    date: 'Aug 18, 2024', startTime: '08:00 PM', endTime: '10:00 PM', durationHrs: 2,
    totalPKR: 4500, advancePKR: 1500, advancePaid: false, status: 'Pending',
  },
  {
    id: 'BK-0047',
    player: { name: 'Zainab Bibi', role: 'New User', initials: 'ZB', avatarColor: 'bg-indigo-100 text-indigo-700', phone: '+92 312 9012345' },
    facility: 'City Sports Complex', pitch: 'Court 1', sport: 'Badminton',
    date: 'Aug 10, 2024', startTime: '02:00 PM', endTime: '04:00 PM', durationHrs: 2,
    totalPKR: 3000, advancePKR: 1000, advancePaid: true, status: 'Confirmed',
  },
];

const SPORT_ICONS: Record<string, string> = {
  Cricket: '🏏',
  Football: '⚽',
  Tennis: '🎾',
  Badminton: '🏸',
};

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; icon: React.ReactNode }> = {
  Confirmed: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
  Pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border border-amber-200',     icon: <Clock className="w-3 h-3" /> },
  Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border border-red-200',           icon: <XCircle className="w-3 h-3" /> },
  Completed: { label: 'Completed', className: 'bg-sky-50 text-sky-700 border border-sky-200',           icon: <CheckCircle className="w-3 h-3" /> },
};

const TABS = ['All Bookings', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const TAB_BADGE: Record<string, string> = {
  'All Bookings': 'bg-gray-100 text-gray-700',
  Pending:        'bg-amber-100 text-amber-800',
  Confirmed:      'bg-emerald-100 text-emerald-800',
  Completed:      'bg-sky-100 text-sky-800',
  Cancelled:      'bg-red-100 text-red-800',
};

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

export const BookingsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [bookingsList, setBookingsList] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [selectedGround, setSelectedGround] = useState(GROUNDS[0]);
  const [groundOpen, setGroundOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState<string | null>(null);

  // SideDrawer selected booking
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const groundRef = useRef<HTMLDivElement>(null);
  useClickOutside(groundRef, () => setGroundOpen(false));

  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredByGround =
    selectedGround === 'All Facilities'
      ? bookingsList
      : bookingsList.filter((b) => b.facility.includes(selectedGround.split(' ')[0]));

  const filtered =
    activeTab === 'All Bookings'
      ? filteredByGround
      : filteredByGround.filter((b) => b.status === activeTab);

  const tabCount = (t: string) =>
    t === 'All Bookings'
      ? filteredByGround.length
      : filteredByGround.filter((b) => b.status === t).length;

  const revenue = filtered.reduce((s, b) => s + b.totalPKR, 0);

  const COL = '56px 1fr 150px 195px 175px 135px 170px';

  return (
    <div className="w-full space-y-5 relative">
      {/* ── Top Header Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ground Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and track all facility <span className="text-emerald-600 font-medium">reservations</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Toggle Button: List vs Calendar */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-[#0b3327] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar View</span>
            </button>
          </div>

          {/* Facility Filter Dropdown */}
          <div ref={groundRef} className="relative">
            <button
              type="button"
              onClick={() => setGroundOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-emerald-500 transition-colors cursor-pointer shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="max-w-[150px] truncate">{selectedGround}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
                  groundOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {groundOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1">
                {GROUNDS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setSelectedGround(g);
                      setGroundOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                      g === selectedGround
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">{g}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Status Filter Tabs ── */}
      <div className="flex items-center border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none ${TAB_BADGE[tab]}`}
            >
              {tabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Revenue Summary Banner ── */}
      <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-2xs">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Total Filtered Revenue
          </p>
          <p className="text-base font-black text-gray-900">
            PKR {revenue.toLocaleString()}
          </p>
        </div>
        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
          <Wallet className="w-4 h-4" />
        </div>
      </div>

      {/* ── VIEW SWITCH: LIST VS CALENDAR ── */}
      {viewMode === 'calendar' ? (
        /* CALENDAR VIEW */
        <BookingCalendarView
          bookings={filtered}
          onSelectBooking={(b) => setSelectedBooking(b)}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        /* LIST VIEW TABLE */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
          <div
            className="grid px-5 py-3 bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: COL }}
          >
            <span>ID</span>
            <span>Player</span>
            <span>Facility / Sport</span>
            <span>Date &amp; Time</span>
            <span>Financials</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs font-semibold">
              No bookings found for the selected criteria.
            </div>
          ) : (
            filtered.map((b, idx) => {
              const st = STATUS_CONFIG[b.status];
              return (
                <div
                  key={b.id}
                  className={`grid px-5 py-4 items-center hover:bg-gray-50/60 transition-colors ${
                    idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  style={{ gridTemplateColumns: COL }}
                >
                  <span className="text-xs font-bold text-gray-400">
                    #{b.id.split('-')[1]}
                  </span>

                  {/* Player Info */}
                  <div className="flex items-center gap-2.5 min-w-0 pr-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${b.player.avatarColor}`}
                    >
                      {b.player.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {b.player.name}
                      </p>
                      <p className="text-xs text-gray-400 font-medium truncate">
                        {b.player.role}
                      </p>
                    </div>
                  </div>

                  {/* Facility */}
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {b.facility}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <span>{SPORT_ICONS[b.sport]}</span>
                      <span>{b.sport}</span>
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div className="pr-3">
                    <p className="text-sm font-semibold text-gray-800">{b.date}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <span className="whitespace-nowrap">
                        {b.startTime} – {b.endTime}
                      </span>
                    </p>
                  </div>

                  {/* Financials */}
                  <div className="pr-3">
                    <p className="text-sm font-extrabold text-gray-900">
                      PKR {b.totalPKR.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <span>Adv: PKR {b.advancePKR.toLocaleString()}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          b.advancePaid
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {b.advancePaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${st.className}`}
                    >
                      {st.icon}
                      {st.label}
                    </span>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1 justify-end">
                    {/* Quick Accept/Decline for Pending */}
                    {b.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          title="Accept Booking"
                          onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                          className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Decline Booking"
                          onClick={() => handleUpdateStatus(b.id, 'Cancelled')}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      title="View Details"
                      onClick={() => setSelectedBooking(b)}
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        title="More options"
                        onClick={() =>
                          setMoreOpen(moreOpen === b.id ? null : b.id)
                        }
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {moreOpen === b.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(b.id, 'Confirmed');
                              setMoreOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-700"
                          >
                            Mark Confirmed
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(b.id, 'Completed');
                              setMoreOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-sky-50 text-sky-700"
                          >
                            Mark Completed
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(b.id, 'Cancelled');
                              setMoreOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Generic SideDrawer for Viewing & Accepting Bookings ── */}
      <SideDrawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        headerRight={
          selectedBooking && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                STATUS_CONFIG[selectedBooking.status].className
              }`}
            >
              {STATUS_CONFIG[selectedBooking.status].icon}
              {selectedBooking.status}
            </div>
          )
        }
        footer={
          selectedBooking && (
            <div className="grid grid-cols-2 gap-3 w-full">
              {selectedBooking.status === 'Pending' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Confirmed')}
                    className="w-full py-2.5 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Accept Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                    className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    Decline Booking
                  </button>
                </>
              ) : selectedBooking.status === 'Confirmed' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Completed')}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Mark Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                    className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="col-span-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Close Window
                </button>
              )}
            </div>
          )
        }
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* User Profile */}
            <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${selectedBooking.player.avatarColor}`}
                >
                  {selectedBooking.player.initials}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">
                    {selectedBooking.player.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {selectedBooking.player.phone || '+92 300 0000000'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Calling ${selectedBooking.player.name}...`)}
                  className="w-8 h-8 flex items-center justify-center bg-white hover:bg-emerald-50 text-emerald-700 border border-gray-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Opening chat with ${selectedBooking.player.name}...`)}
                  className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                Reservation Details
              </h4>
              <div className="bg-white border border-gray-200/80 shadow-2xs rounded-2xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Facility & Pitch
                    </p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      {selectedBooking.facility}
                    </p>
                    {selectedBooking.pitch && (
                      <p className="text-[11px] text-gray-500">{selectedBooking.pitch}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium">Date & Time</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      {selectedBooking.date}
                    </p>
                    <div className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-md mt-1">
                      {selectedBooking.startTime} – {selectedBooking.endTime} (
                      {selectedBooking.durationHrs} hrs)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium">Booking Reference</p>
                    <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                      #{selectedBooking.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                Payment Breakdown
              </h4>
              <div className="bg-white border border-gray-200/80 shadow-2xs rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span>
                    Total Fee ({selectedBooking.durationHrs} hrs)
                  </span>
                  <span className="font-bold text-gray-900">
                    PKR {selectedBooking.totalPKR.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>Advance Payment</span>
                  <span
                    className={`font-bold ${
                      selectedBooking.advancePaid ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    PKR {selectedBooking.advancePKR.toLocaleString()} ({selectedBooking.advancePaid ? 'Paid' : 'Unpaid'})
                  </span>
                </div>

                <div className="h-px bg-gray-100 w-full" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Remaining Balance</span>
                  <span className="text-sm font-black text-rose-600">
                    PKR {(selectedBooking.totalPKR - selectedBooking.advancePKR).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SideDrawer>
    </div>
  );
};