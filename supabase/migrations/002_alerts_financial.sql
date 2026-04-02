-- ============================================================
-- 002_alerts_financial.sql — Alerts and Financial records
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE alert_severity AS ENUM ('critico', 'alto', 'medio', 'baixo', 'info');
CREATE TYPE alert_status AS ENUM ('ativo', 'reconhecido', 'resolvido', 'ignorado');
CREATE TYPE financial_record_type AS ENUM ('receita', 'despesa', 'custo', 'investimento');

-- ============================================================
-- ALERTS
-- ============================================================

CREATE TABLE alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id    UUID REFERENCES agents(id) ON DELETE SET NULL,
  department  TEXT,
  severity    alert_severity NOT NULL DEFAULT 'info',
  title       TEXT NOT NULL,
  message     TEXT,
  status      alert_status NOT NULL DEFAULT 'ativo',
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_alerts_tenant_id ON alerts(tenant_id);
CREATE INDEX idx_alerts_agent_id ON alerts(agent_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

-- ============================================================
-- FINANCIAL RECORDS
-- ============================================================

CREATE TABLE financial_records (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  category      TEXT NOT NULL,
  subcategory   TEXT,
  description   TEXT,
  amount        NUMERIC(14, 2) NOT NULL,
  type          financial_record_type NOT NULL,
  period        TEXT NOT NULL,
  reference_date DATE,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_financial_records_tenant_id ON financial_records(tenant_id);
CREATE INDEX idx_financial_records_department_id ON financial_records(department_id);
CREATE INDEX idx_financial_records_period ON financial_records(period);
CREATE INDEX idx_financial_records_type ON financial_records(type);
CREATE INDEX idx_financial_records_category ON financial_records(category);

-- ============================================================
-- FINANCIAL MARGINS
-- ============================================================

CREATE TABLE financial_margins (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id      UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category       TEXT NOT NULL,
  subcategory    TEXT,
  margin_percent NUMERIC(8, 4) NOT NULL,
  period         TEXT NOT NULL,
  metadata       JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_financial_margins_tenant_id ON financial_margins(tenant_id);
CREATE INDEX idx_financial_margins_period ON financial_margins(period);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER alerts_updated_at BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER financial_records_updated_at BEFORE UPDATE ON financial_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER financial_margins_updated_at BEFORE UPDATE ON financial_margins
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
