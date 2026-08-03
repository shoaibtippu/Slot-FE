import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'mint' | 'emerald' | 'outline' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'mint',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    mint: 'bg-[#a7f3d0]/20 text-[#6ee7b7] border border-[#6ee7b7]/30 backdrop-blur-xs',
    emerald: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    outline: 'border border-white/20 text-white/90',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[10px] tracking-wider font-semibold uppercase',
    md: 'px-3.5 py-1 text-xs tracking-wider font-bold uppercase',
  };

  return (
    <span className={`inline-flex items-center rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
