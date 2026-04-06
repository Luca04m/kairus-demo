"use client";

import { createContext, useContext } from 'react';
import { DOMAINS, type DomainVisual } from '@/data/world-layout';
import type { DepartmentId } from '@/types/departments';

const DomainContext = createContext<Record<DepartmentId, DomainVisual>>(DOMAINS);

/** Provides domain colors to all world sub-components */
export function DomainProvider({ children }: { children: React.ReactNode }) {
  return (
    <DomainContext.Provider value={DOMAINS}>
      {children}
    </DomainContext.Provider>
  );
}

/** Use domain colors. Falls back to static defaults outside the provider. */
export function useDomains(): Record<DepartmentId, DomainVisual> {
  return useContext(DomainContext);
}
