import React from 'react';
import { Bell, User } from 'lucide-react';

interface NewDashboardHeaderProps {
  userName?: string;
  userAvatar?: string | null;
}

export const NewDashboardHeader: React.FC<NewDashboardHeaderProps> = ({
  userName = 'Alex',
  userAvatar,
}) => {
  return (
    <header className="w-full bg-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-gray-100 shrink-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Good morning, {userName}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">
          Here&apos;s what&apos;s happening today at your facilities.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell with red dot */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-2xs flex items-center justify-center bg-gray-100">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#0b3327] text-white flex items-center justify-center font-bold text-xs">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
