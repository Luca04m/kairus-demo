// src/types/integrations.ts
// Integration, connection health, and WhatsApp config types

import type { UUID, TenantId, ISODateString } from './common';

// ─── Integration Platform ─────────────────────────────────
export type IntegrationPlatform =
  | 'meta_business'
  | 'whatsapp_business'
  | 'google_analytics'
  | 'google_ads'
  | 'shopee'
  | 'mercado_livre'
  | 'erp_webhook';

// ─── Connection Status ────────────────────────────────────
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'pending';

// ─── Integration ──────────────────────────────────────────
export interface Integration {
  id: UUID;
  tenant_id: TenantId;
  platform: IntegrationPlatform;
  label: string;
  status: ConnectionStatus;
  is_enabled: boolean;
  /** OAuth or API key (masked) */
  credentials_hint?: string;
  last_sync_at?: ISODateString;
  error_message?: string;
  config?: Record<string, unknown>;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Connection Health ────────────────────────────────────
export interface ConnectionHealth {
  platform: IntegrationPlatform;
  status: ConnectionStatus;
  latency_ms?: number;
  last_check_at: ISODateString;
  uptime_percentage?: number;
  error?: string;
}

// ─── WhatsApp Config ──────────────────────────────────────
export interface WhatsAppConfig {
  integration_id: UUID;
  phone_number: string;
  display_name: string;
  /** Auto-reply enabled */
  auto_reply_enabled: boolean;
  /** Max messages before escalation */
  escalation_threshold: number;
  /** Business hours for auto-reply */
  business_hours: {
    start: string;
    end: string;
    timezone: string;
  };
  /** Greeting message template */
  greeting_template?: string;
  /** Away message template */
  away_template?: string;
  /** Agent ID responsible for WhatsApp interactions */
  agent_id?: UUID;
}

// ─── Webhook Config ───────────────────────────────────────
export interface WebhookConfig {
  integration_id: UUID;
  url: string;
  secret?: string;
  events: string[];
  is_active: boolean;
  last_delivery_at?: ISODateString;
  last_delivery_status?: 'success' | 'failure';
}
