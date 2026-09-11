import { getAuthToken } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120';

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface ProfileResponse {
  userId: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  imageUrl: string | null;
  roles: string[];
}

export async function getProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${BASE_URL}/api/account/me`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function updateProfile(payload: {
  fullName: string | null;
  phoneNumber: string | null;
  imageUrl: string | null;
}): Promise<{ success: boolean; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/account/me`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/account/change-password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
