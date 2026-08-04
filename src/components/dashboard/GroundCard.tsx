import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Button } from '../ui/Button';

export interface GroundData {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: string;
  status: 'ACTIVE' | 'INACTIVE';
  tags: string[];
  imageUrl: string;
}

interface GroundCardProps {
  ground: GroundData;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const GroundCard: React.FC<GroundCardProps> = ({
  ground,
  onViewDetails,
  onEdit,
}) => {
  const isActive = ground.status === 'ACTIVE';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-200/80 flex flex-col justify-between space-y-4 group hover:shadow-md transition-shadow">
      {/* Top Image Container with Status Badge */}
      <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-100">
        {/* eslint-disable-next-html-element-suppression */}
        <img
          src={ground.imageUrl}
          alt={ground.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-xs
              ${isActive
                ? 'bg-[#06241b]/90 text-emerald-300 border border-emerald-500/30'
                : 'bg-gray-800/80 text-gray-300 border border-gray-600/30'
              }
            `}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
              }`}
            />
            {ground.status}
          </span>
        </div>
      </div>

      {/* Title & Rating Header */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug">
            {ground.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{ground.rating}</span>
            <span className="text-gray-400 text-[10px] font-medium">({ground.reviewsCount})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{ground.location}</span>
        </div>
      </div>

      {/* Sport / Facility Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {ground.tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-2.5 py-0.5 rounded-md bg-[#a7f3d0]/40 text-[#0b3327] text-[11px] font-bold"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer Price & Buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Hourly Rate
          </p>
          <p className="text-sm font-black text-gray-900">
            {ground.hourlyRate} <span className="text-xs text-gray-400 font-normal">/ hr</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewDetails && onViewDetails(ground.id)}
            className="text-xs font-bold py-1.5 px-3"
          >
            View Details
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onEdit && onEdit(ground.id)}
            className="text-xs font-bold py-1.5 px-3"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
