'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star } from 'lucide-react';
import { getGrounds, GroundListItem } from '@/services/userGroundsService';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

function GroundCard({ ground }: { ground: GroundListItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-36 bg-gradient-to-br from-emerald-800 to-emerald-600 relative flex items-center justify-center">
        {ground.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ground.thumbnailUrl} alt={ground.name} className="w-full h-full object-cover" />
        ) : (
          <MapPin className="w-10 h-10 text-emerald-200/50" />
        )}
        {ground.advancePercentage > 0 && (
          <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
            {ground.advancePercentage}% advance
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-gray-900 leading-tight">{ground.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="text-[11px] truncate">
              {[ground.location, ground.city].filter(Boolean).join(', ') || 'Location TBD'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={ground.averageRating} />
          <span className="text-[10px] text-gray-500 font-medium">({ground.totalReviews})</span>
        </div>
        {ground.sports.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ground.sports.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100"
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-base font-black text-gray-900">PKR {ground.hourlyRate.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 font-medium">/hr</span>
          </div>
          <Link
            href={`/user/grounds/${ground.id}`}
            className="px-4 py-2 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-8 bg-gray-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default function UserHomePage() {
  const [grounds, setGrounds] = useState<GroundListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const loadGrounds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getGrounds({ search: search || undefined, city: city || undefined, pageSize: 30 });
      setGrounds(res.grounds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grounds.');
    } finally {
      setIsLoading(false);
    }
  }, [search, city]);

  useEffect(() => {
    const t = setTimeout(loadGrounds, 300);
    return () => clearTimeout(t);
  }, [loadGrounds]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Find a Ground</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse and book sports grounds near you.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search grounds…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-800 placeholder:text-gray-400"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by city…"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-800 placeholder:text-gray-400 w-44"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : grounds.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400 space-y-2">
            <MapPin className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No grounds found.</p>
          </div>
        ) : (
          grounds.map((g) => <GroundCard key={g.id} ground={g} />)
        )}
      </div>
    </div>
  );
}
