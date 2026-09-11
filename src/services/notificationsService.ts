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

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string | null;
}

export async function getNotifications(): Promise<{ notifications: Notification[] }> {
  const res = await fetch(`${BASE_URL}/api/notifications`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  const list = Array.isArray(data) ? data : (data.data ?? data.notifications ?? []);
  return { notifications: list };
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: authHeaders(),
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetch(`${BASE_URL}/api/notifications/read-all`, {
    method: 'PUT',
    headers: authHeaders(),
  });
}
