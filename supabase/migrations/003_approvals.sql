-- ============================================================
-- 003_approvals.sql — Approval workflow
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE approval_status AS ENUM ('pendente', 'aprovado', 'rejeitado', 'cancelado', 'expirado');
CREATE TYPE approval_type AS ENUM ('financeiro', 'operacional', 'marketing', 'campanha', 'integracao', 'geral');
CREATE TYPE approval_urgency AS ENUM ('baixa', 'media', 'alta', 'critica');
CREATE TYPE approval_action_type AS ENUM ('aprovado', 'rejeitado', 'comentario', 'delegado', 'escalado');

-- ============================================================
-- APPROVALS
-- ============================================================

CREATE TABLE approvals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  requester_id  UUID REFERENCES agents(id) ON DELETE SET NULL,
  approver_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type          approval_type NOT NULL DEFAULT 'geral',
  title         TEXT NOT NULL,
  description   TEXT,
  status        approval_status NOT NULL DEFAULT 'pendente',
  amount        NUMERIC(14, 2),
  urgency       approval_urgency NOT NULL DEFAULT 'media',
  metadata      JSONB NOT NULL DEFAULT '{}',
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at   TIMESTAMPTZ
);

CREATE INDEX idx_approvals_tenant_id ON approvals(tenant_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_requester_id ON approvals(requester_id);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX idx_approvals_urgency ON approvals(urgency);
CREATE INDEX idx_approvals_created_at ON approvals(created_at DESC);

-- ============================================================
-- APPROVAL ACTIONS (audit trail)
-- ============================================================

CREATE TABLE approval_actions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  approval_id UUID NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      approval_action_type NOT NULL,
  comment     TEXT,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_approval_actions_approval_id ON approval_actions(approval_id);
CREATE INDEX idx_approval_actions_user_id ON approval_actions(user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER approvals_updated_at BEFORE UPDATE ON approvals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
