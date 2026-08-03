import React from 'react';
import { UserRole } from '@/types/auth';
import { User, Building2 } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* User Option */}
      <button
        type="button"
        onClick={() => onRoleSelect('user')}
        className={`
          flex flex-col items-center justify-center py-2.5 px-4 rounded-xl border transition-all duration-200 cursor-pointer select-none
          ${selectedRole === 'user'
            ? 'border-[#0b3327] bg-emerald-50/70 text-[#0b3327] ring-1 ring-[#0b3327]'
            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <User className={`w-4.5 h-4.5 mb-1 ${selectedRole === 'user' ? 'text-[#0b3327]' : 'text-gray-400'}`} />
        <span className="text-xs font-bold">User</span>
      </button>

      {/* Ground Owner Option */}
      <button
        type="button"
        onClick={() => onRoleSelect('owner')}
        className={`
          flex flex-col items-center justify-center py-2.5 px-4 rounded-xl border transition-all duration-200 cursor-pointer select-none
          ${selectedRole === 'owner'
            ? 'border-[#0b3327] bg-emerald-50/70 text-[#0b3327] ring-1 ring-[#0b3327]'
            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <Building2 className={`w-4.5 h-4.5 mb-1 ${selectedRole === 'owner' ? 'text-[#0b3327]' : 'text-gray-400'}`} />
        <span className="text-xs font-bold">Ground Owner</span>
      </button>
    </div>
  );
};
