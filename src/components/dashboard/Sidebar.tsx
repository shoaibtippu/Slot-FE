'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, MapPin, Calendar, DollarSign, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  userName?: string;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'Dashboard',
  userName = 'John Doe',
  userRole = 'Admin Account',
}) => {
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard/ground-owner' },
    { label: 'Grounds', icon: MapPin, route: '#' },
    { label: 'Bookings', icon: Calendar, route: '#' },
    { label: 'Earnings', icon: DollarSign, route: '#' },
    { label: 'Settings', icon: Settings, route: '#' },
  ];

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'JD';

  return (
    <aside className="w-64 h-full bg-[#f3f7fc] border-r border-gray-200/80 flex flex-col justify-between p-5 shrink-0 select-none">
      <div className="space-y-6">
        {/* Slot Manager Title Header */}
        <div className="px-2">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Slot Manager
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Owner Portal</p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeTab;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => item.route !== '#' && router.push(item.route)}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'bg-[#a7f3d0]/60 text-[#0b3327] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0b3327]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Card */}
      <div className="p-3 bg-[#e2ecf9]/80 rounded-2xl flex items-center gap-3 border border-blue-100/80">
        <div className="w-10 h-10 rounded-full bg-[#0b3327] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-gray-900 truncate">{userName}</h4>
          <p className="text-[11px] text-gray-500 truncate">{userRole}</p>
        </div>
      </div>
    </aside>
  );
};
