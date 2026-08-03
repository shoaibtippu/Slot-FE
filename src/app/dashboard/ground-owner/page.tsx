'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRoleFromToken, parseJwt } from '@/lib/jwt';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { WeeklyScheduleBuilder } from '@/components/dashboard/WeeklyScheduleBuilder';
import { BookingThresholdCard } from '@/components/dashboard/BookingThresholdCard';
import { BlackoutDatesCard } from '@/components/dashboard/BlackoutDatesCard';
import { ScheduleHealthCard } from '@/components/dashboard/ScheduleHealthCard';
import { DashboardFooterBar } from '@/components/dashboard/DashboardFooterBar';
import { ChevronRight } from 'lucide-react';

export default function GroundOwnerDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('John Doe');
  const [userRole, setUserRole] = useState('Ground Owner');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('slot_auth_token');
      if (token) {
        const claims = parseJwt(token);
        if (claims) {
          if (claims.email) {
            const emailName = claims.email.split('@')[0];
            setUserName(emailName.replace('.', ' '));
          }
          const role = getUserRoleFromToken(token);
          if (role) {
            setUserRole(role === 'GroundOwner' ? 'Ground Owner' : role);
          }
        }
      }
    }
  }, []);

  return (
    <div className="h-screen w-screen max-h-screen max-w-vw flex flex-col bg-[#f8fafc] overflow-hidden font-sans">
      {/* Top Navigation Header Bar */}
      <DashboardHeader />

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar userName={userName} userRole={userRole} activeTab="Dashboard" />

        {/* Main Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span className="hover:text-gray-900 cursor-pointer">Ground Setup</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Weekly Schedule Builder</span>
          </nav>

          {/* Page Heading & Subtitle */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Define Your Operating Hours
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
              Set up your standard weekly availability. You can override specific times for different sports or block out certain dates below.
            </p>
          </div>

          {/* 2-Column Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Weekly Schedule Builder */}
            <div className="lg:col-span-2 space-y-6">
              <WeeklyScheduleBuilder />
            </div>

            {/* Right 1 Column: Cards (Threshold, Blackout Dates, Health) */}
            <div className="space-y-6">
              <BookingThresholdCard />
              <BlackoutDatesCard />
              <ScheduleHealthCard completedDays={5} totalDays={7} />
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Sticky Action Bar */}
      <DashboardFooterBar
        onBackClick={() => router.push('/')}
        onSaveDraftClick={() => alert('Schedule saved as draft!')}
        onContinueClick={() => alert('Proceeding to Pricing configuration...')}
      />
    </div>
  );
};
