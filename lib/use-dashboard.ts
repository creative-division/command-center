"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DashboardState, AppItem, Category } from "./types";
import { SEED_CATEGORIES, SEED_APPS } from "./seed-data";

const STORAGE_KEY = "command-center-dashboard";

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadState(): DashboardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DashboardState;
    if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.apps)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state: DashboardState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedState(): DashboardState {
  return { categories: SEED_CATEGORIES, apps: SEED_APPS };
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({ categories: [], apps: [] });
  const [hydrated, setHydrated] = useState(false);
  const isFirstLoad = useRef(false);

  useEffect(() => {
    const loaded = loadState();
    if (loaded) {
      setState(loaded);
    } else {
      const seed = seedState();
      setState(seed);
      saveState(seed);
      isFirstLoad.current = true;
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: DashboardState) => {
    setState(next);
    saveState(next);
  }, []);

  // Apps
  const addApp = useCallback((app: Omit<AppItem, "id" | "order">) => {
    setState((prev) => {
      const categoryApps = prev.apps.filter((a) => a.categoryId === app.categoryId);
      const newApp: AppItem = { ...app, id: generateId(), order: categoryApps.length };
      const next = { ...prev, apps: [...prev.apps, newApp] };
      saveState(next);
      return next;
    });
  }, []);

  const updateApp = useCallback((id: string, updates: Partial<Omit<AppItem, "id">>) => {
    setState((prev) => {
      const next = { ...prev, apps: prev.apps.map((a) => (a.id === id ? { ...a, ...updates } : a)) };
      saveState(next);
      return next;
    });
  }, []);

  const deleteApp = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev, apps: prev.apps.filter((a) => a.id !== id) };
      saveState(next);
      return next;
    });
  }, []);

  const duplicateApp = useCallback((id: string) => {
    setState((prev) => {
      const source = prev.apps.find((a) => a.id === id);
      if (!source) return prev;
      const categoryApps = prev.apps.filter((a) => a.categoryId === source.categoryId);
      const dupe: AppItem = { ...source, id: generateId(), name: `${source.name} (copy)`, order: categoryApps.length };
      const next = { ...prev, apps: [...prev.apps, dupe] };
      saveState(next);
      return next;
    });
  }, []);

  const moveApp = useCallback((appId: string, toCategoryId: string) => {
    setState((prev) => {
      const categoryApps = prev.apps.filter((a) => a.categoryId === toCategoryId);
      const next = {
        ...prev,
        apps: prev.apps.map((a) =>
          a.id === appId ? { ...a, categoryId: toCategoryId, order: categoryApps.length } : a
        ),
      };
      saveState(next);
      return next;
    });
  }, []);

  const reorderApps = useCallback((categoryId: string, orderedIds: string[]) => {
    setState((prev) => {
      const next = {
        ...prev,
        apps: prev.apps.map((a) => {
          if (a.categoryId !== categoryId) return a;
          const idx = orderedIds.indexOf(a.id);
          return idx >= 0 ? { ...a, order: idx } : a;
        }),
      };
      saveState(next);
      return next;
    });
  }, []);

  // Categories
  const addCategory = useCallback((name: string) => {
    setState((prev) => {
      const cat: Category = { id: generateId(), name, order: prev.categories.length };
      const next = { ...prev, categories: [...prev.categories, cat] };
      saveState(next);
      return next;
    });
  }, []);

  const renameCategory = useCallback((id: string, name: string) => {
    setState((prev) => {
      const next = { ...prev, categories: prev.categories.map((c) => (c.id === id ? { ...c, name } : c)) };
      saveState(next);
      return next;
    });
  }, []);

  const deleteCategory = useCallback((id: string, reassignTo?: string) => {
    setState((prev) => {
      let apps = prev.apps;
      if (reassignTo) {
        apps = apps.map((a) => (a.categoryId === id ? { ...a, categoryId: reassignTo } : a));
      } else {
        apps = apps.filter((a) => a.categoryId !== id);
      }
      const next = { ...prev, categories: prev.categories.filter((c) => c.id !== id), apps };
      saveState(next);
      return next;
    });
  }, []);

  const reorderCategories = useCallback((orderedIds: string[]) => {
    setState((prev) => {
      const next = {
        ...prev,
        categories: prev.categories.map((c) => {
          const idx = orderedIds.indexOf(c.id);
          return idx >= 0 ? { ...c, order: idx } : c;
        }),
      };
      saveState(next);
      return next;
    });
  }, []);

  // Import / Export / Reset
  const exportJSON = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importJSON = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as DashboardState;
      if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.apps)) {
        throw new Error("Invalid schema");
      }
      persist(parsed);
      return true;
    } catch {
      return false;
    }
  }, [persist]);

  const reset = useCallback(() => {
    const seed = seedState();
    persist(seed);
  }, [persist]);

  const totalApps = state.apps.length;

  return {
    state,
    hydrated,
    isFirstLoad: isFirstLoad.current,
    totalApps,
    addApp,
    updateApp,
    deleteApp,
    duplicateApp,
    moveApp,
    reorderApps,
    addCategory,
    renameCategory,
    deleteCategory,
    reorderCategories,
    exportJSON,
    importJSON,
    reset,
  };
}
