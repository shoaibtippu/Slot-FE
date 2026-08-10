'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actions,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const userName = user?.name || 'Owner';

  const getPageMeta = () => {
    if (title) return { heading: title, sub: subtitle || '' };

    if (pathname.includes('/stats')) {
      return {
        heading: `Good morning, ${userName}`,
        sub: "Here's what's happening today at your facilities.",
      };
    }
    if (pathname.includes('/grounds')) {
      return {
        heading: 'My Grounds',
        sub: 'Manage and update your sports facilities and availability.',
      };
    }
    if (pathname.includes('/bookings')) {
      return {
        heading: 'Bookings',
        sub: 'View, filter, and track all incoming ground reservations.',
      };
    }
    if (pathname.includes('/settings')) {
      return {
        heading: 'Account Settings',
        sub: 'Manage your profile preferences, notifications, and credentials.',
      };
    }

    return {
      heading: `Welcome back, ${userName}`,
      sub: 'Facility Management System',
    };
  };

  const pageMeta = getPageMeta();

  return (
    <header className="w-full bg-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-gray-100 shrink-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          {pageMeta.heading}
        </h1>
        {pageMeta.sub && (
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{pageMeta.sub}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actions}

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900">{userName}</p>
            <p className="text-[11px] text-gray-500 font-medium truncate max-w-[120px]">
              {user?.email || 'Owner Portal'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-2xs flex items-center justify-center bg-[#0b3327] text-white">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
