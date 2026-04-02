-- ============================================================
-- 008_integrations.sql — Integrations and Audit Log
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE integration_status AS ENUM ('ativo', 'inativo', 'erro', 'configurando');
CREATE TYPE integration_health AS ENUM ('healthy', 'degraded', 'down', 'unknown');

-- ============================================================
-- INTEGRATIONS
-- ============================================================

CREATE TABLE integrations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider     TEXT NOT NULL,
  type         TEXT NOT NULL,
  display_name TEXT,
  config       JSONB NOT NULL DEFAULT '{}',
  status       integration_status NOT NULL DEFAULT 'configurando',
  health       integration_health NOT NULL DEFAULT 'unknown',
  last_sync_at TIMESTAMPTZ,
  error_log    TEXT,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_integrations_tenant_id ON integrations(tenant_id);
CREATE INDEX idx_integrations_provider ON integrations(provider);
CREATE INDEX idx_integrations_status ON integrations(status);

-- ============================================================
-- AUDIT LOG (append-only)
-- ============================================================

CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  agent_id    UUID REFERENCES agents(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  metadata    JSONB NOT NULL DEFAULT '{}',
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_tenant_id ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_agent_id ON audit_log(agent_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
