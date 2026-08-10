'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy } from 'lucide-react';
import { AddGroundLayout } from '@/components/dashboard/AddGroundLayout';
import { AddGroundReviewSummary } from '@/components/dashboard/AddGroundReviewSummary';
import { Button } from '@/components/ui/Button';
import { useAddGround } from '@/context/AddGroundContext';

export default function AddGroundStep3Page() {
  const router = useRouter();
  const { data, resetAddGround } = useAddGround();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setIsPublished(true);
    resetAddGround();

    setTimeout(() => {
      router.push('/dashboard/grounds');
    }, 1800);
  };

  if (isPublished) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-fade-in">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-5">
          Ground published successfully!
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          {data.step1.groundName || 'Your ground'} is now live and bookable by customers.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" icon={<Copy className="w-4 h-4" />}>
            Copy Share Link
          </Button>
          <Button variant="primary" onClick={() => router.push('/dashboard/grounds')}>
            Go to My Grounds
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AddGroundLayout currentStep={3} onPublish={handlePublish} publishDisabled={isPublishing} containerClassName="w-4/5 max-w-7xl mx-auto space-y-6">
      <AddGroundReviewSummary />
    </AddGroundLayout>
  );
}