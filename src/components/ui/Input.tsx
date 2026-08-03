import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  leftIcon,
  rightIcon,
  error,
  helperText,
  containerClassName = '',
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full rounded-xl border bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-900 shadow-2xs transition-all duration-200
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600
            ${leftIcon ? 'pl-9.5' : ''}
            ${rightIcon ? 'pr-9.5' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <span className="text-[11px] text-red-500 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-gray-500">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
