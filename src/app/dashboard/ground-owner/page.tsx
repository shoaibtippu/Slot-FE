'use client';

import React, { useEffect, useState } from 'react';
import { parseJwt } from '@/lib/jwt';
import { NewDashboardSidebar } from '@/components/dashboard/NewDashboardSidebar';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { GroundSelectorBar } from '@/components/dashboard/GroundSelectorBar';
import { StatsCardsGrid } from '@/components/dashboard/StatsCardsGrid';
import { AnalyticsChartsSection } from '@/components/dashboard/AnalyticsChartsSection';
import { ReviewsSection } from '@/components/dashboard/ReviewsSection';

export default function GroundOwnerDashboardPage() {
  const [userName, setUserName] = useState('Alex');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('slot_auth_token');
      if (token) {
        const claims = parseJwt(token);
        if (claims && claims.email) {
          const emailName = claims.email.split('@')[0];
          const formattedName = emailName.split('.')[0];
          setUserName(formattedName.charAt(0).toUpperCase() + formattedName.slice(1));
        }
      }
    }
  }, []);

  return (
    <div className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-[#f8fafc] overflow-hidden font-sans">
      {/* 1. Left Sidebar - Spans Full Viewport Height */}
      <NewDashboardSidebar activeTab="Dashboard" />

      {/* 2. Right Workspace Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <NewDashboardHeader userName={userName} />

        {/* Scrollable Main Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Ground Selector & + New Booking CTA Bar */}
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
        </main>
      </div>
    </div>
  );
}
