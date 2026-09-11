export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string | null;
  text: string;
  isRead: boolean;
  createdAt: string | null;
}

export interface ConversationListItem {
  id: string;
  bookingId: string | null;
  groundOwnerId: string;
  userId: string;
  otherUserName: string | null;
  otherUserEmail: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ConversationDetail {
  id: string;
  bookingId: string | null;
  groundOwnerId: string;
  userId: string;
  otherUserName: string | null;
  otherUserEmail: string | null;
  messages: MessageResponse[];
  unreadCount: number;
}

export interface UserSearchResult {
  id: string;
  fullName: string | null;
  email: string | null;
  imageUrl: string | null;
}
