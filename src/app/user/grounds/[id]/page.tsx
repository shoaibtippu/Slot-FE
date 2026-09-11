'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Phone, ChevronLeft, CheckCircle2, ArrowRight, CalendarDays, ClipboardList, Clock } from 'lucide-react';
import { getGroundDetail, GroundDetail, GroundScheduleSlot } from '@/services/userGroundsService';
import { createBooking, UserBooking } from '@/services/userBookingsService';
import { GroundBookingCalendar } from '@/components/user/GroundBookingCalendar';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DURATION_OPTIONS = [1, 2, 3, 4]; // hours

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
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

// Add whole hours to a HH:mm:ss time string
function addHours(timeStr: string, hours: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMins = h * 60 + (m || 0) + hours * 60;
  const endH = Math.floor(totalMins / 60);
  const endM = totalMins % 60;
  return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;
}

// Generate 1-hour start-time slots from open to (close - 1h)
function generateHourlySlots(openTime: string, closeTime: string): string[] {
  const slots: string[] = [];
  let cur = timeToHours(openTime);
  const end = timeToHours(closeTime);
  while (cur < end - 0.5) {
    const h = Math.floor(cur);
    const m = Math.round((cur % 1) * 60);
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`);
    cur += 1;
  }
  return slots;
}

function todayScheduleFor(date: string, schedules: GroundScheduleSlot[]): GroundScheduleSlot | null {
  if (!date) return null;
  const dayName = DAYS[new Date(date + 'T00:00:00').getDay()];
  return schedules.find((s) => s.dayOfWeek === dayName) ?? null;
}

export default function GroundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  const [ground, setGround] = useState<GroundDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookingView, setBookingView] = useState<'calendar' | 'form'>('calendar');
  const [showBookingSection, setShowBookingSection] = useState(false);

  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1); // hours
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

  const schedule = ground && bookingDate ? todayScheduleFor(bookingDate, ground.schedules) : null;
  const hourlySlots = schedule?.isAvailable ? generateHourlySlots(schedule.openTime, schedule.closeTime) : [];

  // Filter valid start times for the selected duration
  const validStartSlots = schedule
    ? hourlySlots.filter((slot) => {
        const endT = addHours(slot, duration);
        return endT <= schedule.closeTime;
      })
    : [];

  // Recalculate endTime whenever startTime or duration changes
  const endTime = startTime ? addHours(startTime, duration) : '';

  const totalAmount = ground ? Math.round(duration * ground.hourlyRate) : 0;
  const advanceAmount = ground ? Math.round((totalAmount * ground.advancePercentage) / 100) : 0;

  const openBookingSection = (view: 'calendar' | 'form') => {
    setBookingView(view);
    setShowBookingSection(true);
    setTimeout(() => bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const resetBookingFields = () => {
    setStartTime('');
    setDuration(1);
    setBookingError(null);
  };

  const handleCalendarDateSelect = (dateStr: string) => {
    setBookingDate(dateStr);
    resetBookingFields();
  };

  const handleSubmitBooking = async () => {
    if (!bookingDate || !startTime) {
      setBookingError('Please select a date and start time.');
      return;
    }
    if (!endTime) {
      setBookingError('Could not calculate end time.');
      return;
    }
    setSubmitting(true);
    setBookingError(null);
    try {
      const res = await createBooking({
        groundId: id,
        bookingDate,
        startTime,
        endTime,
        notes: notes || undefined,
      });
      setBooking(res.booking);
      setShowBookingSection(false);
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
      <button type="button" onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer">
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
                <span key={s} className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100">{s}</span>
              ))}
            </div>
          )}

          {!booking && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => openBookingSection('calendar')} className="flex items-center gap-2 px-5 py-2.5 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer">
                <CalendarDays className="w-3.5 h-3.5" /> View Availability
              </button>
              <button type="button" onClick={() => openBookingSection('form')} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer">
                <ClipboardList className="w-3.5 h-3.5" /> Quick Book
              </button>
            </div>
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
            <div><p className="text-gray-500 font-medium">Date</p><p className="font-bold text-gray-900">{booking.bookingDate}</p></div>
            <div><p className="text-gray-500 font-medium">Time</p><p className="font-bold text-gray-900">{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</p></div>
            <div><p className="text-gray-500 font-medium">Total Amount</p><p className="font-bold text-gray-900">PKR {booking.totalAmount.toLocaleString()}</p></div>
            <div><p className="text-gray-500 font-medium">Advance Due</p><p className="font-bold text-emerald-700">PKR {booking.advanceAmount.toLocaleString()}</p></div>
          </div>
          <p className="text-xs text-gray-600">Awaiting owner approval. You&apos;ll be notified once the owner approves your request.</p>
          <a href="/user/bookings" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3327] hover:text-[#06241b] underline underline-offset-2">
            View in My Bookings <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Booking section */}
      {!booking && showBookingSection && (
        <div ref={bookingSectionRef} className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(['calendar', 'form'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => { setBookingView(v); resetBookingFields(); setBookingDate(''); }}
                className={`flex items-center gap-2 flex-1 justify-center py-3.5 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                  bookingView === v ? 'border-[#0b3327] text-[#0b3327] bg-[#0b3327]/3' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {v === 'calendar' ? <><CalendarDays className="w-3.5 h-3.5" /> Calendar View</> : <><ClipboardList className="w-3.5 h-3.5" /> Quick Book</>}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {/* Calendar tab */}
            {bookingView === 'calendar' && (
              <div className="space-y-5">
                <GroundBookingCalendar schedules={ground.schedules} selectedDate={bookingDate} onDateSelect={handleCalendarDateSelect} />

                {bookingDate && (
                  <div className="border-t border-gray-100 pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-gray-900">
                        {new Date(bookingDate + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </h4>
                      <button type="button" onClick={() => { setBookingDate(''); resetBookingFields(); }} className="text-[11px] font-bold text-gray-400 hover:text-gray-700 cursor-pointer">
                        Change date
                      </button>
                    </div>
                    <SlotPicker
                      schedule={schedule}
                      hourlySlots={hourlySlots}
                      validStartSlots={validStartSlots}
                      startTime={startTime}
                      duration={duration}
                      endTime={endTime}
                      ground={ground}
                      totalAmount={totalAmount}
                      advanceAmount={advanceAmount}
                      notes={notes}
                      bookingError={bookingError}
                      submitting={submitting}
                      dayName={DAYS[new Date(bookingDate + 'T00:00:00').getDay()]}
                      onStartTimeChange={(t) => { setStartTime(t); setBookingError(null); }}
                      onDurationChange={(d) => { setDuration(d); setStartTime(''); setBookingError(null); }}
                      onNotesChange={setNotes}
                      onSubmit={handleSubmitBooking}
                      onCancel={() => setShowBookingSection(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Quick book tab */}
            {bookingView === 'form' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => { setBookingDate(e.target.value); resetBookingFields(); }}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b3327]/20 focus:border-[#0b3327]"
                  />
                </div>

                {bookingDate && (
                  <SlotPicker
                    schedule={schedule}
                    hourlySlots={hourlySlots}
                    validStartSlots={validStartSlots}
                    startTime={startTime}
                    duration={duration}
                    endTime={endTime}
                    ground={ground}
                    totalAmount={totalAmount}
                    advanceAmount={advanceAmount}
                    notes={notes}
                    bookingError={bookingError}
                    submitting={submitting}
                    dayName={DAYS[new Date(bookingDate + 'T00:00:00').getDay()]}
                    onStartTimeChange={(t) => { setStartTime(t); setBookingError(null); }}
                    onDurationChange={(d) => { setDuration(d); setStartTime(''); setBookingError(null); }}
                    onNotesChange={setNotes}
                    onSubmit={handleSubmitBooking}
                    onCancel={() => setShowBookingSection(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule */}
      {ground.schedules.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-base font-extrabold text-gray-900">Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ground.schedules.map((s) => (
              <div key={s.dayOfWeek} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${s.isAvailable ? 'border-emerald-100 bg-emerald-50/50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                <span className="font-bold text-gray-800">{s.dayOfWeek}</span>
                {s.isAvailable ? (
                  <span className="text-emerald-700 font-medium">{formatTime(s.openTime)} – {formatTime(s.closeTime)}</span>
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

// ---------- SlotPicker sub-component ----------
interface SlotPickerProps {
  schedule: GroundScheduleSlot | null;
  hourlySlots: string[];
  validStartSlots: string[];
  startTime: string;
  duration: number;
  endTime: string;
  ground: GroundDetail;
  totalAmount: number;
  advanceAmount: number;
  notes: string;
  bookingError: string | null;
  submitting: boolean;
  dayName: string;
  onStartTimeChange: (t: string) => void;
  onDurationChange: (d: number) => void;
  onNotesChange: (n: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function SlotPicker({
  schedule, hourlySlots, validStartSlots, startTime, duration, endTime,
  ground, totalAmount, advanceAmount, notes, bookingError, submitting, dayName,
  onStartTimeChange, onDurationChange, onNotesChange, onSubmit, onCancel,
}: SlotPickerProps) {
  if (!schedule || !schedule.isAvailable) {
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
        Ground is closed on {dayName}s.
      </div>
    );
  }

  if (hourlySlots.length === 0) {
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
        No available time slots for this day.
      </div>
    );
  }

  // Valid durations for the selected start time
  const validDurations = schedule
    ? DURATION_OPTIONS.filter((d) => {
        if (!startTime) return true;
        return addHours(startTime, d) <= schedule.closeTime;
      })
    : DURATION_OPTIONS;

  return (
    <div className="space-y-4">
      {/* Duration picker */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700">Duration</label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDurationChange(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                duration === d
                  ? 'bg-[#0b3327] text-white border-[#0b3327]'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-[#0b3327] hover:text-[#0b3327]'
              }`}
            >
              {d}h
            </button>
          ))}
        </div>
      </div>

      {/* Start time slots */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700">
          Start Time
          <span className="ml-2 font-normal text-gray-400">{formatTime(schedule.openTime)} – {formatTime(schedule.closeTime)}</span>
        </label>
        {validStartSlots.length === 0 ? (
          <p className="text-xs text-amber-700 font-medium">No {duration}h slots available on this day.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {validStartSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onStartTimeChange(slot)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  startTime === slot
                    ? 'bg-[#0b3327] text-white border-[#0b3327] shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Clock className="w-3 h-3 opacity-60" />
                {formatTime(slot)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Booking summary */}
      {startTime && endTime && (
        <div className="bg-[#0b3327]/5 border border-[#0b3327]/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-900">
              {formatTime(startTime)} → {formatTime(endTime)}
            </span>
            <span className="font-bold text-gray-500">{duration}h · {validDurations.includes(duration) ? '' : <span className="text-red-600">Exceeds closing time</span>}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 border-t border-[#0b3327]/10 pt-3">
            <span>{duration}h × PKR {ground.hourlyRate.toLocaleString()}/hr</span>
            <span className="font-black text-gray-900">PKR {totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
            <span>Advance required ({ground.advancePercentage}%)</span>
            <span>PKR {advanceAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">Notes (optional)</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any special requirements…"
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b3327]/20 focus:border-[#0b3327] resize-none"
        />
      </div>

      {bookingError && <p className="text-xs text-red-600 font-medium">{bookingError}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || !startTime}
          className="flex-1 py-3 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit Booking Request'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
