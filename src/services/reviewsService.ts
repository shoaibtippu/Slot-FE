import { getAuthToken } from '@/lib/auth';
import { Review, ReviewsPagedResponse } from '@/types/reviews';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120';

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getOwnerReviews(params?: {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  search?: string;
  rating?: number;
  groundId?: string;
}): Promise<ReviewsPagedResponse> {
  const qs = new URLSearchParams();
  qs.set('page_number', String(params?.pageNumber ?? 1));
  qs.set('page_size', String(params?.pageSize ?? 20));
  if (params?.orderBy) qs.set('order_by', params.orderBy);
  if (params?.search) qs.set('search', params.search);
  if (params?.rating != null) qs.set('rating', String(params.rating));
  if (params?.groundId) qs.set('ground_id', params.groundId);

  const queryStr = qs.toString();
  const url = `${BASE_URL}/api/reviews/owner${queryStr ? '?' + queryStr : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function addReviewReply(
  reviewId: string,
  text: string,
): Promise<{ success: boolean; review: Review; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}/reply`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function updateReviewReply(
  reviewId: string,
  text: string,
): Promise<{ success: boolean; review: Review; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}/reply`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function deleteReviewReply(
  reviewId: string,
): Promise<{ success: boolean; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}/reply`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
