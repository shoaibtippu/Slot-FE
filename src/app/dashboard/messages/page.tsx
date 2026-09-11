'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Loader2, Plus, Search, X, UserPlus } from 'lucide-react';
import { ConversationListItem, UserSearchResult } from '@/types/chat';
import { getConversations, searchUsers, startDirectConversation } from '@/services/chatService';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { getAuthToken, getUserInfoFromToken } from '@/lib/auth';

export default function DashboardMessagesPage() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selected, setSelected] = useState<ConversationListItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [showNewMsg, setShowNewMsg] = useState(false);
  const [emailQuery, setEmailQuery] = useState(''); // variable name kept; now searches by name
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const token = getAuthToken();
  const userInfo = getUserInfoFromToken(token);

  const loadConversations = useCallback(() => {
    setLoading(true);
    getConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (emailQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchUsers(emailQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [emailQuery]);

  const handleStartConversation = async (user: UserSearchResult) => {
    setStarting(true);
    try {
      const detail = await startDirectConversation(user.id);
      // Refresh conversation list then select the new/existing one
      const updated = await getConversations();
      setConversations(updated);
      const conv = updated.find((c) => c.id === detail.id);
      if (conv) setSelected(conv);
      setShowNewMsg(false);
      setEmailQuery('');
      setSearchResults([]);
    } catch {
      // ignore
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="mb-4 shrink-0 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Chat with customers about their bookings.</p>
        </div>
        <button
          onClick={() => { setShowNewMsg(true); setEmailQuery(''); setSearchResults([]); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden flex min-h-0">
        {/* Conversation list */}
        <div className="w-72 shrink-0 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100 shrink-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Conversations
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
              currentUserId={userInfo.userId}
            />
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {showNewMsg ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-gray-800">Start a New Conversation</span>
                </div>
                <button onClick={() => setShowNewMsg(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search input */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Search by name..."
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    autoFocus
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
                  )}
                </div>
                {emailQuery.length > 0 && emailQuery.length < 2 && (
                  <p className="text-xs text-gray-400 mt-1.5">Type at least 2 characters to search</p>
                )}
              </div>

              {/* Search results */}
              <div className="flex-1 overflow-y-auto">
                {searchResults.length === 0 && emailQuery.length >= 2 && !searching ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                    <Search className="w-8 h-8 opacity-30" />
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs">Try a different email address</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleStartConversation(user)}
                        disabled={starting}
                        className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3 disabled:opacity-50"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
                          {user.fullName
                            ? user.fullName.slice(0, 2).toUpperCase()
                            : (user.email ?? '??').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          {user.fullName && (
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.fullName}</p>
                          )}
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        {starting ? (
                          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : selected ? (
            <ChatWindow conversation={selected} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-2">
              <MessageSquare className="w-10 h-10 opacity-25" />
              <p className="text-sm font-medium">Select a conversation to start chatting</p>
              <p className="text-xs opacity-60">Or click "New Message" to start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
