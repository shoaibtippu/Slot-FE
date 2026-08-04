'use client';

import React, { useEffect, useState } from 'react';
import { parseJwt } from '@/lib/jwt';
import { NewDashboardSidebar } from '@/components/dashboard/NewDashboardSidebar';
import { MyGroundsHeader } from '@/components/dashboard/MyGroundsHeader';
import { MyGroundsGrid } from '@/components/dashboard/MyGroundsGrid';

export default function MyGroundsPage() {
  const [userName, setUserName] = useState('Ahmad Khan');

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
      {/* 1. Left Sidebar - Active tab "My Grounds" */}
      <NewDashboardSidebar activeTab="My Grounds" />

      {/* 2. Right Workspace Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <MyGroundsHeader userName={userName} />

        {/* Scrollable Main Facilities Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <MyGroundsGrid />
        </main>
      </div>
    </div>
  );
}
