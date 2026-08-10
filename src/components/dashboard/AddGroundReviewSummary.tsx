'use client';

import React from 'react';
import { MapPin, Banknote, Clock, ShieldCheck, Images, CheckCircle2 } from 'lucide-react';
import { useAddGround } from '@/context/AddGroundContext';

const CANCELLATION_LABEL: Record<'no' | 'partial' | 'full', string> = {
  no: 'No refund',
  partial: 'Partial refund (50%)',
  full: 'Full refund',
};

export const AddGroundReviewSummary: React.FC = () => {
  const { data } = useAddGround();
  const { step1, step2 } = data;

  const activeDays = step2.schedule.filter((day) => day.enabled).length;

  return (
    <div className="divide-y divide-gray-100">
      {/* Ground Header / Cover */}
      <section className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
            {step1.photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={step1.photos[0]}
                alt={step1.groundName || 'Ground'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Images className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100/80 text-[#0b3327] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                {step1.facilityType}
              </span>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                {step1.primarySport}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight mt-2 truncate">
              {step1.groundName || 'Untitled Ground'}
            </h3>

            <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {step1.address ? `${step1.address}, ` : ''}
                {step1.city}
              </span>
            </p>

            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 mt-2">
              <Banknote className="w-4 h-4" />
              <span>
                {step2.currency} {step2.basePrice}
                <span className="text-[11px] font-semibold text-gray-400"> /hr</span>
              </span>
            </div>

            {step1.description && (
              <p className="text-xs text-gray-600 leading-relaxed mt-2 line-clamp-2">
                {step1.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Basic Info Details */}
      <section className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-[#0b3327]" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
            Basic Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <ReviewRow label="Facility Type" value={step1.facilityType} />
          <ReviewRow label="Primary Sport" value={step1.primarySport} />
          <ReviewRow
            label="Amenities"
            value={step1.amenities.length ? step1.amenities.join(', ') : '—'}
          />
          <ReviewRow
            label="Photos"
            value={step1.photos.length ? `${step1.photos.length} uploaded` : '—'}
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Banknote className="w-4 h-4 text-[#0b3327]" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
            Rates & Pricing
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <ReviewRow label={`Base Rate`} value={`${step2.currency} ${step2.basePrice}/hr`} />
          <ReviewRow
            label="Peak-Hour Pricing"
            value={
              step2.peakEnabled
                ? `${step2.currency} ${step2.peakPrice}/hr (${step2.peakStart} – ${step2.peakEnd})`
                : 'Disabled'
            }
          />
          <ReviewRow
            label="Sport-Specific Overrides"
            value={`Football ${step2.sportPrices.football}, Padel ${step2.sportPrices.padel}, Badminton ${step2.sportPrices.badminton}`}
          />
          <ReviewRow label="Minimum Booking" value={step2.minDuration} />
        </div>
      </section>

      {/* Availability */}
      <section className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0b3327]" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
            Availability
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
          {step2.schedule.map((day) => (
            <div
              key={day.day}
              className={`
                rounded-xl border p-2 text-center
                ${day.enabled
                  ? 'border-emerald-100 bg-emerald-50/50'
                  : 'border-gray-200 bg-gray-50 opacity-50'
                }
              `}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                {day.day.slice(0, 3)}
              </p>
              {day.enabled ? (
                <p className="text-[10px] font-semibold text-gray-800 mt-0.5">
                  {day.openTime}
                  <br />
                  {day.closeTime}
                </p>
              ) : (
                <p className="text-[10px] font-medium text-gray-400 mt-1">Closed</p>
              )}
            </div>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 font-medium">
          Open {activeDays} of 7 days per week.
        </p>
      </section>

      {/* Booking Policies */}
      <section className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0b3327]" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
            Booking Policies
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <ReviewRow label="Advance Payment" value={`${step2.advancePercent}% deposit`} />
          <ReviewRow label="Cancellation Policy" value={CANCELLATION_LABEL[step2.cancellationPolicy]} />
        </div>

        {step2.blackouts.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {step2.blackouts.map((item) => (
              <span
                key={item.id}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${item.colorClass}`}
              >
                {item.name} · {item.dateRange}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Confirm Banner */}
      <section className="p-5 sm:p-6 bg-emerald-50/40">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-gray-900">
              Ready to publish your ground
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Review the details above. Once published, customers will be able to view and book
              your ground immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ReviewRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 shrink-0">
        {label}
      </span>
      <span className="text-xs font-bold text-gray-800 text-right">{value}</span>
    </div>
  );
};