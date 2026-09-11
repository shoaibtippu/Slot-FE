'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { ConversationListItem, MessageResponse } from '@/types/chat';
import { getMessages, createChatConnection, markMessagesAsRead } from '@/services/chatService';
import { getAuthToken, getUserInfoFromToken } from '@/lib/auth';

function formatTime(d: string | null) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatDate(d: string | null) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

interface ChatWindowProps {
  conversation: ConversationListItem;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [conn, setConn] = useState<signalR.HubConnection | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const token = getAuthToken();
  const userInfo = getUserInfoFromToken(token);
  const myUserId = userInfo.userId;

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    getMessages(conversation.id)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));

    markMessagesAsRead(conversation.id).catch(() => {});
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const c = createChatConnection();

    c.on('ReceiveMessage', (msg: MessageResponse) => {
      if (msg.conversationId === conversation.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    c.start()
      .then(() => c.invoke('JoinConversation', conversation.id))
      .catch(() => {});

    setConn(c);

    return () => {
      c.invoke('LeaveConversation', conversation.id).catch(() => {});
      c.stop().catch(() => {});
    };
  }, [conversation.id]);

  const handleSend = async () => {
    if (!text.trim() || !conn || conn.state !== signalR.HubConnectionState.Connected) return;
    setSending(true);
    try {
      await conn.invoke('SendMessage', conversation.id, text.trim());
      setText('');
    } catch {
      // silent — user can retry
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
            conversation.bookingId ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {conversation.bookingId
              ? `#${conversation.bookingId.slice(-2).toUpperCase()}`
              : (conversation.otherUserName ?? conversation.otherUserEmail ?? 'DM').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-extrabold text-gray-900">
              {conversation.bookingId
                ? `Booking #${conversation.bookingId.slice(-6).toUpperCase()}`
                : (conversation.otherUserName || conversation.otherUserEmail || 'Direct Message')}
            </p>
            {conversation.bookingId ? null : conversation.otherUserEmail && (
              <p className="text-[10px] text-gray-500">{conversation.otherUserEmail}</p>
            )}
            <p className="text-[10px] text-gray-400">Real-time chat</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400 space-y-1">
            <MessageSquare className="w-8 h-8 mx-auto opacity-30" />
            <p className="text-xs font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === myUserId;
            const showDate =
              i === 0 ||
              formatDate(messages[i - 1].createdAt) !== formatDate(msg.createdAt);

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-3 py-0.5 rounded-full">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[72%]">
                    {!isMine && (
                      <p className="text-[10px] text-gray-400 font-medium mb-0.5 ml-1">
                        {msg.senderName ?? 'User'}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMine
                          ? 'bg-[#0b3327] text-white rounded-tr-sm'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p
                      className={`text-[9px] text-gray-400 mt-0.5 ${
                        isMine ? 'text-right mr-1' : 'ml-1'
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-none placeholder:text-gray-400 max-h-32"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!text.trim() || sending}
            className="p-2.5 bg-[#0b3327] hover:bg-[#06241b] text-white rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
