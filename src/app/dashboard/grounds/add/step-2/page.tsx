'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AddGroundLayout } from '@/components/dashboard/AddGroundLayout';
import { BasePricingCard } from '@/components/dashboard/BasePricingCard';
import { PeakHourPricingCard } from '@/components/dashboard/PeakHourPricingCard';
import { SportSpecificPricingCard } from '@/components/dashboard/SportSpecificPricingCard';
import { WeeklyScheduleBuilder } from '@/components/dashboard/WeeklyScheduleBuilder';
import { AdvancePaymentCard } from '@/components/dashboard/AdvancePaymentCard';
import { CancellationPolicyCard } from '@/components/dashboard/CancellationPolicyCard';
import { BookingThresholdCard } from '@/components/dashboard/BookingThresholdCard';
import { BlackoutDatesCard } from '@/components/dashboard/BlackoutDatesCard';

const SectionHeading: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  return (
    <div className="pt-1 first:pt-0">
      <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{sub}</p>
    </div>
  );
};

export default function AddGroundStep2Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/dashboard/grounds/add/step-3');
  };

  return (
    <AddGroundLayout
      currentStep={2}
      onNext={handleNext}
      containerClassName="w-4/5 max-w-7xl mx-auto space-y-6"
      contentClassName="bg-[#f8fafc] p-5 sm:p-6"
    >
      <div className="space-y-6">
        {/* Rates & Pricing */}
        <SectionHeading
          title="Rates & Pricing"
          sub="Set your standard, peak, and per-sport hourly rates for the facility."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BasePricingCard />
          <PeakHourPricingCard />
          <SportSpecificPricingCard />
        </div>

        {/* Operating Hours */}
        <SectionHeading
          title="Operating Hours"
          sub="Define when customers can book slots at your facility each week."
        />
        <WeeklyScheduleBuilder />

        {/* Advanced Settings */}
        <SectionHeading
          title="Advanced Settings"
          sub="Configure deposits, cancellation rules, and slot management preferences."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <AdvancePaymentCard />
          <CancellationPolicyCard />
          <BookingThresholdCard />
          <BlackoutDatesCard />
        </div>
      </div>
    </AddGroundLayout>
  );
}