'use client';

import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';
import { Mail, Check, Info, RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';

interface VerifyEmailCardProps {
  email?: string;
  onResendClick?: () => void;
}

export const VerifyEmailCard: React.FC<VerifyEmailCardProps> = ({
  email = 'johndoe@example.com',
  onResendClick,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = () => {
    if (onResendClick) {
      onResendClick();
      return;
    }
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-screen max-w-vw flex flex-col justify-between bg-[#f8fafc] font-sans">
      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center shrink-0">
        <Logo size="md" variant="dark" />
      </header>

      {/* Center Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/80 space-y-5 text-center">
          {/* Top Mail Badge with Check Overlay */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 shadow-xs">
              <Mail className="w-9 h-9 text-[#0b3327]" />
            </div>
            {/* Dark green check badge overlay */}
            <div className="absolute top-0 right-0 w-6 h-6 bg-[#0b3327] text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Verify your account
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
              We&apos;ve sent a verification link to{' '}
              <span className="font-semibold text-slate-900">{email}</span>. Please click the link to confirm your email address.
            </p>
          </div>

          {/* Info Banner Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-center gap-2 text-xs text-blue-900 font-medium">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Verification is required before your first login.</span>
          </div>

          {/* Resend Link Button */}
          <div className="pt-1">
            <Button
              onClick={handleResend}
              variant="primary"
              fullWidth
              size="md"
              isLoading={isResending}
              icon={<RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />}
              className="font-bold"
            >
              {resendSuccess ? 'Link Resent!' : 'Resend Link'}
            </Button>
          </div>

          {/* Help Subtext */}
          <p className="text-xs text-gray-500 leading-normal max-w-xs mx-auto">
            Didn&apos;t receive the email? Check your spam folder or try a different email.
          </p>

          {/* Card Footer Links */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <a href="#" className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              Need help?
            </a>

            <a href="#" className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
              Contact Support
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center shrink-0">
        <p className="text-xs text-gray-400 font-medium">
          © 2024 Slot Sports. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
