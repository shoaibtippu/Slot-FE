'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoginHero } from '@/components/auth/LoginHero';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard/stats');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="h-screen w-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-[#f8fafc] overflow-hidden font-sans">
      {/* Left Panel: Hero Section */}
      <div className="w-1/2 h-full shrink-0 overflow-hidden hidden md:block">
        <LoginHero />
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center overflow-hidden">
        <LoginForm
          onSignupClick={() => router.push('/signup')}
          onForgotPasswordClick={() => router.push('/forgot-password')}
        />
      </div>
    </main>
  );
}
