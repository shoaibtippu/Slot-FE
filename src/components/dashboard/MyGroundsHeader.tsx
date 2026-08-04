import React from 'react';
import { Bell, User } from 'lucide-react';

interface MyGroundsHeaderProps {
  userName?: string;
  userAvatar?: string | null;
}

export const MyGroundsHeader: React.FC<MyGroundsHeaderProps> = ({
  userName = 'Ahmad Khan',
  userAvatar,
}) => {
  return (
    <header className="w-full bg-white px-6 sm:px-8 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
      {/* Title */}
      <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
        My Grounds
      </h1>

      {/* Right User & Notification Controls */}
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

        {/* User Profile Info Card */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900">Owner Dashboard</p>
            <p className="text-[11px] text-gray-500 font-medium">{userName}</p>
          </div>

          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 shadow-2xs flex items-center justify-center bg-[#0b3327] text-white">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
