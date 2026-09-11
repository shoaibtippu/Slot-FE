'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy } from 'lucide-react';
import { AddGroundLayout } from '@/components/dashboard/AddGroundLayout';
import { AddGroundReviewSummary } from '@/components/dashboard/AddGroundReviewSummary';
import { Button } from '@/components/ui/Button';
import { useAddGround } from '@/context/AddGroundContext';
import { createGround, updateGroundSchedules } from '@/services/groundsService';

const DAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function to24h(t: string): string {
  const parts = t.split(' ');
  const period = parts[1] ?? 'AM';
  const timeParts = (parts[0] ?? '00:00').split(':');
  let h = parseInt(timeParts[0] ?? '0', 10);
  const m = parseInt(timeParts[1] ?? '0', 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
}

export default function AddGroundStep3Page() {
  const router = useRouter();
  const { data, resetAddGround } = useAddGround();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);
    try {
      const groundResult = await createGround({
        name: data.step1.groundName || null,
        description: data.step1.description || null,
        address: data.step1.address
          ? `${data.step1.address}, ${data.step1.city}`
          : data.step1.city || null,
        latitude: Math.round((parseFloat(data.step1.latitude) || 0) * 1e7) / 1e7,
        longitude: Math.round((parseFloat(data.step1.longitude) || 0) * 1e7) / 1e7,
        phoneNumber: data.step1.phoneNumber,
        alternatePhoneNumber: data.step1.alternatePhoneNumber || null,
        hourlyRate: parseFloat(data.step2.basePrice) || 0,
        advancePercentage: data.step2.advancePercent,
      });

      const groundId = groundResult.ground.id;

      const schedules = data.step2.schedule.map((s) => ({
        dayOfWeek: DAY_MAP[s.day] ?? 1,
        openingTime: to24h(s.openTime),
        closingTime: to24h(s.closeTime),
        isClosed: !s.enabled,
      }));
      await updateGroundSchedules(groundId, schedules);

      setIsPublished(true);
      resetAddGround();
      setTimeout(() => {
        router.push('/dashboard/grounds');
      }, 1800);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Failed to publish ground. Please try again.');
    } finally {
      setIsPublishing(false);
    }
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
    <>
      {publishError && (
        <div className="max-w-3xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {publishError}
        </div>
      )}
      <AddGroundLayout
        currentStep={3}
        onPublish={handlePublish}
        publishDisabled={isPublishing}
        containerClassName="w-4/5 max-w-7xl mx-auto space-y-6"
      >
        <AddGroundReviewSummary />
      </AddGroundLayout>
    </>
  );
}
