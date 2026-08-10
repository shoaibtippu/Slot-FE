'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAddGround } from '@/context/AddGroundContext';

export const CancellationPolicyCard: React.FC = () => {
  const { data, updateStep2 } = useAddGround();
  const selectedPolicy = data.step2.cancellationPolicy;

  const policies = [
    {
      id: 'no',
      title: 'No refund',
      description: 'Strict policy for high demand grounds.',
    },
    {
      id: 'partial',
      title: 'Partial refund (50%)',
      description: 'Balance of fairness and protection.',
    },
    {
      id: 'full',
      title: 'Full refund',
      description: 'Most flexible for your customers.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 space-y-4 h-full flex flex-col justify-between">
      <div className="flex items-center gap-2 text-gray-900">
        <ShieldAlert className="w-5 h-5 text-[#0b3327]" />
        <h3 className="text-sm font-bold">Cancellation Policy</h3>
      </div>

      <div className="space-y-2.5">
        {policies.map((policy) => {
          const isSelected = selectedPolicy === policy.id;

          return (
            <div
              key={policy.id}
              onClick={() =>
                updateStep2({ cancellationPolicy: policy.id as 'no' | 'partial' | 'full' })
              }
              className={`
                p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex items-start gap-3
                ${isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }
              `}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <div
                  className={`
                    w-4 h-4 rounded-full border flex items-center justify-center
                    ${isSelected ? 'border-[#0b3327] bg-[#0b3327]' : 'border-gray-300 bg-white'}
                  `}
                >
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </div>

              <div>
                <h4 className={`text-xs font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                  {policy.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {policy.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};