-- ============================================================
-- 007_marketing_reports.sql — Campaigns and Reports
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE campaign_status AS ENUM ('rascunho', 'ativa', 'pausada', 'encerrada', 'agendada');
CREATE TYPE campaign_channel AS ENUM ('meta_ads', 'google_ads', 'instagram', 'whatsapp', 'email', 'sms', 'tiktok');
CREATE TYPE report_status AS ENUM ('gerando', 'pronto', 'erro', 'arquivado');
CREATE TYPE report_type AS ENUM ('semanal', 'mensal', 'trimestral', 'anual', 'sob_demanda');

-- ============================================================
-- CAMPAIGNS
-- ============================================================

CREATE TABLE campaigns (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  channel     campaign_channel NOT NULL DEFAULT 'meta_ads',
  status      campaign_status NOT NULL DEFAULT 'rascunho',
  budget      NUMERIC(14, 2) NOT NULL DEFAULT 0,
  spent       NUMERIC(14, 2) NOT NULL DEFAULT 0,
  reach       INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks      INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  ctr         NUMERIC(8, 4),
  cpc         NUMERIC(8, 4),
  roas        NUMERIC(8, 4),
  start_date  DATE,
  end_date    DATE,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_tenant_id ON campaigns(tenant_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_channel ON campaigns(channel);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- ============================================================
-- REPORTS
-- ============================================================

CREATE TABLE reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type          report_type NOT NULL DEFAULT 'semanal',
  title         TEXT NOT NULL,
  summary       TEXT,
  period        TEXT NOT NULL,
  agent_id      UUID REFERENCES agents(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  status        report_status NOT NULL DEFAULT 'gerando',
  data          JSONB NOT NULL DEFAULT '{}',
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_tenant_id ON reports(tenant_id);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_agent_id ON reports(agent_id);
CREATE INDEX idx_reports_period ON reports(period);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
