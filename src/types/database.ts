// src/types/database.ts
// Supabase Database type definition matching applied migrations.
// This file follows the Supabase codegen output shape so it can be
// swapped for auto-generated types once `supabase gen types` is run.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          settings?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          email: string;
          role: Database['public']['Enums']['user_role'];
          avatar_url: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          email: string;
          role?: Database['public']['Enums']['user_role'];
          avatar_url?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          role?: Database['public']['Enums']['user_role'];
          avatar_url?: string | null;
          settings?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      departments: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string;
          emoji: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          color?: string;
          icon?: string;
          emoji?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string;
          emoji?: string | null;
          order_index?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'departments_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      squads: {
        Row: {
          id: string;
          tenant_id: string;
          department_id: string;
          name: string;
          description: string | null;
          status: Database['public']['Enums']['squad_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          department_id: string;
          name: string;
          description?: string | null;
          status?: Database['public']['Enums']['squad_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          department_id?: string;
          description?: string | null;
          status?: Database['public']['Enums']['squad_status'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'squads_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'squads_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      agents: {
        Row: {
          id: string;
          tenant_id: string;
          squad_id: string | null;
          department_id: string;
          name: string;
          initials: string;
          type: Database['public']['Enums']['agent_type'];
          status: Database['public']['Enums']['agent_status'];
          description: string | null;
          skills: string[];
          config: Json;
          performance_metrics: Json;
          last_action: string | null;
          last_action_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          squad_id?: string | null;
          department_id: string;
          name: string;
          initials: string;
          type?: Database['public']['Enums']['agent_type'];
          status?: Database['public']['Enums']['agent_status'];
          description?: string | null;
          skills?: string[];
          config?: Json;
          performance_metrics?: Json;
          last_action?: string | null;
          last_action_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          squad_id?: string | null;
          department_id?: string;
          name?: string;
          initials?: string;
          type?: Database['public']['Enums']['agent_type'];
          status?: Database['public']['Enums']['agent_status'];
          description?: string | null;
          skills?: string[];
          config?: Json;
          performance_metrics?: Json;
          last_action?: string | null;
          last_action_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'agents_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'agents_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'agents_squad_id_fkey';
            columns: ['squad_id'];
            isOneToOne: false;
            referencedRelation: 'squads';
            referencedColumns: ['id'];
          },
        ];
      };
      alerts: {
        Row: {
          id: string;
          tenant_id: string;
          agent_id: string | null;
          department: string | null;
          severity: Database['public']['Enums']['alert_severity'];
          title: string;
          message: string | null;
          status: Database['public']['Enums']['alert_status'];
          metadata: Json;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          agent_id?: string | null;
          department?: string | null;
          severity?: Database['public']['Enums']['alert_severity'];
          title: string;
          message?: string | null;
          status?: Database['public']['Enums']['alert_status'];
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          agent_id?: string | null;
          department?: string | null;
          severity?: Database['public']['Enums']['alert_severity'];
          title?: string;
          message?: string | null;
          status?: Database['public']['Enums']['alert_status'];
          metadata?: Json;
          resolved_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'alerts_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'alerts_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'agents';
            referencedColumns: ['id'];
          },
        ];
      };
      approvals: {
        Row: {
          id: string;
          tenant_id: string;
          requester_id: string | null;
          approver_id: string | null;
          type: Database['public']['Enums']['approval_type'];
          title: string;
          description: string | null;
          status: Database['public']['Enums']['approval_status'];
          amount: number | null;
          urgency: Database['public']['Enums']['approval_urgency'];
          metadata: Json;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          requester_id?: string | null;
          approver_id?: string | null;
          type?: Database['public']['Enums']['approval_type'];
          title: string;
          description?: string | null;
          status?: Database['public']['Enums']['approval_status'];
          amount?: number | null;
          urgency?: Database['public']['Enums']['approval_urgency'];
          metadata?: Json;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          status?: Database['public']['Enums']['approval_status'];
          amount?: number | null;
          metadata?: Json;
          resolved_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'approvals_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'approvals_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'agents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'approvals_approver_id_fkey';
            columns: ['approver_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      approval_actions: {
        Row: {
          id: string;
          approval_id: string;
          user_id: string | null;
          action: Database['public']['Enums']['approval_action_type'];
          comment: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          approval_id: string;
          user_id?: string | null;
          action: Database['public']['Enums']['approval_action_type'];
          comment?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          comment?: string | null;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'approval_actions_approval_id_fkey';
            columns: ['approval_id'];
            isOneToOne: false;
            referencedRelation: 'approvals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'approval_actions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      financial_records: {
        Row: {
          id: string;
          tenant_id: string;
          department_id: string | null;
          category: string;
          subcategory: string | null;
          description: string | null;
          amount: number;
          type: Database['public']['Enums']['financial_record_type'];
          period: string;
          reference_date: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          department_id?: string | null;
          category: string;
          subcategory?: string | null;
          description?: string | null;
          amount: number;
          type: Database['public']['Enums']['financial_record_type'];
          period: string;
          reference_date?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          department_id?: string | null;
          category?: string;
          subcategory?: string | null;
          description?: string | null;
          amount?: number;
          type?: Database['public']['Enums']['financial_record_type'];
          period?: string;
          reference_date?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'financial_records_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'financial_records_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      financial_margins: {
        Row: {
          id: string;
          tenant_id: string;
          category: string;
          subcategory: string | null;
          margin_percent: number;
          period: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          category: string;
          subcategory?: string | null;
          margin_percent: number;
          period: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          subcategory?: string | null;
          margin_percent?: number;
          period?: string;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'financial_margins_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      clients: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          segment: Database['public']['Enums']['client_segment'];
          status: Database['public']['Enums']['client_status'];
          source: string | null;
          lifetime_value: number;
          tags: string[];
          metadata: Json;
          last_purchase: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          segment?: Database['public']['Enums']['client_segment'];
          status?: Database['public']['Enums']['client_status'];
          source?: string | null;
          lifetime_value?: number;
          tags?: string[];
          metadata?: Json;
          last_purchase?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          segment?: Database['public']['Enums']['client_segment'];
          status?: Database['public']['Enums']['client_status'];
          source?: string | null;
          lifetime_value?: number;
          tags?: string[];
          metadata?: Json;
          last_purchase?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'clients_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          tenant_id: string;
          client_id: string;
          agent_id: string | null;
          channel: Database['public']['Enums']['conversation_channel'];
          status: Database['public']['Enums']['conversation_status'];
          subject: string | null;
          metadata: Json;
          started_at: string;
          last_message_at: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          client_id: string;
          agent_id?: string | null;
          channel?: Database['public']['Enums']['conversation_channel'];
          status?: Database['public']['Enums']['conversation_status'];
          subject?: string | null;
          metadata?: Json;
          started_at?: string;
          last_message_at?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          agent_id?: string | null;
          channel?: Database['public']['Enums']['conversation_channel'];
          status?: Database['public']['Enums']['conversation_status'];
          subject?: string | null;
          metadata?: Json;
          last_message_at?: string | null;
          resolved_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversations_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversations_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversations_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'agents';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          direction: Database['public']['Enums']['message_direction'];
          content: string;
          source: Database['public']['Enums']['message_source'];
          sentiment: Database['public']['Enums']['message_sentiment'] | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          direction: Database['public']['Enums']['message_direction'];
          content: string;
          source?: Database['public']['Enums']['message_source'];
          sentiment?: Database['public']['Enums']['message_sentiment'] | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          content?: string;
          sentiment?: Database['public']['Enums']['message_sentiment'] | null;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
        ];
      };
      sales_metrics: {
        Row: {
          id: string;
          tenant_id: string;
          agent_id: string | null;
          period: string;
          conversations_total: number;
          resolved: number;
          conversion_rate: number;
          avg_response_time: string | null;
          revenue_generated: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          agent_id?: string | null;
          period: string;
          conversations_total?: number;
          resolved?: number;
          conversion_rate?: number;
          avg_response_time?: string | null;
          revenue_generated?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          agent_id?: string | null;
          period?: string;
          conversations_total?: number;
          resolved?: number;
          conversion_rate?: number;
          avg_response_time?: string | null;
          revenue_generated?: number;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_metrics_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sales_metrics_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'agents';
            referencedColumns: ['id'];
          },
        ];
      };
      campaigns: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          channel: Database['public']['Enums']['campaign_channel'];
          status: Database['public']['Enums']['campaign_status'];
          budget: number;
          spent: number;
          reach: number;
          impressions: number;
          clicks: number;
          conversions: number;
          ctr: number | null;
          cpc: number | null;
          roas: number | null;
          start_date: string | null;
          end_date: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          channel?: Database['public']['Enums']['campaign_channel'];
          status?: Database['public']['Enums']['campaign_status'];
          budget?: number;
          spent?: number;
          reach?: number;
          impressions?: number;
          clicks?: number;
          conversions?: number;
          ctr?: number | null;
          cpc?: number | null;
          roas?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          channel?: Database['public']['Enums']['campaign_channel'];
          status?: Database['public']['Enums']['campaign_status'];
          budget?: number;
          spent?: number;
          reach?: number;
          impressions?: number;
          clicks?: number;
          conversions?: number;
          ctr?: number | null;
          cpc?: number | null;
          roas?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: {
          id: string;
          tenant_id: string;
          type: Database['public']['Enums']['report_type'];
          title: string;
          summary: string | null;
          period: string;
          agent_id: string | null;
          department_id: string | null;
          status: Database['public']['Enums']['report_status'];
          data: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          type?: Database['public']['Enums']['report_type'];
          title: string;
          summary?: string | null;
          period: string;
          agent_id?: string | null;
          department_id?: string | null;
          status?: Database['public']['Enums']['report_status'];
          data?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: Database['public']['Enums']['report_type'];
          title?: string;
          summary?: string | null;
          period?: string;
          agent_id?: string | null;
          department_id?: string | null;
          status?: Database['public']['Enums']['report_status'];
          data?: Json;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'agents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      integrations: {
        Row: {
          id: string;
          tenant_id: string;
          provider: string;
          type: string;
          display_name: string | null;
          config: Json;
          status: Database['public']['Enums']['integration_status'];
          health: Database['public']['Enums']['integration_health'];
          last_sync_at: string | null;
          error_log: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider: string;
          type: string;
          display_name?: string | null;
          config?: Json;
          status?: Database['public']['Enums']['integration_status'];
          health?: Database['public']['Enums']['integration_health'];
          last_sync_at?: string | null;
          error_log?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          provider?: string;
          type?: string;
          display_name?: string | null;
          config?: Json;
          status?: Database['public']['Enums']['integration_status'];
          health?: Database['public']['Enums']['integration_health'];
          last_sync_at?: string | null;
          error_log?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'integrations_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      audit_log: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          agent_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          metadata: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id?: string | null;
          agent_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_log_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_log_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_log_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'agents';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'owner' | 'admin' | 'operator' | 'viewer';
      agent_status: 'ativo' | 'pausado' | 'idle' | 'desativado';
      agent_type: 'ai' | 'human' | 'hybrid';
      squad_status: 'ativo' | 'pausado' | 'arquivado';
      alert_severity: 'critico' | 'alto' | 'medio' | 'baixo' | 'info';
      alert_status: 'ativo' | 'reconhecido' | 'resolvido' | 'ignorado';
      financial_record_type: 'receita' | 'despesa' | 'custo' | 'investimento';
      approval_status: 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado' | 'expirado';
      approval_type: 'financeiro' | 'operacional' | 'marketing' | 'campanha' | 'integracao' | 'geral';
      approval_urgency: 'baixa' | 'media' | 'alta' | 'critica';
      approval_action_type: 'aprovado' | 'rejeitado' | 'comentario' | 'delegado' | 'escalado';
      client_status: 'lead' | 'ativo' | 'inativo' | 'churned' | 'prospect';
      client_segment: 'b2b' | 'b2c' | 'vip' | 'revendedor';
      conversation_channel: 'whatsapp' | 'email' | 'instagram' | 'telefone' | 'chat' | 'site';
      conversation_status: 'aberta' | 'em_andamento' | 'aguardando' | 'resolvida' | 'escalada';
      message_direction: 'inbound' | 'outbound';
      message_source: 'cliente' | 'agente' | 'humano' | 'sistema';
      message_sentiment: 'positivo' | 'neutro' | 'negativo';
      campaign_status: 'rascunho' | 'ativa' | 'pausada' | 'encerrada' | 'agendada';
      campaign_channel: 'meta_ads' | 'google_ads' | 'instagram' | 'whatsapp' | 'email' | 'sms' | 'tiktok';
      report_status: 'gerando' | 'pronto' | 'erro' | 'arquivado';
      report_type: 'semanal' | 'mensal' | 'trimestral' | 'anual' | 'sob_demanda';
      integration_status: 'ativo' | 'inativo' | 'erro' | 'configurando';
      integration_health: 'healthy' | 'degraded' | 'down' | 'unknown';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ---- Helper Types ----
type PublicSchema = Database['public'];
type PublicTableNames = keyof PublicSchema['Tables'];
type PublicEnumNames = keyof PublicSchema['Enums'];

/** Extract the Row type for a given table name */
export type Tables<T extends PublicTableNames> = PublicSchema['Tables'][T]['Row'];

/** Extract the Insert type for a given table name */
export type TablesInsert<T extends PublicTableNames> = PublicSchema['Tables'][T]['Insert'];

/** Extract the Update type for a given table name */
export type TablesUpdate<T extends PublicTableNames> = PublicSchema['Tables'][T]['Update'];

/** Extract an enum type by name */
export type Enums<T extends PublicEnumNames> = PublicSchema['Enums'][T];
