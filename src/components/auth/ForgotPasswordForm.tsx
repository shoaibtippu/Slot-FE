'use client';

import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowLeft, Mail, KeyRound, Send, CheckCircle2 } from 'lucide-react';
import { StadiumCard } from '../common/StadiumCard';

interface ForgotPasswordFormProps {
  onLoginClick?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email Address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    // Simulate sending password reset link
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-screen max-w-vw flex flex-col justify-between bg-[#f8fafc] overflow-y-auto font-sans">
      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between shrink-0">
        <Logo size="md" variant="dark" />
        <button
          type="button"
          onClick={onLoginClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </header>

      {/* Main Container Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden flex flex-col md:flex-row">
          {/* Left Dark Green Banner Panel */}
          <div className="w-full md:w-1/2 bg-[#0b3327] text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Ambient Gradient */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 my-auto">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                Precision in every play.
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Recover your access and get back to managing your grounds with the same discipline you bring to the game.
              </p>
              
              <div className="pt-4">
                <StadiumCard />
              </div>
            </div>
          </div>

          {/* Right White Form Panel */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white space-y-6">
            {isSubmitted ? (
              <div className="flex flex-col items-center text-center space-y-4 my-auto">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">Reset Link Sent!</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We have sent a password reset link to <span className="font-semibold text-emerald-800">{email}</span>. Please check your inbox.
                </p>
                <Button
                  onClick={onLoginClick}
                  variant="primary"
                  fullWidth
                  size="md"
                  className="mt-2"
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {/* Top Key Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shadow-xs">
                    <KeyRound className="w-5 h-5 text-[#0b3327]" />
                  </div>

                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Forgot Password?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. owner@stadium.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                    className="font-bold"
                  >
                    Send Reset Link
                  </Button>
                </form>

                <div className="pt-2 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={onLoginClick}
                      className="font-semibold text-[#0b3327] hover:underline cursor-pointer focus:outline-none"
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Dark Footer Section */}
      <footer className="w-full bg-[#07241b] text-gray-300 py-8 px-6 border-t border-emerald-900/50 shrink-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Logo size="md" variant="light" />
            <p className="text-xs text-emerald-100/70 max-w-xs leading-relaxed">
              Precision facility management for the modern athlete.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Product</h4>
            <ul className="space-y-1.5 text-xs text-emerald-100/70">
              <li><a href="#" className="hover:text-white">Find a Ground</a></li>
              <li><a href="#" className="hover:text-white">List Your Ground</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Support</h4>
            <ul className="space-y-1.5 text-xs text-emerald-100/70">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Legal</h4>
            <ul className="space-y-1.5 text-xs text-emerald-100/70">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-emerald-900/40 text-xs text-emerald-100/50">
          © 2024 Slot Sports. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
