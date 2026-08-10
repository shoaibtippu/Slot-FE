'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MapPin, Calendar, Settings, LogOut } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/stats' },
  { label: 'My Grounds', icon: MapPin, href: '/dashboard/grounds' },
  { label: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 h-full bg-[#f3f7fc] border-r border-gray-200/80 flex flex-col justify-between p-6 shrink-0 select-none">
      <div className="space-y-8">
        {/* Top Brand & Portal Label */}
        <div className="space-y-2">
          <Logo size="md" variant="dark" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
            OWNER MANAGEMENT
          </p>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard/stats' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#a7f3d0]/70 text-[#0b3327] shadow-xs'
                      : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#0b3327]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="pt-6 border-t border-gray-200/80">
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
};
