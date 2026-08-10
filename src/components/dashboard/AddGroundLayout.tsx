'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AddGroundLayoutProps {
  children: React.ReactNode;
  currentStep: 1 | 2 | 3;
  step1Data?: Record<string, unknown>;
  step2Data?: Record<string, unknown>;
  onNext?: () => void;
  onPublish?: () => void;
  nextDisabled?: boolean;
  publishDisabled?: boolean;
  contentClassName?: string;
  containerClassName?: string;
}

const steps = [
  { number: 1, label: 'BASIC INFO', href: '/dashboard/grounds/add/step-1' },
  { number: 2, label: 'PRICING', href: '/dashboard/grounds/add/step-2' },
  { number: 3, label: 'REVIEW', href: '/dashboard/grounds/add/step-3' },
];

export const AddGroundLayout: React.FC<AddGroundLayoutProps> = ({
  children,
  currentStep,
  onNext,
  onPublish,
  nextDisabled,
  publishDisabled,
  contentClassName = '',
  containerClassName = 'max-w-3xl mx-auto space-y-6',
}) => {
  const router = useRouter();

  const renderStep = (step: (typeof steps)[0], index: number) => {
    const isCompleted = step.number < currentStep;
    const isActive = step.number === currentStep;
    const isDisabled = step.number > currentStep + 1;

    return (
      <React.Fragment key={step.number}>
        <Link
          href={step.href}
          className={`
            flex items-center gap-1.5 transition-all duration-150 cursor-pointer
            ${isCompleted ? 'text-emerald-600' : isActive ? 'text-gray-900 font-bold' : 'text-gray-400'}
            ${isDisabled ? 'pointer-events-none opacity-50' : ''}
          `}
          aria-current={isActive ? 'step' : undefined}
        >
          <div
            className={`
              flex items-center justify-center w-5 h-5 rounded-full border-2 text-[11px] font-bold transition-all duration-200
              ${isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : isActive
                ? 'border-gray-900 bg-white text-gray-900'
                : 'border-gray-300 bg-white text-gray-400'
              }
            `}
          >
            {isCompleted ? <Check className="w-3 h-3" /> : step.number}
          </div>
          <span className={`tracking-wider uppercase text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
            {step.label}
          </span>
        </Link>

        {index < steps.length - 1 && (
          <div
            className={`
              flex-1 h-0.5 transition-all duration-200
              ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}
            `}
          />
        )}
      </React.Fragment>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return { heading: 'Add New Ground', sub: 'Enter the basic details of your sports facility.' };
      case 2:
        return { heading: 'Pricing & Availability', sub: 'Set up rates, operating hours, and peak pricing.' };
      case 3:
        return { heading: 'Review & Submit', sub: 'Verify all details before publishing your ground.' };
      default:
        return { heading: '', sub: '' };
    }
  };

  const stepMeta = getStepTitle();

  const canGoBack = currentStep > 1;
  const backHref = canGoBack ? steps[currentStep - 2]?.href : undefined;

  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }
    router.push(steps[currentStep].href);
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish();
      return;
    }
    router.push('/dashboard/grounds');
  };

  return (
    <div className={containerClassName}>
      {/* Progress Indicator */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          {steps.map((step, index) => renderStep(step, index))}
        </div>
      </div>

      {/* Step Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{stepMeta.heading}</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{stepMeta.sub}</p>
          </div>
          {canGoBack && (
            <Link href={backHref!} className="shrink-0 mt-1">
              <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className={`bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden ${contentClassName}`}>
        {children}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4">
        {canGoBack && (
          <Link href={backHref!}>
            <Button variant="outline" icon={<ArrowLeft className="w-3.5 h-3.5" />} className="gap-1.5">
              Previous
            </Button>
          </Link>
        )}
        <div className="flex items-center gap-3 ml-auto">
          {currentStep < 3 && (
            <Button
              variant="primary"
              size="md"
              className="px-6"
              disabled={nextDisabled}
              onClick={handleNext}
            >
              Next
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Button>
          )}
          {currentStep === 3 && (
            <Button variant="primary" size="md" className="px-6" disabled={publishDisabled} onClick={handlePublish}>
              Publish Ground
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};