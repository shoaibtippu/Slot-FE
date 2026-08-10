'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddGroundLayout } from '@/components/dashboard/AddGroundLayout';
import { AddGroundBasicInfoForm } from '@/components/dashboard/AddGroundBasicInfoForm';
import { useAddGround } from '@/context/AddGroundContext';

export default function AddGroundStep1Page() {
  const { data } = useAddGround();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setError(null);
    if (!data.step1.groundName.trim()) {
      setError('Please enter a Ground Name before continuing.');
      return;
    }
    if (data.step1.photos.length === 0) {
      setError('Please upload at least one photo of your ground.');
      return;
    }
    router.push('/dashboard/grounds/add/step-2');
  };

  return (
    <AddGroundLayout currentStep={1} onNext={handleNext} containerClassName="w-4/5 max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="p-3.5 bg-red-50/70 border-b border-red-100 text-red-700 text-xs font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {error}
        </div>
      )}
      <AddGroundBasicInfoForm />
    </AddGroundLayout>
  );
}