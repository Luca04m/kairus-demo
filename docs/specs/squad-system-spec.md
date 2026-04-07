# Squad System — Implementation Specification

> Reverse-engineered from `kairus-dashboard` (engine v0.5.0, dashboard SPA).
> Source: `/Volumes/KINGSTON/kairus-dashboard/`

---

## 1. Squad Model

### 1.1 Data Shape

```typescript
// src/types/index.ts:86-97
interface Squad {
  id: string;            // kebab-case slug, e.g. "copywriting", "full-stack-dev"
  name: string;          // human-readable, e.g. "Full Stack Dev"
  description: string;
  domain?: string;       // business domain, e.g. "engineering", "content"
  icon?: string;
  agentCount: number;    // populated from file-system count or registry
  type?: SquadType;      // UI-only, inferred or mapped
  status?: 'active' | 'busy' | 'inactive';  // UI-only
  capabilities?: string[];
}

// Extended detail with agents
interface SquadDetail extends Squad {
  agents: AgentSummary[];
  config?: Record<string, unknown>;
}
```

### 1.2 Squad Type System

Squads are classified into 11 UI types for color-coding and visual grouping:

```typescript
// src/types/index.ts:2-11
type SquadType =
  | 'copywriting'    // orange
  | 'design'         // purple
  | 'creator'        // green
  | 'orchestrator'   // cyan
  | 'content'        // red
  | 'development'    // blue
  | 'engineering'    // indigo
  | 'analytics'      // teal
  | 'marketing'      // pink
  | 'advisory'       // yellow
  | 'default';       // gray
```

**Type resolution order** (`src/types/index.ts:70-84`):

1. Exact match in `squadTypeMap` (30+ explicit mappings)
2. Regex pattern matching via `squadTypePatterns` (14 patterns)
3. Fallback to `'default'`

The hook `useSquads.ts:8-25` performs a secondary inference pass using ID and domain substrings (copy, sales, design, etc.).

### 1.3 Squad Discovery (Engine)

The engine discovers squads from the filesystem at runtime (`engine/src/routes/registry.ts:118-185`):

**Fast path**: Parse `SQUAD-REGISTRY.yaml` in `.aios-core/`
```yaml
squads:
  - id: copywriting
    name: Copywriting
    domain: communication
    agents: [copywriter, editor]
```

**Fallback**: Scan `squads/` directory. For each subdirectory:
- Check for `squad.yaml` or `config.yaml` (extract name, description, domain)
- Count `.md` files in `agents/` subdirectory -> `agentCount`
- Count `.md` files in `tasks/` subdirectory -> `taskCount`

### 1.4 Squad API

| Endpoint | Method | Source | Description |
|----------|--------|--------|-------------|
| `/registry/squads` | GET | Engine | Discover all squads from filesystem |
| `/squads` | GET | API Client | Fallback squad list |
| `/squads/:id` | GET | API Client | Squad detail with agents |
| `/squads/:id/stats` | GET | API Client | Quality scores, tier breakdown |
| `/squads/ecosystem/overview` | GET | API Client | Global counts + tier distribution |

The frontend uses engine-first, API-fallback pattern (`src/services/api/squads.ts:19-41`):

```
hasEngine() ? engineApi.getRegistrySquads() : apiClient.get('/squads')
```

---

## 2. Agent Model

### 2.1 Data Shape

```typescript
// src/types/index.ts:140-205
type AgentTier = 0 | 1 | 2;  // 0=Orchestrator, 1=Master, 2=Specialist

interface AgentSummary {
  id: string;             // kebab-case, e.g. "copywriter", "ux-design-expert"
  name: string;
  title?: string;
  icon?: string;
  tier: AgentTier;
  squad: string;          // parent squad ID
  description?: string;
  whenToUse?: string;
  commandCount?: number;
}

interface Agent extends AgentSummary {
  persona?: AgentPersona;
  corePrinciples?: string[];
  commands?: AgentCommand[];
  mindSource?: { name, credentials, frameworks };
  voiceDna?: { sentenceStarters, vocabulary: { alwaysUse, neverUse } };
  antiPatterns?: { neverDo: string[] };
  integration?: { receivesFrom: string[], handoffTo: string[] };
  quality?: { hasVoiceDna, hasAntiPatterns, hasIntegration };
  status?: 'online' | 'busy' | 'offline';  // UI-only
  model?: string;
  lastActive?: string;
  executionCount?: number;
}
```

### 2.2 Agent File Format

Agents are defined as Markdown files at:
- `.aios-core/development/agents/{agentId}.md` (core/shared agents)
- `squads/{squadId}/agents/{agentId}.md` (squad-specific agents)

File structure (`engine/src/core/context-builder.ts:9-14`):
```markdown
# {agent-id}
[activation notice]
```yaml
name: "Agent Name"
title: "Job Title"
role: "Role description"
persona:
  style: "..."
  identity: "..."
core_principles:
  - "Principle 1"
```
## Sections
[Detailed instructions]
```

### 2.3 Agent Discovery (Engine)

`engine/src/routes/registry.ts:187-225`:

1. Core agents from `.aios-core/development/agents/*.md`
2. Squad agents from `squads/{squadId}/agents/*.md`
3. Headers parsed for role/description from first 10 lines

### 2.4 Agent API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/registry/agents` | GET | All agents (optional `?squad=` filter) |
| `/registry/agents/:squadId/:agentId` | GET | Full agent detail with file content |

### 2.5 Agent Presence / Activity

**AgentActivityStore** (`src/stores/agentActivityStore.ts`) bridges real-time monitor events to per-agent activity state:

- Subscribes to `MonitorStore.events` changes
- Maps agent names (normalizes `@dev (Dex)` -> `dex`)
- Tracks: `action`, `type`, `tool`, `isActive`, `timestamp`
- Auto-deactivates after 8s, clears stale after 15s
- Activity labels derived from tool names: Read -> "Reading file...", Edit -> "Editing code..."

**PresenceStore** (`src/stores/presenceStore.ts`) is demo-only with hardcoded users and random view changes every 20s. No real presence protocol exists yet.

---

## 3. Department Model

**There is no explicit department entity.** Departments are implicitly represented through:

1. **Squad `domain` field** — groups squads by business area ("engineering", "content", "communication")
2. **SquadType enum** — 11 types that serve as visual/logical departments
3. **Squad type patterns** — regex-based classification (`src/types/index.ts:53-68`)
4. **Team Bundles** (`engine/src/core/team-bundle.ts`) — YAML-defined agent groups that restrict which agents can participate in executions

Bundle format (`.aios-core/development/agent-teams/*.yaml`):
```yaml
bundle:
  name: "Core Dev Team"
  icon: "🛠"
  description: "Engineering agents"
agents:
  - dev
  - qa
  - architect
  # or '*' for wildcard
workflows:
  - dev-story.yaml
```

Bundles provide soft department boundaries: `isAgentInBundle()` checks whether an agent is allowed to execute under the active bundle.

---

## 4. Engine / Backend

### 4.1 Architecture

- **Runtime**: Bun + Hono (HTTP framework)
- **Database**: SQLite (bun:sqlite) with WAL mode
- **Port**: 4002 (configurable via `ENGINE_PORT` env)
- **WebSocket**: `/live` endpoint (Bun native upgrade)
- **Config**: `engine.config.yaml` (YAML, deep-merged with defaults)

### 4.2 Route Structure

```
/health          — GET  — Engine health + WS client count
/pool            — GET  — Process pool status (slots, queue depth)
/pool/resize     — POST — Resize pool
/jobs            — GET  — List jobs (filter by status/squad/agent)
/jobs/:id        — GET  — Job detail
/jobs/:id/logs   — GET  — Job stdout logs
/jobs/:id        — DELETE — Cancel job
/execute/agent   — POST — Enqueue agent execution (async)
/execute/status/:id — GET — Execution status
/execute/history — GET  — Execution history
/execute/stats   — GET  — Aggregate stats (counts, success rate)
/execute/orchestrate — POST — Start workflow
/execute/orchestrate/active — GET — Active workflows
/execute/orchestrate/:id — GET — Workflow state
/execute/workflows — GET — Available workflow definitions
/execute/track   — POST — Track external execution
/stream/agent    — POST — Execute with SSE streaming
/webhook/orchestrator — POST — Intelligent keyword routing
/webhook/:squadId — POST — Direct squad webhook
/memory/:scope   — POST — Store memory
/memory/recall   — POST — Recall memories
/cron            — CRUD — Cron job management
/registry/project — GET — Project paths
/registry/squads — GET  — Discover squads
/registry/agents — GET  — Discover agents
/registry/workflows — GET — Discover workflow definitions
/registry/tasks  — GET  — Discover tasks
/authority/check — POST — Permission check
/authority/audit — GET  — Audit log
/authority/reload — POST — Reload rules
/bundles         — GET  — List team bundles
/bundles/activate — POST — Set active bundle
/whatsapp/*      — WhatsApp integration
```

### 4.3 Core Modules

**Process Pool** (`engine/src/core/process-pool.ts`):
- N slots based on CPU cores (capped by `pool.max_concurrent`)
- Slot states: `idle` | `spawning` | `running`
- Per-squad concurrency limit (`max_per_squad`)
- P0 preemption (optional, kills lowest-priority running job)
- Zombie detection every 30s (checks PID existence)
- Event-driven: `onSlotFree` -> `processQueue()`

**Job Queue** (`engine/src/core/job-queue.ts`):
- SQLite-backed, priority-sorted (0=urgent, 3=low)
- State machine: `pending -> running -> done|failed|timeout|cancelled`
- Retry: `failed|timeout -> pending` (up to `max_attempts`)
- ULID-based IDs

**Context Builder** (`engine/src/core/context-builder.ts`):
- Loads agent `.md` file (core path first, then squad path)
- Recalls memories from Supermemory MCP (3 scopes: global, squad, agent)
- Loads squad config for context
- Assembles prompt: persona + squad context + memories + task
- Trims to token budget (prioritizes persona > task > squad > memories)
- SHA-256 hash for dedup/cache

**Workflow Engine** (`engine/src/core/workflow-engine.ts`):
- State machine for multi-phase workflows
- Loaded from `.aios-core/development/workflows/*.yaml`
- Phase transitions driven by job completion + verdict detection
- Verdicts parsed from output: GO/PASS/APPROVE/BLOCKED/FAIL/REJECT
- Loop-type workflows with `maxIterations` guard
- SQLite `workflow_state` table

**Delegation Protocol** (`engine/src/core/delegation-protocol.ts`):
- Agents emit `<!-- DELEGATE: {"tasks":[...]} -->` markers in output
- Parsed post-completion by `completion-handler`
- Creates child jobs with `parent_job_id`
- Barrier sync for sequential dependencies
- Result aggregation when all sub-jobs complete

**Authority Enforcer** (`engine/src/core/authority-enforcer.ts`):
- Parses `.claude/rules/agent-authority.md`
- Rules: exclusive operations, blocked operations, superuser agents
- Checked before each spawn in process-pool
- In-memory audit log (last 1000 entries)

**Completion Handler** (`engine/src/core/completion-handler.ts`):
- Extracts memories from output (scoped protocol: `### Scope: squad:X`)
- Records execution metrics in `executions` table
- Sends webhook callbacks (3 retries, exponential backoff)
- Signals workflow engine
- Parses delegation markers
- Cleans up workspace

### 4.4 Execution Flow

```
Request (GUI/Webhook/Cron/Workflow)
  -> job-queue.enqueue()
  -> broadcast('job:created')
  -> processQueue() picks up pending job
  -> authority-enforcer.canExecute()
  -> context-builder.buildContext() [agent.md + memories + squad]
  -> workspace-manager.createWorkspace() [worktree or directory]
  -> Bun.spawn('claude', '-p', prompt)
  -> Wait for exit
  -> completion-handler.handleCompletion()
     -> Extract memories
     -> Record metrics
     -> broadcast('job:completed'|'job:failed')
     -> Signal workflow engine
     -> Parse delegation markers
     -> Send callback
     -> Cleanup workspace
  -> Free slot -> emitSlotFree() -> processQueue()
```

---

## 5. Realtime

### 5.1 WebSocket Protocol

**Engine WS** (`ws://engine:4002/live`):
- Bun native WebSocket (not Hono middleware)
- On connect: sends `{ type: 'init', events: [...] }` (last 100 buffered events)
- Sends `{ type: 'room_update', payload: { connected: true, engine: true } }`
- Heartbeat: server pings every 30s, expects pong
- Events wrapped as `{ type: 'event', event: <MonitorEvent> }`

**Monitor WS** (`ws://monitor:4001/stream`):
- Fallback when engine unavailable
- Same `init` + `event` protocol

**Cloud Relay WS** (optional):
- URL: `VITE_RELAY_URL/dashboard?room=X&token=Y`
- Room-based multi-tenant, sends `room_update` for CLI connection status

### 5.2 WS Event Types

```typescript
// engine/src/types.ts:159-172
type WSEventType =
  | 'job:created' | 'job:started' | 'job:completed' | 'job:failed' | 'job:progress'
  | 'workflow:phase_started' | 'workflow:phase_completed' | 'workflow:phase_changed'
  | 'workflow:completed' | 'workflow:failed'
  | 'memory:stored'
  | 'pool:updated';
```

### 5.3 MonitorStore-Compatible Format

Engine events are translated to MonitorStore format (`engine/src/lib/ws.ts:160-198`):

```typescript
interface MonitorEvent {
  id: string;
  timestamp: string;
  type: 'tool_call' | 'message' | 'error' | 'system';
  agent: string;
  description: string;
  duration?: number;
  success?: boolean;
  aios_agent?: string;
  tool_name?: string;
  jobId?: string;
  squadId?: string;
}
```

### 5.4 SSE Streaming

`POST /stream/agent` returns Server-Sent Events:
- `event: start` — execution ID, agent name
- `event: text` — streaming content chunks
- `event: tools` — tool use notifications
- `event: done` — duration, token usage
- `event: error` — error message
- `data: [DONE]` — stream termination

Claude CLI `--output-format stream-json` output is mapped to these SSE events.

---

## 6. State Management

### 6.1 Store Architecture

All stores use **Zustand** (no Redux). Key stores:

| Store | File | Purpose |
|-------|------|---------|
| `useUIStore` | `uiStore.ts` | View routing, sidebar, theme, selected squad/agent, world zoom. Persisted to localStorage. |
| `useMonitorStore` | `monitorStore.ts` | WebSocket connection, real-time events, metrics, alerts. Manages WS lifecycle. |
| `useAgentActivityStore` | `agentActivityStore.ts` | Per-agent live activity derived from monitor events. |
| `useOrchestrationStore` | `orchestrationStore.ts` | Background orchestration task state, live task snapshots. |
| `usePresenceStore` | `presenceStore.ts` | Demo-only multi-user presence simulation. |

### 6.2 React Query Layer

Squad/agent data fetched via **TanStack React Query** hooks (`src/hooks/useSquads.ts`):

| Hook | Query Key | Stale Time | Description |
|------|-----------|------------|-------------|
| `useSquads()` | `['squads']` | 5 min | All squads, enriched with SquadType |
| `useSquad(id)` | `['squad', id]` | 5 min | Squad detail with agents |
| `useSquadStats(id)` | `['squadStats', id]` | 5 min | Quality metrics |
| `useEcosystemOverview()` | `['ecosystemOverview']` | 10 min | Global totals |
| `useSquadConnections(id)` | `['squadConnections', id]` | 5 min | Agent connections (mock fallback) |

### 6.3 Data Flow

```
Engine (filesystem) -> /registry/squads -> squadsApi.getSquads() -> useSquads() hook
                                                                     -> enrichSquad() adds SquadType
                                                                     -> React Query cache (5 min)
                                                                     -> Components consume

Engine (WebSocket) -> MonitorStore.events -> AgentActivityStore.processEvent()
                                          -> Per-agent activity state
                                          -> Components read via getActivity(agentName)
```

### 6.4 Selection State

`useUIStore` holds selection state:
- `selectedSquadId` — currently focused squad
- `selectedAgentId` — currently focused agent (cleared on squad change)
- `selectedRoomId` — world view room focus
- `worldZoom: 'map' | 'room'` — zoom level
- `enterRoom(id)` sets all three: roomId + zoom + squadId
- `exitRoom()` clears to map view

---

## 7. Tenant Awareness

### 7.1 Current State

**No explicit multi-tenancy in the engine.** The system is single-project by design.

### 7.2 Implicit Isolation

- **Project root** resolves via `ProjectResolver` (`engine/src/lib/project-resolver.ts`): walks up filesystem for `.aios-core/`, configurable via `AIOS_PROJECT_ROOT`, `--project-root`, or `engine.config.yaml`
- **Cloud relay** provides room-based isolation: each CLI instance gets a unique room, dashboard connects with `?room=X&token=Y`
- **Auth token** stored in localStorage as `aios_token`, passed via URL params or relay WebSocket
- **Webhook auth**: Bearer token in `engine.config.yaml` -> `auth.webhook_token`
- **Squad-scoped concurrency**: `max_per_squad` in pool config

### 7.3 Multi-Tenant Extension Points

To add true multi-tenancy, these would need modification:
- Database: add `tenant_id` column to all tables
- Registry: scope filesystem discovery to tenant-specific directories
- Pool: per-tenant slot allocation
- WebSocket: tenant-filtered event broadcasting
- Auth: JWT with tenant claims replacing simple token

---

## 8. Screen Consumption

### 8.1 World View

The World view uses `useUIStore` for:
- `worldZoom: 'map' | 'room'` — controls map vs room-level rendering
- `selectedRoomId` — maps to `squadId`
- `enterRoom(squadId)` — drills into a squad room
- `exitRoom()` — returns to map overview

Squads are rendered as interactive "rooms" on a spatial map. Each room shows:
- Squad name, icon, type (color-coded)
- Agent count
- Active agent indicators (from `AgentActivityStore`)
- Status badge

### 8.2 Roadmap View

Uses `useSquads()` to list squads, `useSquadStats(id)` for quality scores. Squad selection via `setSelectedSquadId()` triggers detail loading.

### 8.3 Sales Room / Chat

Chat sessions reference squads via `ChatSession.squadId` and `squadType` (`src/types/index.ts:244-254`). Messages carry `squadId` and `squadType` for visual grouping. Agent execution targets a specific `squadId + agentId` pair.

### 8.4 Cockpit / Dashboard

Consumes `useEcosystemOverview()` for total counts and tier distributions. Shows aggregate metrics across all squads.

### 8.5 Engine View

Directly uses `engineApi` methods:
- `engineApi.pool()` — slot status
- `engineApi.listJobs()` — job queue
- `engineApi.listCrons()` — scheduled jobs
- `engineApi.listBundles()` — team bundles
- `engineApi.getProjectInfo()` — project paths

### 8.6 Agent Directory

Uses `engineApi.getRegistryAgents()` + `engineApi.getRegistryAgent(squadId, agentId)` for full agent detail including markdown content. Navigation via `navigateToRegistryAgent(agentId)`.

### 8.7 Orchestrator View

`useOrchestrationStore` tracks live orchestration:
- `liveTask` snapshot includes: squad selections, agent outputs, streaming agents
- `squadSelections` array: `{ squadId, chief, agentCount, agents[] }`
- `agentOutputs` array: `{ stepId, agent: { id, name, squad }, role, response, llmMetadata }`

---

## Appendix A: Key File References

| Component | Path |
|-----------|------|
| Types | `src/types/index.ts` |
| Squad API | `src/services/api/squads.ts` |
| Engine API | `src/services/api/engine.ts` |
| Squad Hook | `src/hooks/useSquads.ts` |
| Connection Config | `src/lib/connection.ts` |
| UI Store | `src/stores/uiStore.ts` |
| Monitor Store | `src/stores/monitorStore.ts` |
| Agent Activity | `src/stores/agentActivityStore.ts` |
| Orchestration | `src/stores/orchestrationStore.ts` |
| Presence | `src/stores/presenceStore.ts` |
| Engine Entry | `engine/src/index.ts` |
| Engine Types | `engine/src/types.ts` |
| Registry Routes | `engine/src/routes/registry.ts` |
| Execute Routes | `engine/src/routes/execute.ts` |
| Stream Routes | `engine/src/routes/stream.ts` |
| Webhook Routes | `engine/src/routes/webhooks.ts` |
| Process Pool | `engine/src/core/process-pool.ts` |
| Job Queue | `engine/src/core/job-queue.ts` |
| Context Builder | `engine/src/core/context-builder.ts` |
| Workflow Engine | `engine/src/core/workflow-engine.ts` |
| Authority | `engine/src/core/authority-enforcer.ts` |
| Delegation | `engine/src/core/delegation-protocol.ts` |
| Completion | `engine/src/core/completion-handler.ts` |
| Workspace | `engine/src/core/workspace-manager.ts` |
| Team Bundles | `engine/src/core/team-bundle.ts` |
| Memory Client | `engine/src/core/memory-client.ts` |
| WebSocket | `engine/src/lib/ws.ts` |
| Config | `engine/src/lib/config.ts` |
| Project Resolver | `engine/src/lib/project-resolver.ts` |
| Database | `engine/src/lib/db.ts` |

## Appendix B: Database Schema (Inferred)

```sql
-- Jobs table
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  squad_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 2,
  input_payload TEXT NOT NULL,
  output_result TEXT,
  context_hash TEXT,
  parent_job_id TEXT,
  workflow_id TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'gui',
  callback_url TEXT,
  workspace_dir TEXT,
  pid INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  timeout_ms INTEGER NOT NULL DEFAULT 300000,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  error_message TEXT,
  metadata TEXT
);

-- Executions metrics table
CREATE TABLE executions (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  squad_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  duration_ms INTEGER,
  exit_code INTEGER,
  tokens_used INTEGER,
  files_changed INTEGER DEFAULT 0,
  memory_stored INTEGER DEFAULT 0,
  success BOOLEAN NOT NULL,
  created_at TEXT NOT NULL
);

-- Workflow state table
CREATE TABLE workflow_state (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  definition_id TEXT NOT NULL,
  current_phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  phase_history TEXT NOT NULL DEFAULT '[]',
  iteration_count INTEGER NOT NULL DEFAULT 0,
  parent_job_id TEXT,
  input_payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Memory log table
CREATE TABLE memory_log (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  scope TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT,
  tags TEXT,
  backend TEXT NOT NULL DEFAULT 'local',
  stored_at TEXT NOT NULL
);

-- Migrations tracking
CREATE TABLE _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```
