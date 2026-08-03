import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon representing a stadium slot line / field design */}
      <div
        className={`
          flex items-center justify-center rounded-xl transition-transform hover:scale-105
          ${isDark ? 'bg-[#0b3327] text-white shadow-sm' : 'bg-white text-[#0b3327]'}
          ${iconSizes[size]}
        `}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          {/* Slot Pitch/Stadium outline */}
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M12 5v14" />
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
        </svg>
      </div>

      {showText && (
        <span
          className={`
            font-bold tracking-tight ${textSizes[size]}
            ${isDark ? 'text-gray-900' : 'text-white'}
          `}
        >
          Slot
        </span>
      )}
    </div>
  );
};
