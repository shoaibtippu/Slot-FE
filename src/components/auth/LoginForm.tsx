'use client';

import React, { useState } from 'react';
import { LoginFormData } from '@/types/auth';
import { LoginHeader } from './LoginHeader';
import { SecurityNotice } from './SecurityNotice';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSignupClick?: () => void;
  onForgotPasswordClick?: () => void;
  onGoogleClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSignupClick,
  onForgotPasswordClick,
  onGoogleClick,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoggedInSuccess, setIsLoggedInSuccess] = useState(false);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsLoggedInSuccess(true);
      }, 1000);
    }
  };

  if (isLoggedInSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-4 my-auto">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl animate-bounce">
          ✓
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back!</h2>
        <p className="text-sm text-gray-600">
          You are now signed in as <span className="font-semibold text-[#0b3327]">{formData.email}</span>.
        </p>
        <Button
          onClick={() => {
            setIsLoggedInSuccess(false);
            setFormData({ email: '', password: '' });
          }}
          variant="outline"
          size="md"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col justify-between h-full max-h-screen py-6 px-4 sm:px-6">
      {/* Floating White Login Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/70 space-y-5 my-auto">
        {/* Header */}
        <LoginHeader />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address Input */}
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />

          {/* Password Input with Forgot Password link on right label */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-xs font-semibold text-[#0b3327] hover:underline focus:outline-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          {/* Primary CTA Sign In */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            className="mt-2 font-bold"
          >
            Sign In
          </Button>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-gray-400 tracking-wider uppercase absolute">
            OR
          </span>
        </div>

        {/* Sign in with Google */}
        <Button
          type="button"
          variant="social"
          size="md"
          fullWidth
          onClick={onGoogleClick}
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          }
        >
          Sign in with Google
        </Button>

        {/* Signup Redirect Link */}
        <div className="text-center pt-1">
          <p className="text-xs text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onSignupClick}
              className="font-bold text-[#0b3327] hover:underline focus:outline-none cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Security Notice Box */}
        <SecurityNotice />
      </div>

      {/* Footer Policy Links (Matches login.png bottom right) */}
      <div className="flex items-center justify-center sm:justify-end gap-4 py-2 shrink-0">
        <a href="#" className="text-xs text-gray-500 hover:text-gray-800">
          Privacy Policy
        </a>
        <a href="#" className="text-xs text-gray-500 hover:text-gray-800">
          Terms of Service
        </a>
        <a href="#" className="text-xs text-gray-500 hover:text-gray-800">
          Help Center
        </a>
      </div>
    </div>
  );
};
