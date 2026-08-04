'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface GroundOption {
  id: string;
  name: string;
}

const GROUNDS: GroundOption[] = [
  { id: '1', name: 'Green Valley Cricket Ground' },
  { id: '2', name: 'Downtown Football Turf' },
  { id: '3', name: 'Apex Padel Arena' },
];

export const GroundSelectorBar: React.FC = () => {
  const [selectedGround, setSelectedGround] = useState<string>('1');

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Current Ground Dropdown Card */}
      <div className="bg-white rounded-2xl p-3 px-4 shadow-2xs border border-gray-200/80 max-w-sm w-full">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
          CURRENT GROUND
        </label>
        <Select
          variant="ghost"
          value={selectedGround}
          onChange={(e) => setSelectedGround(e.target.value)}
          options={GROUNDS.map((ground) => ({
            value: ground.id,
            label: ground.name,
          }))}
        />
      </div>

      {/* + New Booking Button */}
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={() => alert('New Booking modal opened!')}
        icon={<Plus className="w-4 h-4" />}
        className="font-bold shrink-0 self-end sm:self-auto py-3 px-5"
      >
        New Booking
      </Button>
    </div>
  );
};
