import { getAuthToken } from '@/lib/auth';
import { GroundListItem, GroundDetailResponse, OwnerStatsResponse } from '@/types/grounds';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120';

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMyGrounds(): Promise<{ grounds: GroundListItem[]; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/grounds/my`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function getOwnerStats(): Promise<{ stats: OwnerStatsResponse; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/grounds/owner-stats`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function createGround(payload: {
  name: string | null;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  alternatePhoneNumber: string | null;
  hourlyRate: number;
  advancePercentage: number;
}): Promise<{ success: boolean; ground: GroundDetailResponse; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/grounds`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function updateGroundSchedules(
  groundId: string,
  schedules: { dayOfWeek: number; openingTime: string; closingTime: string; isClosed: boolean }[],
): Promise<{ success: boolean; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/grounds/${groundId}/schedules`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ schedules }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function uploadGroundImages(
  groundId: string,
  files: File[],
): Promise<{ success: boolean; error: string | null }> {
  const token = getAuthToken();
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const res = await fetch(`${BASE_URL}/api/grounds/${groundId}/images`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
