import { getAuthToken } from '@/lib/auth';
import * as signalR from '@microsoft/signalr';
import { ConversationListItem, ConversationDetail, MessageResponse, UserSearchResult } from '@/types/chat';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7120';

function authHeaders() {
  const token = getAuthToken();
  return {
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// GET /api/conversations — list conversations for current user
export async function getConversations(): Promise<ConversationListItem[]> {
  const res = await fetch(`${BASE_URL}/api/conversations`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.conversations ?? [];
}

// GET /api/conversations/{id}/messages — get messages (newest first from BE, we reverse)
export async function getMessages(
  conversationId: string,
  pageNumber = 1,
  pageSize = 50,
): Promise<MessageResponse[]> {
  const qs = new URLSearchParams({
    page_number: String(pageNumber),
    page_size: String(pageSize),
  });
  const res = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}/messages?${qs}`,
    { headers: authHeaders() },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  // Reverse so oldest messages appear first in UI
  return [...(data.messages ?? [])].reverse();
}

// POST /api/bookings/{bookingId}/conversation — get or create conversation for a booking
export async function getOrCreateConversation(bookingId: string): Promise<ConversationDetail> {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/conversation`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.conversation;
}

// PATCH /api/conversations/{id}/messages/read — mark all messages as read
export async function markMessagesAsRead(conversationId: string): Promise<void> {
  await fetch(`${BASE_URL}/api/conversations/${conversationId}/messages/read`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
}

// GET /api/users/search?name=... — search users by full name
export async function searchUsers(name: string): Promise<UserSearchResult[]> {
  if (!name || name.length < 2) return [];
  const qs = new URLSearchParams({ name });
  const res = await fetch(`${BASE_URL}/api/users/search?${qs}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) return [];
  return data.users ?? [];
}

// POST /api/conversations/direct — start or get a direct conversation
export async function startDirectConversation(targetUserId: string): Promise<ConversationDetail> {
  const res = await fetch(`${BASE_URL}/api/conversations/direct`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ targetUserId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.conversation;
}

// ── SignalR ───────────────────────────────────────────────────────────────────

export function createChatConnection(): signalR.HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/hub/chat`, {
      accessTokenFactory: () => getAuthToken() ?? '',
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();
}
