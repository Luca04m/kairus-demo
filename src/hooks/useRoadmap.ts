'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import type { RoadmapCardItemCreate, RoadmapCardItemUpdate, MoscowPriority, RoadmapStatus } from '@/types/roadmap';
import type { RoadmapViewMode } from '@/stores/roadmapStore';

/**
 * Hook for roadmap CRUD with optimistic updates.
 * Uses individual Zustand selectors for stable references and minimal re-renders.
 */
export function useRoadmap() {
  // Select individual slices for stable references
  const allItems = useRoadmapStore((s) => s.items);
  const filters = useRoadmapStore((s) => s.filters);
  const viewMode = useRoadmapStore((s) => s.viewMode);
  const loading = useRoadmapStore((s) => s.loading);
  const error = useRoadmapStore((s) => s.error);
  const editingItem = useRoadmapStore((s) => s.editingItem);
  const showAddForm = useRoadmapStore((s) => s.showAddForm);

  // Actions (stable references from Zustand)
  const fetchItems = useRoadmapStore((s) => s.fetchItems);
  const addItem = useRoadmapStore((s) => s.addItem);
  const updateItem = useRoadmapStore((s) => s.updateItem);
  const deleteItem = useRoadmapStore((s) => s.deleteItem);
  const setViewMode = useRoadmapStore((s) => s.setViewMode);
  const setEditingItem = useRoadmapStore((s) => s.setEditingItem);
  const setShowAddForm = useRoadmapStore((s) => s.setShowAddForm);
  const setFilter = useRoadmapStore((s) => s.setFilter);
  const resetFilters = useRoadmapStore((s) => s.resetFilters);
  const filteredItemsFn = useRoadmapStore((s) => s.filteredItems);

  // Fetch on mount (fetchItems is stable from Zustand create)
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Compute filtered items via useMemo keyed on deps that matter
  const items = useMemo(() => filteredItemsFn(), [filteredItemsFn, allItems, filters]);

  // Derived counts
  const completedCount = useMemo(() => allItems.filter((i) => i.status === 'done').length, [allItems]);
  const inProgressCount = useMemo(() => allItems.filter((i) => i.status === 'in_progress').length, [allItems]);

  const refetch = useCallback(() => { fetchItems(); }, [fetchItems]);

  const filterByPriority = useCallback((p: MoscowPriority | 'all') => setFilter('priority', p), [setFilter]);
  const filterByStatus = useCallback((s: RoadmapStatus | 'all') => setFilter('status', s), [setFilter]);
  const filterByDepartment = useCallback((d: string | 'all') => setFilter('department', d), [setFilter]);
  const search = useCallback((query: string) => setFilter('search', query), [setFilter]);

  return {
    // State
    items,
    allItems,
    filters,
    viewMode,
    loading,
    error,
    editingItem,
    showAddForm,

    // Derived
    isEmpty: !loading && allItems.length === 0,
    completedCount,
    inProgressCount,

    // Actions
    refetch,
    addItem: addItem as (payload: RoadmapCardItemCreate) => Promise<void>,
    updateItem: updateItem as (id: string, payload: RoadmapCardItemUpdate) => Promise<void>,
    deleteItem: deleteItem as (id: string) => Promise<void>,

    // View
    setViewMode: setViewMode as (mode: RoadmapViewMode) => void,
    setEditingItem,
    setShowAddForm,

    // Filters
    filterByPriority,
    filterByStatus,
    filterByDepartment,
    search,
    resetFilters,
  };
}
