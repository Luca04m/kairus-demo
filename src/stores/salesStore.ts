'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Conversation, Message } from '@/types/crm';
import type { Agent } from '@/types/agents';
import type { UUID } from '@/types/common';

// ─── Sales Metrics ───────────────────────────────────────
interface SalesMetrics {
  total_conversas: number;
  conversas_abertas: number;
  mensagens_hoje: number;
  nps_medio: number;
  tempo_medio_resposta: string;
}

// ─── Activity Item ───────────────────────────────────────
interface ActivityItem {
  agente: string;
  acao: string;
  tempo: string;
}

// ─── State ───────────────────────────────────────────────
interface SalesState {
  agents: Agent[];
  selectedAgent: Agent | null;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  metrics: SalesMetrics | null;
  activityFeed: ActivityItem[];
  loading: boolean;
  messagesLoading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface SalesActions {
  fetchConversations: (tenantId?: string) => Promise<void>;
  selectAgent: (agent: Agent | null) => void;
  selectConversation: (conversation: Conversation | null) => void;
  fetchMessages: (conversationId: UUID) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'created_at'>) => Promise<void>;
  updateMetrics: (tenantId?: string) => Promise<void>;
  subscribeToMessages: (conversationId: UUID) => () => void;
}

export type SalesStore = SalesState & SalesActions;

const initialState: SalesState = {
  agents: [],
  selectedAgent: null,
  conversations: [],
  selectedConversation: null,
  messages: [],
  metrics: null,
  activityFeed: [],
  loading: false,
  messagesLoading: false,
  error: null,
};

export const useSalesStore = create<SalesStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    fetchConversations: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('conversations').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query.order('updated_at', { ascending: false });

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ conversations: (data ?? []) as Conversation[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch conversations.';
        set({ loading: false, error: message });
      }
    },

    selectAgent: (agent) => set({ selectedAgent: agent }),

    selectConversation: (conversation) => {
      set({ selectedConversation: conversation, messages: [] });
      if (conversation) {
        get().fetchMessages(conversation.id);
      }
    },

    fetchMessages: async (conversationId) => {
      set({ messagesLoading: true, error: null });
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) {
          set({ messagesLoading: false, error: error.message });
          return;
        }

        set({ messages: (data ?? []) as Message[], messagesLoading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch messages.';
        set({ messagesLoading: false, error: message });
      }
    },

    addMessage: async (messageData) => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('messages')
          .insert(messageData)
          .select()
          .single();

        if (error) {
          set({ error: error.message });
          return;
        }

        set((state) => {
          const newMsg = data as Message;
          // Deduplicate: skip if message with same ID already exists
          if (state.messages.some((m) => m.id === newMsg.id)) return state;
          return { messages: [...state.messages, newMsg] };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add message.';
        set({ error: message });
      }
    },

    updateMetrics: async (tenantId) => {
      try {
        const supabase = createClient();
        // Assumes an RPC or view for aggregated sales metrics
        let query = supabase.from('sales_metrics').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query.single();

        if (error) {
          // Non-blocking: metrics are supplementary
          return;
        }

        set({ metrics: data as SalesMetrics });
      } catch {
        // Silently fail for metrics
      }
    },

    subscribeToMessages: (conversationId) => {
      const supabase = createClient();

      const channel = supabase
        .channel(`messages-${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const newMessage = payload.new as unknown as Message;
            set((state) => {
              // Avoid duplicates
              const exists = state.messages.some((m) => m.id === newMessage.id);
              if (exists) return state;
              return { messages: [...state.messages, newMessage] };
            });
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  })),
);
