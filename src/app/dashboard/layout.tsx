'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-[#f8fafc] overflow-hidden font-sans">
      {/* 1. Generic Left Sidebar */}
      <DashboardSidebar />

      {/* 2. Generic Right Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <DashboardHeader />

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
