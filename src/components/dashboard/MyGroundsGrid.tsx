'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroundCard, GroundData } from './GroundCard';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

const SAMPLE_GROUNDS: GroundData[] = [
  {
    id: '1',
    name: 'Green Valley Cricket Ground',
    location: 'Gulberg, Lahore',
    rating: 4.8,
    reviewsCount: 120,
    hourlyRate: 'PKR 2,500',
    status: 'ACTIVE',
    tags: ['Cricket', 'Floodlights'],
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Arena 5 Futsal Club',
    location: 'DHA Phase 6, Lahore',
    rating: 4.9,
    reviewsCount: 85,
    hourlyRate: 'PKR 3,500',
    status: 'ACTIVE',
    tags: ['Football', 'Indoor'],
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Sunrise Multi-Sports',
    location: 'Model Town, Lahore',
    rating: 4.5,
    reviewsCount: 42,
    hourlyRate: 'PKR 1,800',
    status: 'INACTIVE',
    tags: ['Cricket', 'Tennis'],
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Elite Cricket Academy',
    location: 'Johar Town, Lahore',
    rating: 4.7,
    reviewsCount: 210,
    hourlyRate: 'PKR 2,200',
    status: 'ACTIVE',
    tags: ['Cricket Nets', 'Academy'],
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Padel Arena Lahore',
    location: 'Gulberg III, Lahore',
    rating: 4.9,
    reviewsCount: 154,
    hourlyRate: 'PKR 4,000',
    status: 'ACTIVE',
    tags: ['Padel', 'Floodlights'],
    imageUrl: 'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    name: 'Champion Turf Complex',
    location: 'Valencia Town, Lahore',
    rating: 4.6,
    reviewsCount: 98,
    hourlyRate: 'PKR 2,800',
    status: 'ACTIVE',
    tags: ['Football', 'Cricket'],
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  },
];

export const MyGroundsGrid: React.FC = () => {
  const router = useRouter();
  const [grounds] = useState<GroundData[]>(SAMPLE_GROUNDS);

  const handleEdit = () => {
    router.push('/dashboard/settings');
  };

  const handleAddNew = () => {
    router.push('/dashboard/grounds/add/step-1');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Add New Ground CTA Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Manage Facilities
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Manage your listed grounds and track their status in real-time.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleAddNew}
          icon={<Plus className="w-4 h-4" />}
          className="font-bold shrink-0 self-start sm:self-auto py-2.5 px-4"
        >
          Add New Ground
        </Button>
      </div>

      {/* 3+ Cards per line Grid (Responsive: 1 -> 2 -> 3 -> 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {grounds.map((ground) => (
          <GroundCard
            key={ground.id}
            ground={ground}
            onViewDetails={handleEdit}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Load More Grounds Button */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={() => alert('All facilities loaded.')}
          className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
          <span>Load More Grounds</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© 2024 Slot Booking Platform</p>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-900 transition-colors">Help</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
};
