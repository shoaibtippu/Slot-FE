export interface ReviewReply {
  id: string;
  text: string;
  ownerEmail: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
}

export interface Review {
  id: string;
  groundId: string;
  groundName: string | null;
  bookingId: string;
  userId: string;
  userEmail: string | null;
  rating: number;
  comment: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
  reply: ReviewReply | null;
}

export interface ReviewsPagedResponse {
  reviews: Review[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  error: string | null;
}
