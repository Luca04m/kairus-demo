'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import type { RoadmapCardItem, MoscowPriority } from '@/types/roadmap';
import { RoadmapHeader } from './RoadmapHeader';
import { FilterBar } from './FilterBar';
import { PrioritySection } from './PrioritySection';
import { TimelineView } from './TimelineView';
import { AddItemForm } from './AddItemForm';
import { EditItemForm } from './EditItemForm';

const PRIORITY_ORDER: MoscowPriority[] = ['must', 'should', 'could', 'wont'];

export function RoadmapView() {
  const fetchItems = useRoadmapStore((s) => s.fetchItems);
  const viewMode = useRoadmapStore((s) => s.viewMode);
  const loading = useRoadmapStore((s) => s.loading);
  const error = useRoadmapStore((s) => s.error);
  const showAddForm = useRoadmapStore((s) => s.showAddForm);
  const setShowAddForm = useRoadmapStore((s) => s.setShowAddForm);
  const editingItem = useRoadmapStore((s) => s.editingItem);
  const setEditingItem = useRoadmapStore((s) => s.setEditingItem);
  const filteredItemsFn = useRoadmapStore((s) => s.filteredItems);
  const allItems = useRoadmapStore((s) => s.items);
  const filters = useRoadmapStore((s) => s.filters);

  // Fetch on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Memoize filtered items based on their dependencies
  const items = useMemo(() => filteredItemsFn(), [filteredItemsFn, allItems, filters]);

  // Group by priority for cards view
  const grouped = useMemo(() => {
    const map = new Map<MoscowPriority, RoadmapCardItem[]>();
    for (const p of PRIORITY_ORDER) {
      map.set(p, []);
    }
    for (const item of items) {
      const arr = map.get(item.prioridade);
      if (arr) arr.push(item);
    }
    return map;
  }, [items]);

  const handleItemClick = useCallback(
    (item: RoadmapCardItem) => {
      setEditingItem(item);
    },
    [setEditingItem],
  );

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Page header */}
      <div className="pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <RoadmapHeader itemCount={items.length} />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-lg bg-red-500/10 border border-red-500/25 px-4 py-2.5">
          <span className="text-xs text-red-400">{error}</span>
          <button
            onClick={() => fetchItems()}
            className="text-xs text-red-300 hover:text-white underline transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-sm text-[rgba(255,255,255,0.4)]">
            <div className="h-4 w-4 rounded-full border-2 border-[rgba(255,255,255,0.2)] border-t-white animate-spin" />
            Carregando roadmap...
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* Cards view */}
          {viewMode === 'cards' && (
            <div className="space-y-2">
              {PRIORITY_ORDER.map((priority) => (
                <PrioritySection
                  key={priority}
                  priority={priority}
                  items={grouped.get(priority) ?? []}
                  onItemClick={handleItemClick}
                />
              ))}

              {/* Empty state */}
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <span className="text-sm text-[rgba(255,255,255,0.3)]">
                    Nenhum item encontrado com os filtros atuais.
                  </span>
                  <button
                    onClick={() => useRoadmapStore.getState().resetFilters()}
                    className="text-xs text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Timeline view */}
          {viewMode === 'timeline' && (
            <TimelineView items={items} onItemClick={handleItemClick} />
          )}
        </>
      )}

      {/* Add form modal */}
      {showAddForm && <AddItemForm onClose={() => setShowAddForm(false)} />}

      {/* Edit form modal */}
      {editingItem && (
        <EditItemForm item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
