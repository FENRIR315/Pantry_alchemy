import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';
import { normalize } from '../utils/matching';

const STORAGE_KEY = 'pa:pantry';

export interface PantryMeta {
  qty?: number;
  weight?: number;
  unit?: string;
}

export interface PantryItem extends PantryMeta {
  name: string;
}

export const SEED_PANTRY: PantryItem[] = [
  { name: 'Rice', qty: 5, unit: 'kg' },
  { name: 'Eggs', qty: 12, unit: 'pcs' },
  { name: 'Garlic', qty: 1, unit: 'head' },
  { name: 'Onion', qty: 1, unit: 'kg' },
  { name: 'Tomato', qty: 6, unit: 'pcs' },
  { name: 'Soy Sauce', qty: 1, unit: 'bottle' },
  { name: 'Mung Beans', qty: 1, unit: 'pack' },
  { name: 'Eggplant', qty: 4, unit: 'pcs' },
];
export const SUGGESTIONS = ['Garlic', 'Calamansi', 'Bagoong'];

interface PantryContextValue {
  items: string[];
  details: Record<string, PantryMeta>;
  loading: boolean;
  addItem: (name: string, meta?: PantryMeta) => void;
  addMany: (names: string[]) => number;
  removeItem: (name: string) => void;
  hasItem: (name: string) => boolean;
  updateItem: (name: string, meta: PantryMeta) => void;
}

const PantryContext = createContext<PantryContextValue | null>(null);

function normalizeLoaded(raw: (PantryItem | string)[]): PantryItem[] {
  return raw.map((item) =>
    typeof item === 'string' ? { name: item } : { ...item, qty: item.qty, unit: item.unit },
  );
}

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const [pantry, setPantry] = useState<PantryItem[] | null>(null);

  useEffect(() => {
    loadJSON<PantryItem[] | string[]>(STORAGE_KEY, SEED_PANTRY).then((loaded) =>
      setPantry(normalizeLoaded(loaded)),
    );
  }, []);

  const persist = useCallback((next: PantryItem[]) => {
    setPantry(next);
    saveJSON(STORAGE_KEY, next);
  }, []);

  const addItem = useCallback(
    (name: string, meta?: PantryMeta) => {
      const clean = name.trim();
      if (!clean) return;
      const next = (pantry ?? []).slice();
      const idx = next.findIndex((i) => normalize(i.name) === normalize(clean));
      if (idx >= 0) {
        next[idx] = { ...next[idx], ...meta };
      } else {
        next.push({ name: clean, ...meta });
      }
      persist(next);
    },
    [pantry, persist],
  );

  const addMany = useCallback(
    (names: string[]) => {
      const base = pantry ?? [];
      let added = 0;
      const next = base.map((i) => ({ ...i }));
      for (const name of names) {
        const clean = name.trim();
        if (!clean) continue;
        if (!next.some((i) => normalize(i.name) === normalize(clean))) {
          next.push({ name: clean });
          added += 1;
        }
      }
      if (added > 0) persist(next);
      return added;
    },
    [pantry, persist],
  );

  const removeItem = useCallback(
    (name: string) => {
      persist((pantry ?? []).filter((i) => normalize(i.name) !== normalize(name)));
    },
    [pantry, persist],
  );

  const updateItem = useCallback(
    (name: string, meta: PantryMeta) => {
      const next = (pantry ?? []).map((i) =>
        normalize(i.name) === normalize(name) ? { ...i, ...meta } : i,
      );
      persist(next);
    },
    [pantry, persist],
  );

  const hasItem = useCallback(
    (name: string) => (pantry ?? []).some((i) => normalize(i.name) === normalize(name)),
    [pantry],
  );

  const value = useMemo<PantryContextValue>(() => {
    const items = (pantry ?? []).map((i) => i.name);
    const details: Record<string, PantryMeta> = {};
    for (const item of pantry ?? []) {
      if (item.qty != null || item.weight != null || item.unit != null) {
        details[normalize(item.name)] = {
          qty: item.qty,
          weight: item.weight,
          unit: item.unit,
        };
      }
    }
    return {
      items,
      details,
      loading: pantry == null,
      addItem,
      addMany,
      removeItem,
      hasItem,
      updateItem,
    };
  }, [pantry, addItem, addMany, removeItem, hasItem, updateItem]);

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry(): PantryContextValue {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used within PantryProvider');
  return ctx;
}