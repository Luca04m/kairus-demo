'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  RoadmapCardItem,
  RoadmapCardItemCreate,
  RoadmapCardItemUpdate,
  MoscowPriority,
  RoadmapStatus,
} from '@/types/roadmap';
import { ROADMAP_SEED } from '@/data/roadmapSeed';

// ─── View Mode ───────────────────────────────────────────
export type RoadmapViewMode = 'timeline' | 'cards';

// ─── Filters ─────────────────────────────────────────────
export interface RoadmapFilters {
  priority: MoscowPriority | 'all';
  status: RoadmapStatus | 'all';
  department: string | 'all';
  search: string;
}

// ─── State ───────────────────────────────────────────────
interface RoadmapState {
  items: RoadmapCardItem[];
  filters: RoadmapFilters;
  viewMode: RoadmapViewMode;
  loading: boolean;
  error: string | null;
  editingItem: RoadmapCardItem | null;
  showAddForm: boolean;
  /** Tracks whether we've done the initial fetch to distinguish "empty DB" from "not loaded" */
  _initialized: boolean;
}

// ─── Actions ─────────────────────────────────────────────
interface RoadmapActions {
  fetchItems: () => Promise<void>;
  addItem: (payload: RoadmapCardItemCreate) => Promise<void>;
  updateItem: (id: string, payload: RoadmapCardItemUpdate) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setFilter: <K extends keyof RoadmapFilters>(key: K, value: RoadmapFilters[K]) => void;
  setViewMode: (mode: RoadmapViewMode) => void;
  resetFilters: () => void;
  setEditingItem: (item: RoadmapCardItem | null) => void;
  setShowAddForm: (show: boolean) => void;
  filteredItems: () => RoadmapCardItem[];
}

export type RoadmapStore = RoadmapState & RoadmapActions;

const DEFAULT_FILTERS: RoadmapFilters = {
  priority: 'all',
  status: 'all',
  department: 'all',
  search: '',
};

function generateId(): string {
  return `rm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

// ─── Field Mapping: API (English) <-> Client (Portuguese) ──

/** Map an API row (English field names) to RoadmapCardItem (Portuguese). */
function apiRowToCardItem(row: Record<string, unknown>): RoadmapCardItem {
  return {
    id: (row.id as string) ?? generateId(),
    titulo: (row.title as string) ?? '',
    descricao: (row.description as string) ?? undefined,
    status: mapApiStatusToClient((row.status as string) ?? 'planned'),
    prioridade: mapApiPriorityToClient((row.priority as string) ?? 'media'),
    impacto: (row.metadata as Record<string, unknown>)?.impacto as RoadmapCardItem['impacto'] ?? 'medium',
    esforco: (row.metadata as Record<string, unknown>)?.esforco as RoadmapCardItem['esforco'] ?? 'medium',
    departamento: (row.departments as Record<string, unknown>)?.name as string
      ?? (row.metadata as Record<string, unknown>)?.departamento as string
      ?? 'Tech',
    squad: (row.squads as Record<string, unknown>)?.name as string
      ?? (row.metadata as Record<string, unknown>)?.squad as string
      ?? undefined,
    tags: (row.tags as string[]) ?? [],
    data_inicio: (row.start_date as string) ?? undefined,
    data_fim: (row.end_date as string) ?? undefined,
    created_at: (row.created_at as string) ?? nowISO(),
    updated_at: (row.updated_at as string) ?? nowISO(),
  };
}

/** Map a RoadmapCardItemCreate (Portuguese) to API POST body (English). */
function cardCreateToApiBody(payload: RoadmapCardItemCreate): Record<string, unknown> {
  return {
    title: payload.titulo,
    description: payload.descricao ?? null,
    status: mapClientStatusToApi(payload.status),
    priority: mapClientPriorityToApi(payload.prioridade),
    start_date: payload.data_inicio ?? null,
    end_date: payload.data_fim ?? null,
    tags: payload.tags ?? [],
    metadata: {
      impacto: payload.impacto,
      esforco: payload.esforco,
      departamento: payload.departamento,
      squad: payload.squad ?? null,
    },
  };
}

/** Map a RoadmapCardItemUpdate (Portuguese) to API PATCH body (English). */
function cardUpdateToApiBody(payload: RoadmapCardItemUpdate): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (payload.titulo !== undefined) body.title = payload.titulo;
  if (payload.descricao !== undefined) body.description = payload.descricao ?? null;
  if (payload.status !== undefined) body.status = mapClientStatusToApi(payload.status);
  if (payload.prioridade !== undefined) body.priority = mapClientPriorityToApi(payload.prioridade);
  if (payload.data_inicio !== undefined) body.start_date = payload.data_inicio ?? null;
  if (payload.data_fim !== undefined) body.end_date = payload.data_fim ?? null;
  if (payload.tags !== undefined) body.tags = payload.tags;
  // Store impact/effort/dept/squad in metadata
  const meta: Record<string, unknown> = {};
  if (payload.impacto !== undefined) meta.impacto = payload.impacto;
  if (payload.esforco !== undefined) meta.esforco = payload.esforco;
  if (payload.departamento !== undefined) meta.departamento = payload.departamento;
  if (payload.squad !== undefined) meta.squad = payload.squad ?? null;
  if (Object.keys(meta).length > 0) body.metadata = meta;
  return body;
}

function mapApiStatusToClient(s: string): RoadmapStatus {
  switch (s) {
    case 'backlog':
    case 'planned': return 'planned';
    case 'in_progress': return 'in_progress';
    case 'done':
    case 'released': return 'done';
    default: return 'planned';
  }
}

function mapClientStatusToApi(s: RoadmapStatus): string {
  return s; // 'planned' | 'in_progress' | 'done' map 1:1
}

function mapApiPriorityToClient(p: string): MoscowPriority {
  switch (p) {
    case 'must':
    case 'critica':
    case 'alta': return 'must';
    case 'should':
    case 'media': return 'should';
    case 'could':
    case 'baixa': return 'could';
    case 'wont': return 'wont';
    default: return 'should';
  }
}

function mapClientPriorityToApi(p: MoscowPriority): string {
  return p; // 'must' | 'should' | 'could' | 'wont'
}

// ─── API helper ─────────────────────────────────────────

interface ApiFetchResult<T> {
  data: T | null;
  error: string | null;
}

/** Fetch from the API route with proper error propagation. */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiFetchResult<T>> {
  try {
    const res = await fetch(path, init);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { data: null, error: `API ${res.status}: ${text}` };
    }
    const json = await res.json();
    return { data: (json.data ?? json) as T, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/** Deduplicate items by id, keeping the last occurrence (freshest). */
function deduplicateById(items: RoadmapCardItem[]): RoadmapCardItem[] {
  const map = new Map<string, RoadmapCardItem>();
  for (const item of items) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

export const useRoadmapStore = create<RoadmapStore>()(
  subscribeWithSelector((set, get) => ({
    items: [],
    filters: { ...DEFAULT_FILTERS },
    viewMode: 'cards',
    loading: false,
    error: null,
    editingItem: null,
    showAddForm: false,
    _initialized: false,

    // ── Fetch ──────────────────────────────────────────
    fetchItems: async () => {
      set({ loading: true, error: null });
      const { data, error } = await apiFetch<Record<string, unknown>[]>('/api/roadmap');

      if (error || !data) {
        // API/Supabase not available — fall back to seed only on first load
        if (!get()._initialized) {
          set({ items: [...ROADMAP_SEED], loading: false, error: null, _initialized: true });
        } else {
          set({ loading: false, error: error ?? 'Failed to fetch roadmap items' });
        }
        return;
      }

      // Map API rows to client model
      const mapped = data.map(apiRowToCardItem);

      if (mapped.length === 0 && !get()._initialized) {
        // Empty DB on first load — use seed data
        set({ items: [...ROADMAP_SEED], loading: false, _initialized: true });
      } else {
        set({ items: deduplicateById(mapped), loading: false, _initialized: true });
      }
    },

    // ── Add ────────────────────────────────────────────
    addItem: async (payload) => {
      const now = nowISO();
      const tempId = generateId();
      const newItem: RoadmapCardItem = {
        ...payload,
        id: tempId,
        created_at: now,
        updated_at: now,
      };

      // Optimistic: add temp item and close form
      set((s) => ({ items: [newItem, ...s.items], showAddForm: false, error: null }));

      const apiBody = cardCreateToApiBody(payload);
      const { data, error } = await apiFetch<Record<string, unknown>>('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
      });

      if (data) {
        // Replace temp item with server item
        const serverItem = apiRowToCardItem(data);
        set((s) => ({
          items: deduplicateById(
            s.items.map((item) => (item.id === tempId ? serverItem : item)),
          ),
        }));
      } else if (error) {
        // Keep the optimistic item but show the error
        set({ error: `Falha ao salvar: ${error}` });
      }
    },

    // ── Update ─────────────────────────────────────────
    updateItem: async (id, payload) => {
      const now = nowISO();
      // Snapshot for rollback
      const previousItems = get().items;

      // Optimistic update
      set((s) => ({
        items: s.items.map((item) =>
          item.id === id ? { ...item, ...payload, updated_at: now } : item,
        ),
        editingItem: null,
        error: null,
      }));

      const apiBody = cardUpdateToApiBody(payload);
      const { error } = await apiFetch<Record<string, unknown>>(`/api/roadmap/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
      });

      if (error) {
        // Rollback on failure
        set({ items: previousItems, error: `Falha ao atualizar: ${error}` });
      }
    },

    // ── Delete ─────────────────────────────────────────
    deleteItem: async (id) => {
      // Snapshot for rollback
      const previousItems = get().items;

      // Optimistic delete
      set((s) => ({
        items: s.items.filter((item) => item.id !== id),
        editingItem: null,
        error: null,
      }));

      const { error } = await apiFetch(`/api/roadmap/${id}`, { method: 'DELETE' });
      if (error) {
        // Rollback on failure
        set({ items: previousItems, error: `Falha ao excluir: ${error}` });
      }
    },

    // ── Filters ────────────────────────────────────────
    setFilter: (key, value) =>
      set((s) => ({ filters: { ...s.filters, [key]: value } })),
    resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

    // ── View ───────────────────────────────────────────
    setViewMode: (mode) => set({ viewMode: mode }),
    setEditingItem: (item) => set({ editingItem: item }),
    setShowAddForm: (show) => set({ showAddForm: show }),

    // ── Derived ────────────────────────────────────────
    filteredItems: () => {
      const { items, filters } = get();
      return items.filter((item) => {
        if (filters.priority !== 'all' && item.prioridade !== filters.priority) return false;
        if (filters.status !== 'all' && item.status !== filters.status) return false;
        if (filters.department !== 'all' && item.departamento !== filters.department) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const haystack =
            `${item.titulo} ${item.descricao ?? ''} ${(item.tags ?? []).join(' ')}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    },
  })),
);
