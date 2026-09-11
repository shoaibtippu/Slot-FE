'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Phone, ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { getGroundDetail, GroundDetail } from '@/services/userGroundsService';
import { createBooking, UserBooking } from '@/services/userBookingsService';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

function timeToHours(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function generateHalfHourSlots(openTime: string, closeTime: string): string[] {
  const slots: string[] = [];
  let cur = timeToHours(openTime);
  const end = timeToHours(closeTime);
  while (cur < end) {
    const h = Math.floor(cur);
    const mins = Math.round((cur % 1) * 60);
    slots.push(`${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`);
    cur += 0.5;
  }
  return slots;
}

export default function GroundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ground, setGround] = useState<GroundDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [booking, setBooking] = useState<UserBooking | null>(null);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    getGroundDetail(id)
      .then(setGround)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const todaySchedule =
    ground && bookingDate
      ? ground.schedules.find((s) => s.dayOfWeek === DAYS[new Date(bookingDate + 'T00:00:00').getDay()])
      : null;

  const timeSlots =
    todaySchedule && todaySchedule.isAvailable
      ? generateHalfHourSlots(todaySchedule.openTime, todaySchedule.closeTime)
      : [];

  const durationHrs =
    startTime && endTime ? Math.max(0, timeToHours(endTime) - timeToHours(startTime)) : 0;
  const totalAmount = ground ? Math.round(durationHrs * ground.hourlyRate) : 0;
  const advanceAmount = ground ? Math.round(totalAmount * ground.advancePercentage / 100) : 0;

  const handleSubmitBooking = async () => {
    if (!bookingDate || !startTime || !endTime) {
      setBookingError('Please select date, start time, and end time.');
      return;
    }
    if (durationHrs <= 0) {
      setBookingError('End time must be after start time.');
      return;
    }
    setSubmitting(true);
    setBookingError(null);
    try {
      const res = await createBooking({ groundId: id, bookingDate, startTime, endTime, notes: notes || undefined });
      setBooking(res.booking);
      setShowBookingForm(false);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error || !ground) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
        {error ?? 'Ground not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="h-56 bg-gradient-to-br from-emerald-800 to-emerald-600 relative">
          {ground.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ground.images[0]} alt={ground.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-16 h-16 text-emerald-200/40" />
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{ground.name}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs">{[ground.location, ground.city].filter(Boolean).join(', ')}</span>
              </div>
              {ground.phoneNumber && (
                <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">{ground.phoneNumber}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">
                PKR {ground.hourlyRate.toLocaleString()}
                <span className="text-xs font-medium text-gray-400">/hr</span>
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <StarRating rating={ground.averageRating} />
                <span className="text-xs text-gray-500">({ground.totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          {ground.description && (
            <p className="text-xs text-gray-600 leading-relaxed">{ground.description}</p>
          )}

          {ground.sports.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ground.sports.map((s) => (
                <span
                  key={s}
                  className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {!booking && (
            <button
              type="button"
              onClick={() => setShowBookingForm(true)}
              className="w-full sm:w-auto px-6 py-3 bg-[#0b3327] hover:bg-[#06241b] text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
            >
              Book This Ground
            </button>
          )}
        </div>
      </div>

      {/* Booking success */}
      {booking && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <h3 className="text-base font-extrabold text-emerald-800">Booking Request Submitted!</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500 font-medium">Date</p>
              <p className="font-bold text-gray-900">{booking.bookingDate}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Time</p>
              <p className="font-bold text-gray-900">
                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Total Amount</p>
              <p className="font-bold text-gray-900">PKR {booking.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Advance Due</p>
              <p className="font-bold text-emerald-700">PKR {booking.advanceAmount.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Awaiting owner approval. You&apos;ll be notified once the owner approves your request.
          </p>
          <a
            href="/user/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3327] hover:text-[#06241b] underline underline-offset-2"
          >
            View in My Bookings <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Booking form */}
      {showBookingForm && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-5">
          <h3 className="text-base font-extrabold text-gray-900">Book This Ground</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={bookingDate}
              onChange={(e) => { setBookingDate(e.target.value); setStartTime(''); setEndTime(''); }}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
            />
          </div>

          {bookingDate && timeSlots.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
              Ground is not available on {DAYS[new Date(bookingDate + 'T00:00:00').getDay()]}s.
            </div>
          )}

          {timeSlots.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Start Time</label>
                <select
                  value={startTime}
                  onChange={(e) => { setStartTime(e.target.value); setEndTime(''); }}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white"
                >
                  <option value="">Select start time</option>
                  {timeSlots.map((s) => <option key={s} value={s}>{formatTime(s)}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">End Time</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={!startTime}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white disabled:opacity-50"
                >
                  <option value="">Select end time</option>
                  {timeSlots.filter((s) => s > startTime).map((s) => <option key={s} value={s}>{formatTime(s)}</option>)}
                </select>
              </div>
            </div>
          )}

          {durationHrs > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-gray-700">Price Breakdown</h4>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{durationHrs} hr × PKR {ground.hourlyRate.toLocaleString()}/hr</span>
                <span className="font-bold">PKR {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-bold border-t border-gray-200 pt-2">
                <span>Advance Required ({ground.advancePercentage}%)</span>
                <span>PKR {advanceAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Notes (optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements…"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-none"
            />
          </div>

          {bookingError && <p className="text-xs text-red-600 font-medium">{bookingError}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmitBooking}
              disabled={submitting || durationHrs <= 0}
              className="flex-1 py-3 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit Booking Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="px-5 py-3 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedule */}
      {ground.schedules.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-base font-extrabold text-gray-900">Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ground.schedules.map((s) => (
              <div
                key={s.dayOfWeek}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                  s.isAvailable ? 'border-emerald-100 bg-emerald-50/50' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <span className="font-bold text-gray-800">{s.dayOfWeek}</span>
                {s.isAvailable ? (
                  <span className="text-emerald-700 font-medium">
                    {formatTime(s.openTime)} – {formatTime(s.closeTime)}
                  </span>
                ) : (
                  <span className="text-gray-400 font-medium">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {ground.reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-base font-extrabold text-gray-900">Reviews</h3>
          <div className="space-y-3">
            {ground.reviews.slice(0, 5).map((r) => (
              <div key={r.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                      {r.userEmail?.substring(0, 2).toUpperCase() ?? 'AN'}
                    </div>
                    <span className="text-xs font-bold text-gray-800">{r.userEmail ?? 'Anonymous'}</span>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                {r.comment && <p className="text-xs text-gray-600 italic">&ldquo;{r.comment}&rdquo;</p>}
                {r.reply && (
                  <div className="ml-4 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-[10px] font-bold text-emerald-700 mb-0.5">Owner Reply</p>
                    <p className="text-xs text-gray-700">{r.reply.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
