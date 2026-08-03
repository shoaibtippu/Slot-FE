'use client';

import { useRouter } from 'next/navigation';
import { LoginHero } from '@/components/auth/LoginHero';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-[#f8fafc] overflow-hidden font-sans">
      {/* Left Panel: Hero Section - Exactly 50% width, non-scrollable */}
      <div className="w-1/2 h-full shrink-0 overflow-hidden hidden md:block">
        <LoginHero />
      </div>

      {/* Right Panel: Login Form Card Container - Exactly 50% width */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center overflow-hidden">
        <LoginForm
          onSignupClick={() => router.push('/')}
          onForgotPasswordClick={() => alert('Password reset link sent to your email!')}
        />
      </div>
    </main>
  );
}
