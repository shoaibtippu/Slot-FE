'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, MapPin, Calendar, Settings, LogOut } from 'lucide-react';
import { Logo } from '../common/Logo';

interface NewDashboardSidebarProps {
  activeTab?: string;
  onLogout?: () => void;
}

export const NewDashboardSidebar: React.FC<NewDashboardSidebarProps> = ({
  activeTab = 'Dashboard',
  onLogout,
}) => {
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard/ground-owner' },
    { label: 'My Grounds', icon: MapPin, route: '/dashboard/my-grounds' },
    { label: 'Bookings', icon: Calendar, route: '/dashboard/bookings' },
    { label: 'Settings', icon: Settings, route: '#' },
  ];

  const handleLogoutClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('slot_auth_token');
      localStorage.removeItem('slot_user_id');
      localStorage.removeItem('slot_user_email');
    }
    if (onLogout) {
      onLogout();
    } else {
      router.push('/login');
    }
  };

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
            const isActive = item.label === activeTab;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => item.route !== '#' && router.push(item.route)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'bg-[#a7f3d0]/70 text-[#0b3327] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#0b3327]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Link */}
      <div className="pt-6 border-t border-gray-200/80">
        <button
          type="button"
          onClick={handleLogoutClick}
          className="flex items-center gap-2.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
