import { getAuthToken } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120';

function headers(): Record<string, string> {
  const token = getAuthToken();
  return {
    accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface GroundListItem {
  id: string;
  name: string;
  location: string | null;
  city: string | null;
  averageRating: number;
  totalReviews: number;
  hourlyRate: number;
  advancePercentage: number;
  thumbnailUrl: string | null;
  sports: string[];
}

export interface GroundScheduleSlot {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isAvailable: boolean;
}

export interface GroundDetail extends GroundListItem {
  description: string | null;
  phoneNumber: string | null;
  latitude: number | null;
  longitude: number | null;
  schedules: GroundScheduleSlot[];
  images: string[];
  reviews: {
    id: string;
    userEmail: string | null;
    rating: number;
    comment: string | null;
    createdAt: string | null;
    reply: { text: string; createdAt: string | null } | null;
  }[];
}

export async function getGrounds(params?: {
  search?: string;
  city?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<{ grounds: GroundListItem[]; totalCount: number }> {
  const qs = new URLSearchParams();
  qs.set('page_number', String(params?.pageNumber ?? 1));
  qs.set('page_size', String(params?.pageSize ?? 20));
  if (params?.search) qs.set('search', params.search);
  if (params?.city) qs.set('city', params.city);

  const res = await fetch(`${BASE_URL}/api/grounds?${qs}`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  const grounds = data.data ?? data.grounds ?? data.items ?? (Array.isArray(data) ? data : []);
  return { grounds, totalCount: data.totalCount ?? data.total ?? grounds.length };
}

export async function getGroundDetail(id: string): Promise<GroundDetail> {
  const res = await fetch(`${BASE_URL}/api/grounds/${id}`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.ground ?? data;
}

export async function getGroundAvailability(
  groundId: string,
  date: string,
): Promise<{ availableSlots: { startTime: string; endTime: string; isAvailable: boolean }[] }> {
  const res = await fetch(`${BASE_URL}/api/grounds/${groundId}/availability?date=${date}`, {
    headers: headers(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
