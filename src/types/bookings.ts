export const BookingStatusEnum = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  Cancelled: 4,
  Completed: 5,
} as const;

export type BookingStatusValue = typeof BookingStatusEnum[keyof typeof BookingStatusEnum];

export type BookingStatusLabel = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed';

export function statusToLabel(status: BookingStatusValue): BookingStatusLabel {
  switch (status) {
    case 1: return 'Pending';
    case 2: return 'Confirmed';
    case 3: return 'Rejected';
    case 4: return 'Cancelled';
    case 5: return 'Completed';
  }
}

export function labelToStatus(label: BookingStatusLabel): BookingStatusValue {
  switch (label) {
    case 'Pending': return 1;
    case 'Confirmed': return 2;
    case 'Rejected': return 3;
    case 'Cancelled': return 4;
    case 'Completed': return 5;
  }
}

export interface BookingListItem {
  id: string;
  groundId: string;
  groundName: string | null;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatusValue;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  userEmail?: string | null;
}

export interface BookingPayment {
  id: string;
  amount: number;
  method: number;
  status: number;
  transactionReference: string | null;
  paidAt: string | null;
}

export interface BookingDetail {
  id: string;
  groundId: string;
  groundName: string | null;
  userId: string;
  userEmail: string | null;
  bookingDate: string;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  status: BookingStatusValue;
  notes: string | null;
  payments: BookingPayment[];
}
