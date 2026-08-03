import React from 'react';
import { Logo } from '../common/Logo';

interface AuthHeaderProps {
  onLoginClick?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ onLoginClick }) => {
  return (
    <div className="space-y-2">
      <Logo size="md" variant="dark" />
      <div>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="font-semibold text-[#0b3327] hover:underline cursor-pointer focus:outline-none"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
