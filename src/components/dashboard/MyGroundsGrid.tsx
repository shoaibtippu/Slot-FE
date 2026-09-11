'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GroundCard, GroundData } from './GroundCard';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { getMyGrounds } from '@/services/groundsService';
import { GroundListItem } from '@/types/grounds';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80';

function groundToCard(g: GroundListItem): GroundData {
  return {
    id: g.id,
    name: g.name ?? 'Unnamed Ground',
    location: g.address ?? 'Location not set',
    rating: g.averageRating,
    reviewsCount: g.totalReviews,
    hourlyRate: `PKR ${g.hourlyRate.toLocaleString()}`,
    status: 'ACTIVE',
    tags: g.sports.slice(0, 2),
    imageUrl: g.coverImageUrl ?? FALLBACK_IMAGE,
  };
}

export const MyGroundsGrid: React.FC = () => {
  const router = useRouter();
  const [grounds, setGrounds] = useState<GroundListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyGrounds()
      .then((res) => setGrounds(res.grounds))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load grounds.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/grounds/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/grounds/${id}?edit=true`);
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && grounds.length === 0 && (
        <div className="py-16 text-center text-gray-500 text-sm font-medium">
          <p>No grounds found. Add your first ground to get started.</p>
          <button
            type="button"
            onClick={handleAddNew}
            className="mt-4 inline-flex items-center gap-2 bg-[#0b3327] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#06241b] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Ground
          </button>
        </div>
      )}

      {/* 3+ Cards per line Grid */}
      {!isLoading && !error && grounds.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {grounds.map((ground) => (
            <GroundCard
              key={ground.id}
              ground={groundToCard(ground)}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Load More Grounds Button */}
      {!isLoading && grounds.length > 0 && (
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
      )}

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
