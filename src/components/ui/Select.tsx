'use client';

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  onValueChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  containerClassName?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  variant?: 'default' | 'dark' | 'ghost' | 'compact' | 'small';
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  label,
  options = [],
  value: controlledValue,
  defaultValue,
  onChange,
  onValueChange,
  error,
  placeholder = 'Select option',
  disabled = false,
  name,
  id,
  containerClassName = '',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  variant = 'default',
}, ref) => {
  const [internalValue, setInternalValue] = useState<string>(
    controlledValue !== undefined
      ? controlledValue
      : defaultValue !== undefined
      ? defaultValue
      : options[0]?.value || ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue) || options[0];

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled || disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(option.value);
    }

    if (onValueChange) {
      onValueChange(option.value);
    }

    if (onChange) {
      onChange({ target: { value: option.value, name } });
    }

    setIsOpen(false);
  };

  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  // Styling variants
  const variantStyles = {
    default: {
      button: `w-full flex items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-800 shadow-2xs transition-all duration-200 cursor-pointer ${
        error ? 'border-red-500' : 'border-gray-200 hover:border-emerald-500'
      } ${isOpen ? 'ring-2 ring-emerald-600/20 border-emerald-600' : ''}`,
      menu: 'absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 transition-all duration-150',
      item: 'relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors font-medium',
      itemSelected: 'bg-emerald-50 text-emerald-900 font-bold',
      text: 'text-gray-800',
      chevron: 'text-gray-400',
    },
    dark: {
      button: `w-full flex items-center justify-between gap-2 rounded-xl bg-[#06241b] border px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs cursor-pointer transition-all duration-200 ${
        error ? 'border-red-500' : 'border-emerald-700/60 hover:border-emerald-400'
      } ${isOpen ? 'ring-2 ring-emerald-400/20 border-emerald-400' : ''}`,
      menu: 'absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-auto rounded-xl border border-emerald-800/80 bg-[#06241b] p-1.5 shadow-2xl ring-1 ring-emerald-500/20 transition-all duration-150',
      item: 'relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-xs text-emerald-100 hover:bg-emerald-900/80 hover:text-white transition-colors font-medium',
      itemSelected: 'bg-emerald-800/60 text-white font-bold',
      text: 'text-white',
      chevron: 'text-emerald-400',
    },
    ghost: {
      button: `w-full flex items-center justify-between gap-2 bg-transparent text-sm font-extrabold text-gray-900 cursor-pointer hover:text-emerald-700 transition-colors ${
        isOpen ? 'text-emerald-700' : ''
      }`,
      menu: 'absolute left-0 z-50 mt-2 max-h-60 min-w-[220px] w-full overflow-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 transition-all duration-150',
      item: 'relative flex w-full cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors',
      itemSelected: 'bg-emerald-50 text-emerald-900 font-bold',
      text: 'text-gray-900',
      chevron: 'text-gray-700',
    },
    compact: {
      button: `w-full flex items-center justify-between gap-1.5 bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all ${
        isOpen ? 'bg-gray-100 border-emerald-500 ring-2 ring-emerald-600/10' : ''
      }`,
      menu: 'absolute right-0 z-50 mt-1.5 max-h-60 min-w-[150px] overflow-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 transition-all duration-150',
      item: 'relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors',
      itemSelected: 'bg-emerald-50 text-emerald-900 font-bold',
      text: 'text-gray-700',
      chevron: 'text-gray-500',
    },
    small: {
      button: `w-full flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs cursor-pointer hover:border-emerald-500 transition-all ${
        disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : ''
      } ${isOpen ? 'ring-2 ring-emerald-600/20 border-emerald-600' : ''}`,
      menu: 'absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-auto rounded-xl border border-gray-100 bg-white p-1 text-xs text-gray-700 shadow-lg ring-1 ring-black/5 transition-all duration-150',
      item: 'relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors',
      itemSelected: 'bg-emerald-50 text-emerald-900 font-bold',
      text: 'text-gray-700',
      chevron: 'text-gray-400',
    },
  };

  const currentStyle = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-gray-700 tracking-wide">
          {label}
        </label>
      )}

      <div className="relative" ref={ref}>
        {name && <input type="hidden" name={name} value={selectedValue} />}

        {/* Custom Trigger Button */}
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`${currentStyle.button} ${buttonClassName} ${className}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={`truncate ${currentStyle.text}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${currentStyle.chevron} ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Custom Popover Dropdown Menu */}
        {isOpen && (
          <div className={`${currentStyle.menu} ${menuClassName}`} role="listbox">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={`${currentStyle.item} ${isSelected ? currentStyle.itemSelected : ''} ${
                    option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
