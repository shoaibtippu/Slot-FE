import React from 'react';
import { Banknote, Calendar, Bell, Star } from 'lucide-react';

export const StatsCardsGrid: React.FC = () => {
  const stats = [
    {
      title: 'Total Earnings This Month',
      value: 'PKR 145,000',
      badge: '+12%',
      badgeColor: 'bg-[#a7f3d0]/80 text-[#0b3327]',
      icon: Banknote,
      iconBg: 'bg-emerald-50 text-[#0b3327]',
      valueColor: 'text-gray-900',
    },
    {
      title: 'Total Bookings This Month',
      value: '84',
      icon: Calendar,
      iconBg: 'bg-gray-100 text-gray-700',
      valueColor: 'text-gray-900',
    },
    {
      title: 'Pending Confirmations',
      value: '7',
      icon: Bell,
      iconBg: 'bg-red-50 text-red-500',
      valueColor: 'text-red-600',
    },
    {
      title: 'Average Rating',
      value: '4.8/5',
      icon: Star,
      iconBg: 'bg-amber-50 text-amber-500',
      valueColor: 'text-gray-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-200/80 space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              {stat.badge && (
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">{stat.title}</p>
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight mt-1 ${stat.valueColor}`}>
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};
