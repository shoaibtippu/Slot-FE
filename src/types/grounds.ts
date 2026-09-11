export interface GroundListItem {
  id: string;
  name: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  hourlyRate: number;
  averageRating: number;
  totalReviews: number;
  coverImageUrl: string | null;
  sports: string[];
}

export interface GroundDetailResponse {
  id: string;
  name: string | null;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  alternatePhoneNumber: string | null;
  hourlyRate: number;
  advancePercentage: number;
  averageRating: number;
  totalReviews: number;
  coverImageUrl: string | null;
  ownerId: string;
  images: { id: string; imageUrl: string; displayOrder: number }[];
  sports: { sportId: string; name: string; iconUrl: string | null }[];
  schedules: { dayOfWeek: number; openingTime: string; closingTime: string; isClosed: boolean }[];
}

export interface WeeklyBookingItem {
  day: string;
  count: number;
}

export interface OwnerStatsResponse {
  totalGrounds: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  pendingRevenue: number;
  averageRating: number;
  latestReviews: OwnerLatestReview[];
  weeklyBookings: WeeklyBookingItem[];
}

export interface OwnerLatestReview {
  reviewerEmail: string | null;
  rating: number;
  comment: string | null;
  groundName: string | null;
  createdAt: string | null;
}
