import React from 'react';
import { NewDashboardSidebar } from '@/components/dashboard/NewDashboardSidebar';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { BookingsList } from '@/components/dashboard/BookingsList';
 
export default function BookingsPage() {
  return (
    <div className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-[#f8fafc] overflow-hidden font-sans">
      <NewDashboardSidebar activeTab="Bookings" />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <NewDashboardHeader userName="" />
        {/* No <h1> here — BookingsList renders its own "Bookings" heading */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <BookingsList />
        </main>
      </div>
    </div>
  );
}
 