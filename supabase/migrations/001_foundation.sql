-- ============================================================
-- 001_foundation.sql — Core tables for Kairus Demo
-- Multi-tenant foundation: tenants, profiles, departments,
-- squads, and agents.
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'operator', 'viewer');
CREATE TYPE agent_status AS ENUM ('ativo', 'pausado', 'idle', 'desativado');
CREATE TYPE agent_type AS ENUM ('ai', 'human', 'hybrid');
CREATE TYPE squad_status AS ENUM ('ativo', 'pausado', 'arquivado');

-- ============================================================
-- TENANTS
-- ============================================================

CREATE TABLE tenants (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  settings   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);

-- ============================================================
-- PROFILES (linked to auth.users)
-- ============================================================

CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  role       user_role NOT NULL DEFAULT 'operator',
  avatar_url TEXT,
  settings   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================
-- DEPARTMENTS
-- ============================================================

CREATE TABLE departments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  color       TEXT NOT NULL DEFAULT '#6366f1',
  icon        TEXT NOT NULL DEFAULT 'Building',
  emoji       TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

CREATE INDEX idx_departments_tenant_id ON departments(tenant_id);

-- ============================================================
-- SQUADS
-- ============================================================

CREATE TABLE squads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  status        squad_status NOT NULL DEFAULT 'ativo',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, department_id, name)
);

CREATE INDEX idx_squads_tenant_id ON squads(tenant_id);
CREATE INDEX idx_squads_department_id ON squads(department_id);

-- ============================================================
-- AGENTS
-- ============================================================

CREATE TABLE agents (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  squad_id            UUID REFERENCES squads(id) ON DELETE SET NULL,
  department_id       UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  initials            TEXT NOT NULL,
  type                agent_type NOT NULL DEFAULT 'ai',
  status              agent_status NOT NULL DEFAULT 'ativo',
  description         TEXT,
  skills              TEXT[] NOT NULL DEFAULT '{}',
  config              JSONB NOT NULL DEFAULT '{}',
  performance_metrics JSONB NOT NULL DEFAULT '{"tasks_completed": 0, "tasks_failed": 0, "approval_rate": 0}',
  last_action         TEXT,
  last_action_at      TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_tenant_id ON agents(tenant_id);
CREATE INDEX idx_agents_department_id ON agents(department_id);
CREATE INDEX idx_agents_squad_id ON agents(squad_id);
CREATE INDEX idx_agents_status ON agents(status);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER squads_updated_at BEFORE UPDATE ON squads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON AUTH SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, tenant_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'tenant_id')::UUID, (SELECT id FROM tenants LIMIT 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'operator')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
