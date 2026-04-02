-- ============================================================
-- 006_world.sql — World screen: rooms, connections,
-- agent presence, and notifications
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE room_status AS ENUM ('ativo', 'inativo', 'manutencao');
CREATE TYPE connection_type AS ENUM ('bidirecional', 'unidirecional', 'dependencia');
CREATE TYPE presence_status AS ENUM ('online', 'ocupado', 'idle', 'offline');
CREATE TYPE world_notification_type AS ENUM ('alerta', 'movimento', 'tarefa', 'sistema');

-- ============================================================
-- WORLD ROOMS
-- ============================================================

CREATE TABLE world_rooms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  domain      TEXT,
  description TEXT,
  x           NUMERIC(10, 2) NOT NULL DEFAULT 0,
  y           NUMERIC(10, 2) NOT NULL DEFAULT 0,
  width       NUMERIC(10, 2) NOT NULL DEFAULT 200,
  height      NUMERIC(10, 2) NOT NULL DEFAULT 150,
  status      room_status NOT NULL DEFAULT 'ativo',
  color       TEXT,
  icon        TEXT,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_world_rooms_tenant_id ON world_rooms(tenant_id);

-- ============================================================
-- WORLD CONNECTIONS
-- ============================================================

CREATE TABLE world_connections (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_a_id UUID NOT NULL REFERENCES world_rooms(id) ON DELETE CASCADE,
  room_b_id UUID NOT NULL REFERENCES world_rooms(id) ON DELETE CASCADE,
  type      connection_type NOT NULL DEFAULT 'bidirecional',
  label     TEXT,
  metadata  JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (room_a_id <> room_b_id)
);

CREATE INDEX idx_world_connections_rooms ON world_connections(room_a_id, room_b_id);

-- ============================================================
-- AGENT PRESENCE
-- ============================================================

CREATE TABLE agent_presence (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  room_id      UUID NOT NULL REFERENCES world_rooms(id) ON DELETE CASCADE,
  status       presence_status NOT NULL DEFAULT 'online',
  last_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_task TEXT,
  metadata     JSONB NOT NULL DEFAULT '{}',
  UNIQUE(agent_id, room_id)
);

CREATE INDEX idx_agent_presence_agent_id ON agent_presence(agent_id);
CREATE INDEX idx_agent_presence_room_id ON agent_presence(room_id);

-- ============================================================
-- WORLD NOTIFICATIONS
-- ============================================================

CREATE TABLE world_notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  room_id    UUID REFERENCES world_rooms(id) ON DELETE SET NULL,
  type       world_notification_type NOT NULL DEFAULT 'sistema',
  message    TEXT NOT NULL,
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at    TIMESTAMPTZ
);

CREATE INDEX idx_world_notifications_tenant_id ON world_notifications(tenant_id);
CREATE INDEX idx_world_notifications_room_id ON world_notifications(room_id);
CREATE INDEX idx_world_notifications_created_at ON world_notifications(created_at DESC);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER world_rooms_updated_at BEFORE UPDATE ON world_rooms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
