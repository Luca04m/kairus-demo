"use client";
import { createContext, useContext } from "react";

interface SidebarContextValue {
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  toggleSidebar: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}
