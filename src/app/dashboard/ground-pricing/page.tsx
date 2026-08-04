'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRoleFromToken, parseJwt } from '@/lib/jwt';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { PricingHeader } from '@/components/dashboard/PricingHeader';
import { PricingStepProgress } from '@/components/dashboard/PricingStepProgress';
import { BasePricingCard } from '@/components/dashboard/BasePricingCard';
import { AdvancePaymentCard } from '@/components/dashboard/AdvancePaymentCard';
import { PeakHourPricingCard } from '@/components/dashboard/PeakHourPricingCard';
import { CancellationPolicyCard } from '@/components/dashboard/CancellationPolicyCard';
import { SportSpecificPricingCard } from '@/components/dashboard/SportSpecificPricingCard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function GroundPricingPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Alex Rivera');
  const [userRole, setUserRole] = useState('Ground Owner');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('slot_auth_token');
      if (token) {
        const claims = parseJwt(token);
        if (claims) {
          if (claims.email) {
            const emailName = claims.email.split('@')[0];
            setUserName(emailName.replace('.', ' '));
          }
          const role = getUserRoleFromToken(token);
          if (role) {
            setUserRole(role === 'GroundOwner' ? 'Ground Owner' : role);
          }
        }
      }
    }
  }, []);

  return (
    <div className="h-screen w-screen max-h-screen max-w-vw flex flex-row bg-[#f8fafc] overflow-hidden font-sans">
      {/* 1. Left Sidebar - Active tab Grounds */}
      <Sidebar userName={userName} userRole={userRole} activeTab="Grounds" />

      {/* 2. Right Workspace Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation Header Bar */}
        <PricingHeader />

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Step Progress Bar */}
          <div className="py-1">
            <PricingStepProgress />
          </div>

          {/* Grid Layout Row 1: Base Pricing & Advance Payment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BasePricingCard />
            <AdvancePaymentCard />
          </div>

          {/* Grid Layout Row 2: Peak-Hour Pricing & Cancellation Policy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PeakHourPricingCard />
            <CancellationPolicyCard />
          </div>

          {/* Row 3: Sport-Specific Pricing Accordion */}
          <SportSpecificPricingCard />
        </main>

        {/* Bottom Action Footer Bar */}
        <div className="w-full bg-white border-t border-gray-200/80 px-6 py-4 flex items-center justify-between shadow-md shrink-0">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.push('/dashboard/ground-owner')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => alert('Pricing settings saved as draft!')}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Save as Draft
            </button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => alert('Proceeding to Step 3: Review!')}
              className="font-bold flex items-center gap-2"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
