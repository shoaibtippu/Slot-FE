import React from 'react';
import { PasswordValidationState } from '@/types/auth';
import { CheckCircle2, Circle } from 'lucide-react';

interface PasswordRequirementsProps {
  validation: PasswordValidationState;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ validation }) => {
  const requirements = [
    { label: 'At least 8 characters', isValid: validation.hasMinLength },
    { label: 'At least 1 number', isValid: validation.hasNumber },
    { label: 'At least 1 special character (@, #, !, etc.)', isValid: validation.hasSpecialChar },
  ];

  return (
    <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100/80 space-y-1">
      {requirements.map((req, idx) => (
        <div key={idx} className="flex items-center gap-1.5 text-[10px]">
          {req.isValid ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          )}
          <span className={req.isValid ? 'text-emerald-800 font-medium' : 'text-gray-500'}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
};
