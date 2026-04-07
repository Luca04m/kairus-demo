# World Screen — Complete Implementation Specification

> Reverse-engineered from `kairus-dashboard/src/components/world/`
> Target stack: **Next.js 16 + React 19 + Tailwind 4**

---

## 1. Component Tree

```
GatherWorld                          ← entry point, exported from index.ts
└─ DomainProvider                    ← React Context for theme-aware domain colors
   └─ GatherWorldInner
      ├─ AnimatePresence (mode="wait")
      │   ├─ [worldZoom === 'map']
      │   │   └─ WorldMap
      │   │       ├─ DomainLabels          ← floating domain cluster labels
      │   │       ├─ WorkflowLines         ← SVG dashed lines between rooms
      │   │       └─ IsometricTile (×19)   ← one per room
      │   │           └─ room.icon + activity dots
      │   │
      │   └─ [worldZoom === 'room']
      │       └─ RoomView
      │           ├─ RoomEnvironment       ← walls, windows, clock, plaque
      │           ├─ AmbientParticles      ← floating domain-themed chars
      │           ├─ RoomFurniture         ← pixel-art SVG furniture
      │           ├─ EmbeddedScreen (×N)   ← animated screens on monitors/projectors
      │           ├─ InteractionLine (×N)  ← dashed lines between chatting agents
      │           ├─ InteractiveFurniture  ← hover hit-areas with tooltips
      │           ├─ AgentSprite (×N)      ← pixel-art agent with movement
      │           │   └─ hover tooltip (name, tier, activity)
      │           ├─ SpeechBubble (×N)     ← random ambient bubbles
      │           ├─ LiveSpeechBubble (×N) ← real-time activity bubbles (priority)
      │           ├─ AgentEmotes           ← radial emote ring (right-click)
      │           │   └─ FloatingEmote     ← rising fade animation
      │           └─ day/night overlay
      │
      ├─ Door transition overlay       ← vignette + expanding door frame
      ├─ Zoom controls (bottom-left)   ← +, reset%, - buttons
      ├─ WorldNotifications (top-right)← toast-style live/demo notifications
      ├─ WorldMinimap (bottom-right)   ← only on map view, hidden <md
      └─ WorldWorkflowPanel (bottom)   ← only on map view, expandable bar
```

### Props Summary

| Component | Key Props |
|-----------|-----------|
| `GatherWorld` | none (self-contained) |
| `WorldMap` | `onRoomClick(roomId)`, `zoom`, `onZoomChange(zoom)`, `highlightedRooms: string[]` |
| `IsometricTile` | `col`, `row`, `color`, `borderColor`, `highlighted`, `pulse`, `onClick`, `children`, `offsetX`, `offsetY` |
| `RoomView` | `roomId`, `onBack()`, `zoom`, `onZoomChange(zoom)` |
| `AgentSprite` | `name`, `domain`, `tier`, `status`, `x`, `y`, `selected`, `isChief`, `onClick`, `onContextMenu`, `facing`, `activity`, `activityLabel`, `liveActive` |
| `AgentInteractionPanel` | `agentId`, `roomId`, `onClose()`, `onStartChat(agentId)` |
| `WorldMinimap` | `currentRoomId`, `onRoomClick(roomId)` |
| `WorldNotifications` | `maxVisible` (default 4) |
| `WorldWorkflowPanel` | `expanded`, `onToggle()`, `onHighlightRooms(roomIds[])`, `onRoomClick(roomId)` |
| `AgentEmotes` | `x`, `y`, `onEmote(emote)`, `onClose()` |
| `SpeechBubble` | `content: BubbleContent`, `x`, `y`, `color` |
| `LiveSpeechBubble` | `activity: AgentLiveActivity`, `x`, `y`, `color` |
| `InteractionLine` | `x1`, `y1`, `x2`, `y2`, `color` |
| `RoomEnvironment` | `domain`, `tileSize`, `roomWidth` |
| `RoomFurniture` | `items: FurnitureItem[]`, `domain`, `tileSize` |
| `EmbeddedScreen` | `domain`, `type: 'monitor' | 'projectorScreen'`, `x`, `y`, `tileSize` |
| `AmbientParticles` | `domain`, `roomWidth`, `roomHeight` |
| `InteractiveFurniture` | `item: FurnitureItem`, `domain`, `tileSize`, `index` |

---

## 2. Data Model

### 2.1 Domain System

```typescript
type DomainId = 'content' | 'sales' | 'dev' | 'design' | 'data' | 'ops';

interface DomainConfig {
  id: DomainId;
  label: string;          // "Content & Marketing"
  tileColor: string;      // hex, e.g. '#FF6B6B'
  tileBorder: string;
  agentColor: string;
  floorColor: string;     // room floor bg, e.g. '#FFF0F0'
  icon: LucideIcon;
}
```

6 domains with CSS variable overrides for theming (`--world-{domain}-tile`, etc.).

### 2.2 Room Layout

```typescript
interface RoomConfig {
  squadId: string;        // maps to squad.id in API
  label: string;
  domain: DomainId;
  gridX: number;          // isometric grid position
  gridY: number;
  icon: LucideIcon;
}
```

**19 rooms** total, statically defined in `world-layout.ts`:
- Content cluster (5): youtube-content, content-ecosystem, copywriting, creative-studio, social-publisher
- Sales cluster (4): media-buy, funnel-creator, sales, deep-scraper
- Dev cluster (3): full-stack-dev, aios-core-dev, design-system
- Data cluster (3): data-analytics, conselho, infoproduct-creation
- Ops cluster (4): project-management-clickup, orquestrador-global, support, seo

Grid constants: `TILE_WIDTH=140`, `TILE_HEIGHT=70` (isometric), `ROOM_COLS=20`, `ROOM_ROWS=14` (interior).

### 2.3 Furniture System

```typescript
type FurnitureType =
  | 'desk' | 'monitor' | 'whiteboard' | 'plant' | 'coffee' | 'bookshelf'
  | 'serverRack' | 'camera' | 'chartBoard' | 'rug' | 'lamp' | 'couch'
  | 'meetingTable' | 'waterCooler' | 'printer' | 'stickyWall' | 'cabinet' | 'projectorScreen';

interface FurnitureItem {
  type: FurnitureType;
  x: number;   // tile position within room
  y: number;
}
```

Each domain has ~17-22 furniture items defining its room layout. Furniture is rendered as pixel-art SVGs generated by functions in `pixel-sprites.ts`. Interactive items (all except rug, lamp, plant) show hover tooltips.

### 2.4 Agent Sprites

```typescript
interface SpriteColors {
  head: string; body: string; legs: string; accent: string;
}

type AgentTier = 0 | 1 | 2 | 3 | 4 | 5;
// 0=Chief (crown ♛), 1=Master, 2=Specialist, etc.

type AccessoryType = 'none' | 'glasses' | 'headphones' | 'hat' | 'scarf' | 'bowtie' | 'earring' | 'bandana';
type HairStyle = 'short' | 'spiky' | 'long' | 'mohawk' | 'bun' | 'buzz' | 'wavy' | 'afro';
type BodyPattern = 'solid' | 'striped' | 'vest' | 'tshirt' | 'hoodie' | 'lab';
```

Each agent gets a **deterministic unique appearance** derived from a name hash:
- Skin tone (6 options), hair color (10), hair style (8), body pattern (6), accessory (8)
- Rendered as 16×16 pixel SVG rects, scaled 2.5× (40×40px final)
- Domain determines base body color palette

### 2.5 Agent Movement State

```typescript
type AgentActivity = 'idle' | 'walking' | 'at-furniture' | 'chatting' | 'live-working';
type FacingDirection = 'left' | 'right';
type BubbleContent = 'thinking' | 'eureka' | 'code' | 'money' | 'chart' | 'chat';

interface AgentMovementState {
  x: number; y: number;
  activity: AgentActivity;
  targetAgentId?: string;
  facing: FacingDirection;
  bubble?: BubbleContent;
  activityLabel?: string;
}
```

### 2.6 Monitor Events

```typescript
interface MonitorEvent {
  id: string;
  timestamp: string;
  type: 'tool_call' | 'message' | 'error' | 'system';
  agent: string;
  description: string;
  duration?: number;
  success?: boolean;
}
```

### 2.7 Agent Live Activity

```typescript
interface AgentLiveActivity {
  agentName: string;
  action: string;              // "Reading file...", "Editing code..."
  type: 'tool_call' | 'message' | 'error' | 'system';
  timestamp: number;
  isActive: boolean;
  tool?: string;
  success?: boolean;
}
```

### 2.8 Workflow Pipelines (mock)

```typescript
interface WorkflowPipeline {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  status: 'idle' | 'active' | 'completed';
  steps: WorkflowStep[];
}

interface WorkflowStep {
  squadId: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  agentName?: string;
  progress?: number; // 0-100
}
```

5 hardcoded business workflows: Live Semanal, Feed de Conteudo, Criativos para Ads, Lancamento de Produto, Dev → Deploy.

---

## 3. Interactions

### 3.1 World Map

| Action | Behavior |
|--------|----------|
| **Click room tile** | Door transition animation → `enterRoom(roomId)` → RoomView |
| **Hover room tile** | Scale 1.08, tooltip with room name/domain/agent count/"Click to enter" |
| **Scroll wheel** | Zoom map (0.4–2.0), spring animation |
| **Drag (pointer down+move)** | Pan the map; click suppressed after >3px drag |
| **Domain filter buttons** | Filter visible rooms by domain, toggle on/off |
| **Minimap dot click** | Same as clicking room tile (enters room) |
| **Minimap dot hover** | Scale 1.8, tooltip with room name |
| **Workflow card hover** | Highlights corresponding rooms on map via `onHighlightRooms` |
| **Workflow step click** | Enters the step's room |
| **Workflow panel toggle** | Expand/collapse bottom bar (44px collapsed → 220px expanded) |

### 3.2 Room View

| Action | Behavior |
|--------|----------|
| **Back button / ESC / door click** | Exit transition → `exitRoom()` → back to map |
| **WASD / Arrow keys** | Pan camera (7px/frame via rAF), clamped to ±ROOM_W/2 |
| **Scroll wheel** | Zoom room (0.5–2.5) |
| **Drag** | Pan room camera |
| **Click agent sprite** | `setSelectedAgentId(agentId)` — selection ring appears |
| **Right-click agent** | Opens AgentEmotes radial ring (8 emotes in a circle, r=44px) |
| **Emote selection** | FloatingEmote rises and fades, ring closes after 800ms |
| **Hover agent sprite** | Scale 1.15, tooltip with name/tier/activity label |
| **Hover furniture** | Domain-colored border highlight + label/description tooltip |

### 3.3 Agent Interaction Panel (side panel)

| Tab | Content |
|-----|---------|
| **Chat** | Streaming chat with agent via `useChat()` hook, message bubbles, input field |
| **Live (Activity)** | Real-time event timeline from monitor, live status card |
| **Profile** | Agent avatar, description, role, capabilities, "when to use" |
| **Commands** | List of `AgentCommand` items, click populates chat input with `*command ` |

### 3.4 Zoom Controls

- `+` button: zoom += 0.2 (max 2.0 map / 2.5 room)
- Reset button: zoom = 1 (shows current %)
- `-` button: zoom -= 0.2 (min 0.4 map / 0.5 room)
- Position shifts up when workflow panel is expanded

---

## 4. State Management

### 4.1 Stores (Zustand)

| Store | Key State | Used By |
|-------|-----------|---------|
| **uiStore** | `worldZoom: 'map'|'room'`, `selectedRoomId`, `selectedAgentId`, `enterRoom()`, `exitRoom()` | GatherWorld, RoomView |
| **monitorStore** | `connected`, `events: MonitorEvent[]`, `stats`, `metrics`, `alerts`, `connectToMonitor()`, `disconnectFromMonitor()` | GatherWorld, WorldNotifications, WorldWorkflowPanel, AgentInteractionPanel |
| **agentActivityStore** | `activities: Map<string, AgentLiveActivity>`, `getActivity(name)`, `processEvent()` | WorldMinimap, RoomView, AgentInteractionPanel, useAgentMovement |

### 4.2 React Query Hooks

| Hook | Query Key | Source |
|------|-----------|--------|
| `useSquads()` | `['squads']` | `squadsApi.getSquads()` — live API, enriched with `inferSquadType()` |
| `useSquad(id)` | `['squad', id]` | `squadsApi.getSquad(id)` |
| `useAgents(squadId)` | `['agents', squadId]` (assumed) | agents API |
| `useAgentById(id)` | `['agent', id]` (assumed) | agents API |
| `useAgentCommands(roomId, agentId)` | assumed | agents API |
| `useChat()` | custom hook | chat sessions |

### 4.3 Context

| Context | Provider | Consumers |
|---------|----------|-----------|
| `DomainContext` | `DomainProvider` wraps `GatherWorldInner` | `useDomains()` — every component that needs domain colors |

### 4.4 Custom Hooks (local to world/)

| Hook | Purpose |
|------|---------|
| `useThemedDomains()` | Reads CSS custom properties + observes `data-theme` mutations → returns theme-aware DomainConfig |
| `useAgentMovement(agents, domain, liveActivities)` | Orchestrates idle/walk/furniture/chat/live-working cycles with obstacle avoidance; returns `Map<agentId, AgentMovementState>` |
| `useKeyboardNav({ onPan, panSpeed, onEscape })` | WASD/Arrow + ESC handling via rAF loop |
| `useDayNightCycle()` | Returns `DayNightState` based on real wall-clock time, updates every 5min |

---

## 5. Realtime

### 5.1 WebSocket Connection

**Initialized in**: `GatherWorld` → `useMonitorStore.connectToMonitor()` on mount, disconnects on unmount.

**Connection modes** (from `lib/connection.ts`):
1. **Engine mode** (`VITE_ENGINE_URL`): WS at `{engineUrl}/live`, HTTP health at `/health`, pool at `/pool`
2. **Cloud mode** (`VITE_RELAY_URL` + room + token): WS at `{relayUrl}/dashboard?room=...&token=...`
3. **Local mode** (default): WS at `{monitorUrl}/stream` (default `localhost:4001`)

**Reconnection**: exponential backoff (1s base, ×2, max 30s), 5 max attempts.

**Message types received**:
- `init` — replay buffer (array of events)
- `event` — single new event
- `room_update` — cloud mode CLI connected state
- `pong` — heartbeat

### 5.2 Data Flow

```
WebSocket message
  → monitorStore.addEvent(mapServerEvent(raw))
  → agentActivityStore subscription fires
    → processEvent() → updates activities Map
      → auto-deactivate after 8s timeout
      → periodic stale cleanup every 10s (15s threshold)
  → WorldNotifications picks up significant events
  → useAgentMovement merges live activities into movement states
  → AgentSprite shows liveActive glow + LiveSpeechBubble
```

### 5.3 What Updates Live

- **Agent sprites**: `liveActive` prop triggers glow ring, busy typing animation, green status dot
- **LiveSpeechBubble**: Shows real-time action text (e.g. "Reading file...", "Editing code...")
- **WorldNotifications**: Toasts for significant events (errors, completions, messages)
- **WorldWorkflowPanel**: Live indicator dot + event count badge
- **WorldMinimap**: "LIVE" badge when agents are active
- **AgentInteractionPanel > Activity tab**: Real-time event timeline

---

## 6. Visual Design

### 6.1 Layout

- **Full height** flex container (`h-full flex relative`)
- **Main content**: flex-1, min-w-0, full height — contains either WorldMap or RoomView
- **Overlays** (absolute positioned):
  - Door transition: z-40, full screen vignette + expanding door frame
  - Zoom controls: bottom-left, z-30
  - Notifications: top-right, z-30, max-width 280px
  - Minimap: bottom-right, z-30, hidden on mobile (`hidden md:block`)
  - Workflow panel: bottom full-width, z-20

### 6.2 Color System

6 domain color palettes, each with: tileColor, tileBorder, agentColor, floorColor.

| Domain | Tile Color | Floor Color |
|--------|-----------|-------------|
| Content | `#FF6B6B` (coral) | `#FFF0F0` (pink-white) |
| Sales | `#FF9F43` (orange) | `#FFF5EB` (warm white) |
| Dev | `#54A0FF` (blue) | `#EBF3FF` (light blue) |
| Design | `#FF6B81` (pink) | `#FFF0F3` (soft pink) |
| Data | `#A29BFE` (purple) | `#F3F0FF` (lavender) |
| Ops | `#2ED573` (green) | `#EDFFF3` (mint) |

Theme-aware via CSS custom properties (`--world-{domain}-tile` etc.), resolved by `useThemedDomains()`.

### 6.3 Typography

- Labels: `"Press Start 2P", monospace, system-ui` at 7px (pixel art feel)
- UI text: system font, sizes 7px–11px
- Monospace used for agent names, code references, timestamps
- Language: **Portuguese** for UI labels ("Aumentar zoom", "Voltar", "Enviar mensagem")

### 6.4 Animations (Framer Motion)

| Element | Animation |
|---------|-----------|
| Map ↔ Room transition | Scale + blur + opacity (map: 0.92→1, room: 1.3→1 with blur) |
| Door transition | Vignette + expanding rectangle from 40×60 to viewport |
| Room tiles | `whileHover: scale 1.08`, `whileTap: scale 0.95` |
| Active room dots | Staggered opacity pulse `[0.3, 1, 0.3]` at 2s intervals |
| Agent walk | Y bob `[0, -2, 0]` at 0.3s |
| Agent idle | Subtle breathing `scale [1, 1.01, 1]` at 2.5s+ |
| Agent live glow | Radial gradient pulse + scale `[0.95, 1.05, 0.95]` at 1.2s |
| Speech bubbles | Scale/opacity spring entrance, y-drift exit |
| Notifications | Slide from right (`x: 40→0`), spring (damping 20, stiffness 300) |
| Workflow data flow | Dot traveling along connector lines |
| Zoom/pan | Spring animation (damping 20, stiffness 200) |
| Ambient particles | Drift + fade with domain-specific characters |
| Day/night | 60s CSS transition on overlay opacity/color |

### 6.5 Glass UI Pattern

Used extensively:
- `glass-panel`, `glass-subtle`, `glass-scrollbar` CSS classes
- Background: `rgba(0,0,0,0.75–0.85)` with `backdropFilter: 'blur(8px)'`
- Borders: `rgba(255,255,255,0.06–0.15)` / domain tileColor at low opacity
- Var references: `--glass-border-color`, `--color-text-primary/secondary/tertiary`

### 6.6 Day/Night Cycle

Based on real wall-clock time, updates every 5 minutes:
- Night (22–5): dark blue overlay at 25% opacity
- Dawn (5–7): warm orange, fading
- Morning (7–12): near-clear, slight blue
- Afternoon (12–17): warm gold at 3%
- Dusk (17–19): red/pink, increasing
- Evening (19–22): deep blue, increasing

Applied as a `mix-blend-mode: multiply` overlay on the room.

### 6.7 Responsive Behavior

- Minimap hidden below `md` breakpoint
- Domain filter bar has `overflow-x-auto` for horizontal scroll
- Workflow panel scrolls horizontally
- Room view supports touch drag (pointer events, not mouse-specific)

---

## 7. What's Real vs Mock

### LIVE DATA (from API/WebSocket)

| Data | Source | Notes |
|------|--------|-------|
| Squad list + agent counts | `useSquads()` → `squadsApi.getSquads()` | Real API via engine or mock server |
| Squad details / agents | `useAgents(squadId)`, `useAgentById()` | React Query, staleTime 5min |
| Monitor events | WebSocket (`monitorStore`) | Real-time tool calls, messages, errors |
| Agent live activity | Derived from monitor events via `agentActivityStore` | Auto-deactivates after 8s |
| Connection status | `monitorStore.connected` | True when WS open |
| Pool stats (engine mode) | `engineApi.pool()` | occupied/idle/queue_depth |
| Agent commands | `useAgentCommands()` | From API |
| Chat messages | `useChat()` hook | Streaming chat with engine |
| Agent avatars | `getAgentAvatarUrl(agentId)` | Static asset lookup |
| Squad connections | `useSquadConnections()` | **Falls back to mockConnections on error** |

### MOCK / STATIC DATA

| Data | Source | Notes |
|------|--------|-------|
| Room layout (19 rooms) | `world-layout.ts` static array | Fixed grid positions, never changes |
| Domain definitions (6) | `world-layout.ts` static object | Colors, labels, icons |
| Furniture templates | `world-layout.ts` per-domain arrays | Static room decoration |
| Agent movement | `useAgentMovement` hook | **Simulated** — deterministic random walks, furniture visits, chat interactions. Intervals: 10–25s cycles |
| Speech bubbles | Movement hook | Random ambient ("thinking", "code", etc.) — NOT from API |
| Workflow pipelines (5) | `WorldWorkflowPanel.tsx` hardcoded array | Business workflows with mock statuses |
| Demo notifications | `WorldNotifications.tsx` `DEMO_NOTIFICATIONS` array | Cycles every 8–15s **only when WS disconnected** |
| Day/night cycle | `useDayNightCycle` | Based on real clock, but purely cosmetic |
| Pixel sprite appearance | `pixel-sprites.ts` hash-based generation | Deterministic from agent name |
| Ambient particles | `AmbientParticles.tsx` | Purely decorative |
| Embedded screen content | `EmbeddedScreen.tsx` | Domain-themed animations (code scroll, bar charts, etc.) |
| Workflow connection lines | `WorldMap.tsx` `workflowLinks` array | 10 static links between rooms |
| Domain zones | `WorldMap.tsx` `domainZones` array | Background region shapes |

### HYBRID (live when connected, mock fallback)

| Data | Live Source | Fallback |
|------|------------|----------|
| Notifications | Monitor events (significant only) | Demo notification cycle |
| Agent activity labels | `agentActivityStore` → live tool/action | Movement hook random labels ("Typing...", "Brainstorming") |
| Agent status dot | Green pulse when `liveActive` | Static green/yellow/gray based on tier |
| Speech bubbles | `LiveSpeechBubble` when `agentActivity.isActive` | Random `SpeechBubble` from movement |

---

## 8. Migration Notes for Next.js 16 + React 19 + Tailwind 4

### 8.1 Dependencies to Replace

| Current | Next.js Target |
|---------|----------------|
| `zustand` (state) | Keep zustand, or migrate to React 19 `use()` + context |
| `@tanstack/react-query` | Keep, fully compatible |
| `framer-motion` | Keep (or `motion` package for React 19) |
| `lucide-react` | Keep |
| `import.meta.env.VITE_*` | → `process.env.NEXT_PUBLIC_*` |

### 8.2 Key Considerations

1. **Server Components**: `GatherWorld` and all children use hooks extensively — must be `'use client'` components.
2. **CSS Variables**: Domain theming relies on CSS custom properties set on `<html>`. Tailwind 4's `@theme` directive can define these.
3. **WebSocket**: `monitorStore.connectToMonitor()` uses browser-only APIs. Must guard with `typeof window !== 'undefined'` or keep in client component.
4. **localStorage**: `uiStore` uses `zustand/persist` with `safePersistStorage`. Ensure SSR-safe.
5. **Portuguese strings**: All UI labels are in Portuguese. Consider i18n or keep as-is.
6. **Pixel art rendering**: Heavy use of `imageRendering: 'pixelated'` and inline SVG. No image assets needed.
7. **`dangerouslySetInnerHTML`**: Used in `RoomFurniture` for SVG injection. Consider converting to React components.
8. **Animation performance**: 12 ambient particles + N agent sprites + movement timers. Consider `will-change` and `transform` GPU acceleration.
9. **Agent movement timers**: `useAgentMovement` uses many `setTimeout`s. Clean up carefully on unmount (already handled via `timersRef`).
10. **Module-level side effects**: `agentActivityStore.ts` has top-level `subscribe()` and `setInterval()` — these run on import. Ensure compatible with Next.js module evaluation.

### 8.3 File Structure Recommendation

```
src/
  components/world/
    GatherWorld.tsx          (client component, entry)
    WorldMap.tsx
    RoomView.tsx
    WorldMinimap.tsx
    WorldNotifications.tsx
    WorldWorkflowPanel.tsx
    AgentSprite.tsx
    AgentEmotes.tsx
    AgentInteractionPanel.tsx
    RoomEnvironment.tsx
    RoomFurniture.tsx
    EmbeddedScreen.tsx
    AmbientParticles.tsx
    InteractionLine.tsx
    InteractiveFurniture.tsx
    SpeechBubble.tsx
    LiveSpeechBubble.tsx
    IsometricTile.tsx
    DomainContext.tsx
    pixel-sprites.ts         (pure functions, server-safe)
    world-layout.ts          (pure data, server-safe)
    useAgentMovement.ts
    useKeyboardNav.ts
    useDayNightCycle.ts
    useThemedDomains.ts
  stores/
    monitorStore.ts
    agentActivityStore.ts
    uiStore.ts
  hooks/
    useSquads.ts
    useAgents.ts
    useChat.ts
  services/api/
    engine.ts
  lib/
    connection.ts
```
