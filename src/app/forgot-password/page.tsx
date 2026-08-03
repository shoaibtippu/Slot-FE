'use client';

import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <ForgotPasswordForm onLoginClick={() => router.push('/login')} />
  );
}
