'use client';

import { useEffect } from 'react';
import { useSalesStore } from '@/stores/salesStore';
import { useAuthStore } from '@/stores/authStore';
import type { Agent } from '@/types/agents';
import type { Conversation, Message } from '@/types/crm';

/**
 * Hook for the sales room with realtime message subscription.
 */
export function useSalesRoom() {
  const tenant = useAuthStore((s) => s.tenant);
  const store = useSalesStore();

  const tenantId = tenant?.id;

  // Fetch conversations on mount
  useEffect(() => {
    if (tenantId) {
      store.fetchConversations(tenantId);
      store.updateMetrics(tenantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  // Subscribe to messages when a conversation is selected
  useEffect(() => {
    const conversationId = store.selectedConversation?.id;
    if (!conversationId) return;

    const unsubscribe = store.subscribeToMessages(conversationId);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedConversation?.id]);

  return {
    // State
    agents: store.agents,
    selectedAgent: store.selectedAgent,
    conversations: store.conversations,
    selectedConversation: store.selectedConversation,
    messages: store.messages,
    metrics: store.metrics,
    activityFeed: store.activityFeed,
    loading: store.loading,
    messagesLoading: store.messagesLoading,
    error: store.error,

    // Derived
    isEmpty: !store.loading && store.conversations.length === 0,
    hasMessages: store.messages.length > 0,
    openConversations: store.conversations.filter((c) => c.status === 'aberta').length,

    // Actions
    refetch: () => store.fetchConversations(tenantId),
    selectAgent: (agent: Agent | null) => store.selectAgent(agent),
    selectConversation: (conversation: Conversation | null) =>
      store.selectConversation(conversation),
    sendMessage: (message: Omit<Message, 'id' | 'created_at'>) =>
      store.addMessage(message),
    refreshMetrics: () => store.updateMetrics(tenantId),
  };
}
