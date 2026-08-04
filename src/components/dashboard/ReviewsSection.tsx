import React from 'react';
import { Star, ArrowRight, User } from 'lucide-react';

interface Review {
  name: string;
  timeAgo: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export const ReviewsSection: React.FC = () => {
  const reviews: Review[] = [
    {
      name: 'Rahul S.',
      timeAgo: '2H AGO',
      rating: 5,
      comment:
        '"Great pitch quality! The outfield is extremely well maintained. Will definitely book again for our weekend match."',
    },
    {
      name: 'Sara K.',
      timeAgo: 'YESTERDAY',
      rating: 4,
      comment:
        '"Well maintained facility. The lighting during the evening slots is perfect. Professional staff and easy check-in process."',
    },
    {
      name: 'Omar F.',
      timeAgo: '3D AGO',
      rating: 5,
      comment:
        '"Impressive drainage system. Even after the rain, the ground was playable within an hour. Top-tier management!"',
    },
  ];

  return (
    <div className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
          Latest Ground Reviews
        </h3>
        <button
          type="button"
          onClick={() => alert('View All Reviews clicked!')}
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <span>View All Reviews</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-200/80 space-y-3 flex flex-col justify-between"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-[#0b3327] flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4 text-[#0b3327]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{rev.name}</h4>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200 fill-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {rev.timeAgo}
              </span>
            </div>

            {/* Comment Quote */}
            <p className="text-xs text-gray-600 leading-relaxed italic">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
