// src/lib/squads/index.ts — barrel export

// Types
export type {
  AgentError,
  AgentFilters,
  AgentPerformanceMetrics,
  AgentPresenceRow,
  AgentRow,
  AgentStatus,
  AgentStatusEvent,
  AgentWithRelations,
  AlertSeverity,
  CreateDepartmentInput,
  CreateSquadInput,
  DepartmentDomain,
  DepartmentError,
  DepartmentRow,
  DepartmentStats,
  DepartmentWithCounts,
  PresenceEvent,
  PresenceStatus,
  SquadActivity,
  SquadActivityEvent,
  SquadError,
  SquadMetrics,
  SquadRow,
  SquadStatus,
  SquadWithAgents,
  SquadWithCounts,
} from "./types";

export {
  inferDepartmentFromSquadName,
  inferSkillsForDomain,
} from "./types";

// Registry
export {
  getSquads,
  getSquad,
  getSquadsByDepartment,
  registerSquad,
  updateSquadStatus,
} from "./registry";

// Agents
export {
  getAgents,
  getAgent,
  updateAgentStatus,
  getAgentPresence,
  setAgentPresence,
} from "./agents";

// Departments
export {
  getDepartments,
  getDepartmentStats,
  createDepartment,
} from "./departments";

// Realtime
export {
  subscribeToAgentStatus,
  subscribeToPresence,
  subscribeToSquadActivity,
  broadcastEvent,
  subscribeToAgentTableChanges,
  subscribeToSquadTableChanges,
} from "./realtime";
export type { Subscription } from "./realtime";

// Seed
export {
  seedSquadData,
  DEPARTMENT_TEMPLATES,
  SQUAD_TEMPLATES,
  AGENT_TEMPLATES,
} from "./seed";
export type {
  DepartmentTemplate,
  SquadTemplate,
  AgentTemplate,
} from "./seed";
