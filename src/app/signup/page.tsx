'use client';

import { useRouter } from 'next/navigation';
import { AuthHero } from '@/components/auth/AuthHero';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <main className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-white overflow-hidden font-sans">
      {/* Left Panel: Hero Section - Exactly 50% width */}
      <div className="w-1/2 h-full shrink-0 overflow-hidden hidden md:block">
        <AuthHero />
      </div>

      {/* Right Panel: Signup Form Section - Exactly 50% width */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center overflow-hidden">
        <SignupForm onLoginClick={() => router.push('/login')} />
      </div>
    </main>
  );
}
