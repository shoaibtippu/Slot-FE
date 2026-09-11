import { getAuthToken } from '@/lib/auth';
import { BookingListItem, BookingStatusValue } from '@/types/bookings';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120';

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getGroundOwnerBookings(): Promise<{
  bookings: BookingListItem[];
  error: string | null;
}> {
  const res = await fetch(`${BASE_URL}/api/bookings/owner`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatusValue,
): Promise<{ success: boolean; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function cancelBooking(
  bookingId: string,
): Promise<{ success: boolean; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function completeBooking(
  bookingId: string,
): Promise<{ success: boolean; error: string | null }> {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/complete`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
