'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  Search,
  ChevronDown,
  MessageSquare,
  Edit3,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { getOwnerReviews, addReviewReply, updateReviewReply, deleteReviewReply } from '@/services/reviewsService';
import { Review } from '@/types/reviews';

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
];

function getAvatarColor(email: string | null): string {
  const code = (email ?? 'A').charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function getInitials(email: string | null): string {
  if (!email) return 'A';
  return email.substring(0, 2).toUpperCase();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  const cls = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${cls} ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  onReplyAdd: (reviewId: string, text: string) => Promise<void>;
  onReplyUpdate: (reviewId: string, text: string) => Promise<void>;
  onReplyDelete: (reviewId: string) => Promise<void>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onReplyAdd,
  onReplyUpdate,
  onReplyDelete,
}) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) { setError('Reply text is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      if (editMode) {
        await onReplyUpdate(review.id, replyText.trim());
        setEditMode(false);
      } else {
        await onReplyAdd(review.id, replyText.trim());
        setReplyOpen(false);
      }
      setReplyText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save reply.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!confirm('Delete this reply?')) return;
    setSaving(true);
    try {
      await onReplyDelete(review.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete reply.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = () => {
    setReplyText(review.reply?.text ?? '');
    setEditMode(true);
    setReplyOpen(true);
  };

  const handleCancel = () => {
    setReplyOpen(false);
    setEditMode(false);
    setReplyText('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(review.userEmail)}`}
          >
            {getInitials(review.userEmail)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {review.userEmail ?? 'Anonymous'}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <StarRating rating={review.rating} size="xs" />
              {review.groundName && (
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {review.groundName}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-[11px] text-gray-400 font-medium shrink-0">
          {formatDate(review.createdAt)}
        </div>
      </div>

      <p className={`text-xs leading-relaxed ${review.comment ? 'text-gray-700' : 'text-gray-400 italic'}`}>
        {review.comment ? `"${review.comment}"` : 'No comment provided.'}
      </p>

      {review.reply && !editMode && (
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#0b3327] flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11px] font-bold text-[#0b3327]">Your Reply</span>
              <span className="text-[10px] text-gray-400">{formatDate(review.reply.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleEditClick}
                className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                title="Edit reply"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDeleteReply}
                disabled={saving}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Delete reply"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{review.reply.text}</p>
        </div>
      )}

      {!review.reply && !replyOpen && (
        <button
          type="button"
          onClick={() => setReplyOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0b3327] hover:bg-emerald-50/60 px-3 py-2 rounded-xl border border-dashed border-gray-200 hover:border-emerald-300 transition-all w-full justify-center cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Reply to this review
        </button>
      )}

      {replyOpen && (
        <div className="space-y-2.5">
          {editMode && (
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Edit Reply</p>
          )}
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply to this review..."
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
          {error && (
            <p className="text-[11px] text-red-600 font-medium">{error}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmitReply}
              disabled={saving}
              className="px-4 py-2 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60"
            >
              {saving ? 'Saving…' : editMode ? 'Update Reply' : 'Post Reply'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ReviewsDashboard: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [orderBy, setOrderBy] = useState('newest');
  const [groundFilter, setGroundFilter] = useState<string>('all');
  const [sortOpen, setSortOpen] = useState(false);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getOwnerReviews({ pageSize: 100, orderBy });
      setReviews(res.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews.');
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const handleReplyAdd = async (reviewId: string, text: string) => {
    const res = await addReviewReply(reviewId, text);
    setReviews((prev) => prev.map((r) => r.id === reviewId ? res.review : r));
  };

  const handleReplyUpdate = async (reviewId: string, text: string) => {
    const res = await updateReviewReply(reviewId, text);
    setReviews((prev) => prev.map((r) => r.id === reviewId ? res.review : r));
  };

  const handleReplyDelete = async (reviewId: string) => {
    await deleteReviewReply(reviewId);
    setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, reply: null } : r));
  };

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews)
    : 0;
  const repliedCount = reviews.filter((r) => r.reply !== null).length;
  const pendingCount = totalReviews - repliedCount;

  const grounds = ['all', ...Array.from(new Set(reviews.map((r) => r.groundName).filter(Boolean) as string[]))];

  const filtered = reviews.filter((r) => {
    if (ratingFilter !== null && r.rating !== ratingFilter) return false;
    if (groundFilter !== 'all' && r.groundName !== groundFilter) return false;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      if (!r.comment?.toLowerCase().includes(s) && !r.userEmail?.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const ORDER_LABELS: Record<string, string> = {
    newest: 'Newest First',
    oldest: 'Oldest First',
    rating: 'Highest Rating',
  };

  const statCards = [
    { label: 'Total Reviews', value: isLoading ? '—' : String(totalReviews), color: 'text-gray-900', bg: 'bg-gray-100 text-gray-700' },
    { label: 'Average Rating', value: isLoading ? '—' : `${avgRating.toFixed(1)}/5`, color: 'text-gray-900', bg: 'bg-amber-50 text-amber-600' },
    { label: 'Replied', value: isLoading ? '—' : String(repliedCount), color: 'text-emerald-700', bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Reply', value: isLoading ? '—' : String(pendingCount), color: pendingCount > 0 ? 'text-red-600' : 'text-gray-900', bg: 'bg-red-50 text-red-500' },
  ];

  return (
    <div className="w-full space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage customer feedback and{' '}
          <span className="text-emerald-600 font-medium">respond</span> to reviews across all your grounds.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-200/80 space-y-3 flex flex-col justify-between">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{stat.label}</p>
              <h3 className={`text-xl font-black tracking-tight mt-1 ${stat.color}`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by comment or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-800 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setRatingFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${ratingFilter === null ? 'bg-[#0b3327] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${ratingFilter === r ? 'bg-amber-400 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {'★'.repeat(r)}
            </button>
          ))}
        </div>

        {grounds.length > 1 && (
          <select
            value={groundFilter}
            onChange={(e) => setGroundFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl shadow-2xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
          >
            {grounds.map((g) => (
              <option key={g} value={g}>{g === 'all' ? 'All Grounds' : g}</option>
            ))}
          </select>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl shadow-2xs text-gray-700 hover:border-emerald-500 transition-colors cursor-pointer"
          >
            <span>{ORDER_LABELS[orderBy] ?? 'Newest First'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
              {Object.entries(ORDER_LABELS).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => { setOrderBy(val); setSortOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${orderBy === val ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 space-y-2">
          <Star className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm font-semibold">
            {reviews.length === 0 ? 'No reviews yet.' : 'No reviews match your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-semibold">
            {filtered.length} review{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReplyAdd={handleReplyAdd}
              onReplyUpdate={handleReplyUpdate}
              onReplyDelete={handleReplyDelete}
            />
          ))}
        </div>
      )}

      <footer className="pt-6 pb-2 border-t border-gray-200/60 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          POWERED BY SLOT MANAGEMENT SUITE © 2024
        </p>
      </footer>
    </div>
  );
};
