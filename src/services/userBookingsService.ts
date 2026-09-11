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

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';

export interface UserBooking {
  id: string;
  groundId: string;
  groundName: string | null;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  status: number; // 1=Pending, 2=Approved, 3=Rejected, 4=Cancelled, 5=Completed
  notes: string | null;
  createdAt: string | null;
}

export function bookingStatusLabel(status: number): BookingStatus {
  const map: Record<number, BookingStatus> = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
    4: 'Cancelled',
    5: 'Completed',
  };
  return map[status] ?? 'Pending';
}

export async function getMyBookings(): Promise<{ bookings: UserBooking[] }> {
  const res = await fetch(`${BASE_URL}/api/bookings/my`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  const list = data.data ?? data.bookings ?? (Array.isArray(data) ? data : []);
  return { bookings: list };
}

export async function createBooking(payload: {
  groundId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}): Promise<{ booking: UserBooking }> {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);
  return { booking: data.booking ?? data };
}

export async function cancelBooking(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/bookings/${id}/cancel`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
  }
}

// PaymentMethod enum: JazzCash=1, EasyPaisa=2, Card=3, Cash=4
export const PAYMENT_METHOD = { JazzCash: 1, EasyPaisa: 2, Card: 3, Cash: 4 } as const;

export interface PaymentInitiationResult {
  transactionReference: string;
  paymentUrl: string;
  amount: number;
  message: string;
}

export async function initiateJazzCashPayment(bookingId: string): Promise<PaymentInitiationResult> {
  const res = await fetch(`${BASE_URL}/api/payments/jazzcash/initiate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ bookingId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return {
    transactionReference: data.payment?.transactionReference ?? '',
    paymentUrl: data.payment?.paymentUrl ?? '',
    amount: data.payment?.amount ?? 0,
    message: data.payment?.message ?? '',
  };
}

export async function initiateEasyPaisaPayment(bookingId: string): Promise<PaymentInitiationResult> {
  const res = await fetch(`${BASE_URL}/api/payments/easypaisa/initiate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ bookingId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return {
    transactionReference: data.payment?.transactionReference ?? '',
    paymentUrl: data.payment?.paymentUrl ?? '',
    amount: data.payment?.amount ?? 0,
    message: data.payment?.message ?? '',
  };
}

export async function confirmJazzCashPayment(
  bookingId: string,
  transactionReference: string,
  amount: number,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/payments/jazzcash/callback`, {
    method: 'POST',
    headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, transactionReference, amount, success: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
}

export async function confirmEasyPaisaPayment(
  bookingId: string,
  transactionReference: string,
  amount: number,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/payments/easypaisa/callback`, {
    method: 'POST',
    headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, transactionReference, amount, success: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
}

export async function recordCardPayment(
  bookingId: string,
  amount: number,
  transactionReference: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/payments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ amount, method: PAYMENT_METHOD.Card, transactionReference }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
}

/** @deprecated use recordCardPayment / initiateJazzCashPayment / initiateEasyPaisaPayment */
export async function recordAdvancePayment(
  bookingId: string,
  payload: { amount: number; method: string; transactionReference?: string },
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/payments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
}
