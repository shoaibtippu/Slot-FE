'use client';

import React, { useEffect, useState } from 'react';
import { GroundSelectorBar } from '@/components/dashboard/GroundSelectorBar';
import { StatsCardsGrid } from '@/components/dashboard/StatsCardsGrid';
import { AnalyticsChartsSection } from '@/components/dashboard/AnalyticsChartsSection';
import { ReviewsSection } from '@/components/dashboard/ReviewsSection';
import { getOwnerStats } from '@/services/groundsService';
import { OwnerStatsResponse } from '@/types/grounds';

export default function GroundOwnerDashboardStatsPage() {
  const [stats, setStats] = useState<OwnerStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOwnerStats()
      .then((res) => setStats(res.stats))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const latestReviews = stats?.latestReviews.map((r) => ({
    name: r.reviewerEmail?.split('@')[0] ?? 'Anonymous',
    timeAgo: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '',
    rating: r.rating,
    comment: r.comment ? `"${r.comment}"` : '',
  }));

  return (
    <>
      <GroundSelectorBar />

      <StatsCardsGrid
        totalRevenue={stats?.totalRevenue}
        totalBookings={stats?.totalBookings}
        pendingBookings={stats?.pendingBookings}
        averageRating={stats?.averageRating}
        isLoading={isLoading}
      />

      <AnalyticsChartsSection
        weeklyBookings={stats?.weeklyBookings}
        pendingBookings={stats?.pendingBookings}
        confirmedBookings={stats?.confirmedBookings}
        completedBookings={stats?.completedBookings}
        cancelledBookings={stats?.cancelledBookings}
        isLoading={isLoading}
      />

      <ReviewsSection reviews={latestReviews} isLoading={isLoading} />

      <footer className="pt-6 pb-2 text-center border-t border-gray-200/60">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          POWERED BY SLOT MANAGEMENT SUITE © 2024
        </p>
      </footer>
    </>
  );
}
