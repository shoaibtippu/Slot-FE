'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { getMyBookings, cancelBooking, bookingStatusLabel, UserBooking } from '@/services/userBookingsService';
import { AdvancePaymentModal } from '@/components/user/AdvancePaymentModal';

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: <AlertCircle className="w-3 h-3" /> },
  Approved:  { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 className="w-3 h-3" /> },
  Rejected:  { bg: 'bg-red-50',     text: 'text-red-600',     icon: <XCircle className="w-3 h-3" /> },
  Cancelled: { bg: 'bg-gray-50',    text: 'text-gray-500',    icon: <XCircle className="w-3 h-3" /> },
  Confirmed: { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: <CheckCircle2 className="w-3 h-3" /> },
};

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function displayLabel(status: number): string {
  if (status === 5) return 'Confirmed';
  return bookingStatusLabel(status);
}

function BookingCard({
  booking,
  onCancel,
  onPayAdvance,
}: {
  booking: UserBooking;
  onCancel: (id: string) => void;
  onPayAdvance: (booking: UserBooking) => void;
}) {
  const label = displayLabel(booking.status);
  const cfg = STATUS_CONFIG[label] ?? STATUS_CONFIG.Pending;
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(true);
    try {
      await onCancel(booking.id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold text-gray-900 truncate">{booking.groundName ?? 'Ground'}</h3>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{booking.bookingDate}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</span>
            </div>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${cfg.bg} ${cfg.text}`}>
          {cfg.icon} {label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] text-gray-400 font-medium">Total</p>
          <p className="text-xs font-black text-gray-900">PKR {booking.totalAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-medium">Advance</p>
          <p className="text-xs font-black text-emerald-700">PKR {booking.advanceAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-medium">Remaining</p>
          <p className="text-xs font-black text-gray-700">PKR {booking.remainingAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Pay advance — only for Approved bookings */}
        {booking.status === 2 && (
          <button
            type="button"
            onClick={() => onPayAdvance(booking)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#0b3327] hover:bg-[#06241b] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pay Advance — PKR {booking.advanceAmount.toLocaleString()}
          </button>
        )}

        {/* Cancel — only for Pending bookings */}
        {booking.status === 1 && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelling ? 'Cancelling…' : 'Cancel Booking'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [paymentBooking, setPaymentBooking] = useState<UserBooking | null>(null);

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 4 } : b)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking.');
    }
  };

  const handlePaymentSuccess = (bookingId: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 5 } : b)));
  };

  const FILTER_LABELS = ['all', 'Pending', 'Approved', 'Confirmed', 'Cancelled', 'Rejected'];

  const filtered =
    filter === 'all'
      ? bookings
      : bookings.filter((b) => displayLabel(b.status) === filter);

  const countFor = (f: string) =>
    bookings.filter((b) => displayLabel(b.status) === f).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track all your ground bookings and their status.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_LABELS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f ? 'bg-[#0b3327] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f}
            {f !== 'all' && (
              <span className="ml-1.5 opacity-70">({countFor(f)})</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">{error}</div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 space-y-2">
          <Calendar className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm font-semibold">
            {bookings.length === 0 ? 'No bookings yet.' : 'No bookings match this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={handleCancel}
              onPayAdvance={setPaymentBooking}
            />
          ))}
        </div>
      )}

      {paymentBooking && (
        <AdvancePaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onSuccess={(id) => {
            handlePaymentSuccess(id);
            setPaymentBooking(null);
          }}
        />
      )}
    </div>
  );
}
