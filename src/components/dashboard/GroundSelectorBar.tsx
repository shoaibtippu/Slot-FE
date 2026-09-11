'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { getMyGrounds } from '@/services/groundsService';

interface GroundOption {
  id: string;
  name: string;
}

export const GroundSelectorBar: React.FC = () => {
  const [grounds, setGrounds] = useState<GroundOption[]>([]);
  const [selectedGround, setSelectedGround] = useState<string>('');

  useEffect(() => {
    getMyGrounds()
      .then((res) => {
        const options = res.grounds.map((g) => ({ id: g.id, name: g.name ?? 'Unnamed Ground' }));
        setGrounds(options);
        if (options.length > 0) setSelectedGround(options[0].id);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Current Ground Dropdown Card */}
      <div className="bg-white rounded-2xl p-3 px-4 shadow-2xs border border-gray-200/80 max-w-sm w-full">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
          CURRENT GROUND
        </label>
        {grounds.length === 0 ? (
          <p className="text-xs text-gray-400 py-1">No grounds yet</p>
        ) : (
          <Select
            variant="ghost"
            value={selectedGround}
            onChange={(e) => setSelectedGround(e.target.value)}
            options={grounds.map((g) => ({ value: g.id, label: g.name }))}
          />
        )}
      </div>

      {/* + New Ground Button */}
      <Link href="/dashboard/grounds/add/step-1">
        <Button
          type="button"
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          className="font-bold shrink-0 self-end sm:self-auto py-3 px-5"
        >
          New Ground
        </Button>
      </Link>
    </div>
  );
};
