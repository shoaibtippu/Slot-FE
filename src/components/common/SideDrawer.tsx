'use client';

import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    headerRight?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    maxWidthClass?: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
    isOpen,
    onClose,
    title,
    headerRight,
    children,
    footer,
    maxWidthClass = 'max-w-[520px]',
}) => {
// Close on Escape key press
useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
        onClose();
    }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onClose]);

// Prevent background scrolling when open
useEffect(() => {
    if (isOpen) {
    document.body.style.overflow = 'hidden';
    } else {
    document.body.style.overflow = 'unset';
    }
    return () => {
    document.body.style.overflow = 'unset';
    };
}, [isOpen]);

if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex justify-end">
    {/* Backdrop */}
    <div
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
    />

    {/* Sliding Panel */}
    <div
        className={`relative w-full ${maxWidthClass} bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}
        role="dialog"
        aria-modal="true"
    >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
            <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close panel"
            >
            <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        {headerRight && <div>{headerRight}</div>}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {children}
        </div>

        {/* Footer Actions (Optional) */}
        {footer && (
        <div className="p-6 border-t border-gray-100 bg-white shrink-0">
            {footer}
        </div>
        )}
    </div>
    </div>
);
};