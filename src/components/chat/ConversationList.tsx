'use client';

import React from 'react';
import { MessageSquare, User } from 'lucide-react';
import { ConversationListItem } from '@/types/chat';

function formatDate(d: string | null) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function getLabel(conv: ConversationListItem) {
  if (!conv.bookingId) {
    // Direct conversation — show the other user's name or email
    return conv.otherUserName || conv.otherUserEmail || 'Direct Message';
  }
  return `Booking #${conv.bookingId.slice(-6).toUpperCase()}`;
}

function getAvatar(conv: ConversationListItem) {
  if (!conv.bookingId) {
    const name = conv.otherUserName || conv.otherUserEmail || '';
    return name.slice(0, 2).toUpperCase() || 'DM';
  }
  return conv.bookingId.slice(-2).toUpperCase();
}

interface ConversationListProps {
  conversations: ConversationListItem[];
  selectedId: string | null;
  onSelect: (conv: ConversationListItem) => void;
  currentUserId?: string | null;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-gray-400 space-y-2 p-4">
        <MessageSquare className="w-8 h-8 opacity-30" />
        <p className="text-xs font-medium text-center">No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {conversations.map((conv) => {
        const isSelected = conv.id === selectedId;
        const hasUnread = conv.unreadCount > 0;
        const label = getLabel(conv);
        const avatar = getAvatar(conv);
        const isDirect = !conv.bookingId;

        return (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv)}
            className={`w-full text-left px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
              isSelected ? 'bg-emerald-50 border-l-2 border-l-emerald-600' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                isDirect ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {isDirect ? <User className="w-4 h-4" /> : avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs truncate ${
                      hasUnread ? 'font-extrabold text-gray-900' : 'font-bold text-gray-700'
                    }`}
                  >
                    {label}
                  </p>
                  <span className="text-[9px] text-gray-400 shrink-0">
                    {formatDate(conv.lastMessageAt)}
                  </span>
                </div>
                {isDirect && conv.otherUserEmail && conv.otherUserName && (
                  <p className="text-[10px] text-gray-400 truncate">{conv.otherUserEmail}</p>
                )}
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    hasUnread ? 'text-gray-800 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {conv.lastMessage ?? 'Start a conversation'}
                </p>
              </div>
              {hasUnread && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 shrink-0 mt-1 flex items-center justify-center text-[8px] font-black text-white">
                  {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
