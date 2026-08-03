'use client';

import { useState } from 'react';
import { LoginHero } from '@/components/auth/LoginHero';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthHero } from '@/components/auth/AuthHero';
import { SignupForm } from '@/components/auth/SignupForm';

export default function Home() {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleSignupClick = () => {
    setCurrentView('signup');
  };

  if (currentView === 'signup') {
    return (
      <main className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-white overflow-hidden font-sans">
        {/* Left Panel: Hero Section - Exactly 50% width */}
        <div className="w-1/2 h-full shrink-0 overflow-hidden hidden md:block">
          <AuthHero />
        </div>

        {/* Right Panel: Signup Form Section - Exactly 50% width */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center overflow-hidden">
          <SignupForm onLoginClick={handleLoginClick} />
        </div>
      </main>
    );
  }

  // Default: Login Screen opens first
  return (
    <main className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-[#f8fafc] overflow-hidden font-sans">
      {/* Left Panel: Hero Section - Exactly 50% width */}
      <div className="w-1/2 h-full shrink-0 overflow-hidden hidden md:block">
        <LoginHero />
      </div>

      {/* Right Panel: Login Form Card Container - Exactly 50% width */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center overflow-hidden">
        <LoginForm
          onSignupClick={handleSignupClick}
          onForgotPasswordClick={() => alert('Password reset link sent to your email!')}
        />
      </div>
    </main>
  );
}
