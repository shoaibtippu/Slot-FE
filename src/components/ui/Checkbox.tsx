import React, { forwardRef, useId } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  className = '',
  id,
  checked,
  ...props
}, ref) => {
  const generatedId = useId();
  const checkboxId = id || `checkbox-${generatedId}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={checkboxId} className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <div className="relative flex items-center mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            className={`
              peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white shadow-sm transition-all
              checked:bg-[#0b3327] checked:border-[#0b3327]
              focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:ring-offset-1
              cursor-pointer ${className}
            `}
            {...props}
          />
          <svg
            className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 left-0.5 top-0.5 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {label && <span className="text-xs text-gray-600 leading-normal">{label}</span>}
      </label>
      {error && <span className="text-xs text-red-500 font-medium ml-6">{error}</span>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
