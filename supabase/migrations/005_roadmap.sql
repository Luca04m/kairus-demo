-- ============================================================
-- 005_roadmap.sql — Roadmap items, milestones, and comments
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE roadmap_status AS ENUM ('backlog', 'planejado', 'em_progresso', 'concluido', 'cancelado');
CREATE TYPE roadmap_priority AS ENUM ('baixa', 'media', 'alta', 'critica');
CREATE TYPE milestone_status AS ENUM ('pendente', 'em_progresso', 'concluido', 'atrasado');

-- ============================================================
-- ROADMAP ITEMS
-- ============================================================

CREATE TABLE roadmap_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  status              roadmap_status NOT NULL DEFAULT 'backlog',
  priority            roadmap_priority NOT NULL DEFAULT 'media',
  category            TEXT,
  owner_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  owner_squad_id      UUID REFERENCES squads(id) ON DELETE SET NULL,
  owner_agent_id      UUID REFERENCES agents(id) ON DELETE SET NULL,
  start_date          DATE,
  end_date            DATE,
  progress            INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags                TEXT[] NOT NULL DEFAULT '{}',
  metadata            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roadmap_items_tenant_id ON roadmap_items(tenant_id);
CREATE INDEX idx_roadmap_items_status ON roadmap_items(status);
CREATE INDEX idx_roadmap_items_priority ON roadmap_items(priority);
CREATE INDEX idx_roadmap_items_owner_dept ON roadmap_items(owner_department_id);
CREATE INDEX idx_roadmap_items_dates ON roadmap_items(start_date, end_date);

-- ============================================================
-- ROADMAP MILESTONES
-- ============================================================

CREATE TABLE roadmap_milestones (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  status     milestone_status NOT NULL DEFAULT 'pendente',
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roadmap_milestones_tenant_id ON roadmap_milestones(tenant_id);
CREATE INDEX idx_roadmap_milestones_date ON roadmap_milestones(date);

-- ============================================================
-- ROADMAP COMMENTS
-- ============================================================

CREATE TABLE roadmap_comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id    UUID NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  agent_id   UUID REFERENCES agents(id) ON DELETE SET NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roadmap_comments_item_id ON roadmap_comments(item_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER roadmap_items_updated_at BEFORE UPDATE ON roadmap_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER roadmap_milestones_updated_at BEFORE UPDATE ON roadmap_milestones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
