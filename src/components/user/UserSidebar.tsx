'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Bell, MessageSquare, Settings, LogOut, MapPin, Menu, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/context/AuthContext';
import { getNotifications } from '@/services/notificationsService';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Browse Grounds', icon: MapPin, href: '/user/home' },
  { label: 'My Bookings', icon: Calendar, href: '/user/bookings' },
  { label: 'Notifications', icon: Bell, href: '/user/notifications' },
  { label: 'Messages', icon: MessageSquare, href: '/user/messages' },
  { label: 'Settings', icon: Settings, href: '/user/settings' },
];

export const UserSidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getNotifications()
      .then((res) => setUnreadCount(res.notifications.filter((n) => !n.isRead).length))
      .catch(() => {});
  }, []);

  const sidebarContent = (
    <aside className="w-64 h-full bg-[#f3f7fc] border-r border-gray-200/80 flex flex-col justify-between p-6 shrink-0 select-none">
      <div className="space-y-8">
        {/* Brand */}
        <div className="space-y-2">
          <Logo size="md" variant="dark" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
            PLAYER PORTAL
          </p>
        </div>

        {/* Nav */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/user/home' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#a7f3d0]/70 text-[#0b3327] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-4.5 h-4.5 ${isActive ? 'text-[#0b3327]' : 'text-gray-500'}`}
                  />
                  {item.label === 'Notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info + logout */}
      <div className="pt-6 border-t border-gray-200/80 space-y-3">
        {user?.email && (
          <div className="px-1">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-xs font-bold text-gray-700 truncate mt-0.5">{user.email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex">{sidebarContent}</div>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-[#0b3327] text-white rounded-xl shadow-lg cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {sidebarContent}
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white rounded-xl text-gray-700 cursor-pointer shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
