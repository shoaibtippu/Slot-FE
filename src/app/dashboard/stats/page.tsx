'use client';

import React from 'react';
import { GroundSelectorBar } from '@/components/dashboard/GroundSelectorBar';
import { StatsCardsGrid } from '@/components/dashboard/StatsCardsGrid';
import { AnalyticsChartsSection } from '@/components/dashboard/AnalyticsChartsSection';
import { ReviewsSection } from '@/components/dashboard/ReviewsSection';

export default function GroundOwnerDashboardStatsPage() {
  return (
    <>
      {/* Ground Selector & CTA Bar */}
      <GroundSelectorBar />

      {/* 4 Metric Stats Cards */}
      <StatsCardsGrid />

      {/* 2 Analytics Charts Section (Weekly Bookings & Most Booked Sports) */}
      <AnalyticsChartsSection />

      {/* Latest Ground Reviews Section */}
      <ReviewsSection />

      {/* Dashboard Footer Note */}
      <footer className="pt-6 pb-2 text-center border-t border-gray-200/60">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          POWERED BY SLOT MANAGEMENT SUITE © 2024
        </p>
      </footer>
    </>
  );
}
