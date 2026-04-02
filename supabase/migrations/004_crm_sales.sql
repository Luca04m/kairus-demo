-- ============================================================
-- 004_crm_sales.sql — CRM clients, conversations, messages,
-- and sales metrics
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE client_status AS ENUM ('lead', 'ativo', 'inativo', 'churned', 'prospect');
CREATE TYPE client_segment AS ENUM ('b2b', 'b2c', 'vip', 'revendedor');
CREATE TYPE conversation_channel AS ENUM ('whatsapp', 'email', 'instagram', 'telefone', 'chat', 'site');
CREATE TYPE conversation_status AS ENUM ('aberta', 'em_andamento', 'aguardando', 'resolvida', 'escalada');
CREATE TYPE message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE message_source AS ENUM ('cliente', 'agente', 'humano', 'sistema');
CREATE TYPE message_sentiment AS ENUM ('positivo', 'neutro', 'negativo');

-- ============================================================
-- CLIENTS
-- ============================================================

CREATE TABLE clients (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id      UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  email          TEXT,
  phone          TEXT,
  company        TEXT,
  segment        client_segment NOT NULL DEFAULT 'b2c',
  status         client_status NOT NULL DEFAULT 'lead',
  source         TEXT,
  lifetime_value NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tags           TEXT[] NOT NULL DEFAULT '{}',
  metadata       JSONB NOT NULL DEFAULT '{}',
  last_purchase  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_tenant_id ON clients(tenant_id);
CREATE INDEX idx_clients_segment ON clients(segment);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_company ON clients(company);

-- ============================================================
-- CONVERSATIONS
-- ============================================================

CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  agent_id        UUID REFERENCES agents(id) ON DELETE SET NULL,
  channel         conversation_channel NOT NULL DEFAULT 'whatsapp',
  status          conversation_status NOT NULL DEFAULT 'aberta',
  subject         TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}',
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_tenant_id ON conversations(tenant_id);
CREATE INDEX idx_conversations_client_id ON conversations(client_id);
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_channel ON conversations(channel);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- ============================================================
-- MESSAGES
-- ============================================================

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  direction       message_direction NOT NULL,
  content         TEXT NOT NULL,
  source          message_source NOT NULL DEFAULT 'cliente',
  sentiment       message_sentiment,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_source ON messages(source);

-- ============================================================
-- SALES METRICS (aggregated per agent per period)
-- ============================================================

CREATE TABLE sales_metrics (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id            UUID REFERENCES agents(id) ON DELETE SET NULL,
  period              TEXT NOT NULL,
  conversations_total INTEGER NOT NULL DEFAULT 0,
  resolved            INTEGER NOT NULL DEFAULT 0,
  conversion_rate     NUMERIC(5, 2) NOT NULL DEFAULT 0,
  avg_response_time   INTERVAL,
  revenue_generated   NUMERIC(14, 2) NOT NULL DEFAULT 0,
  metadata            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_metrics_tenant_id ON sales_metrics(tenant_id);
CREATE INDEX idx_sales_metrics_agent_id ON sales_metrics(agent_id);
CREATE INDEX idx_sales_metrics_period ON sales_metrics(period);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER sales_metrics_updated_at BEFORE UPDATE ON sales_metrics
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
