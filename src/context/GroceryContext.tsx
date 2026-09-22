import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GroceryLine, PlanDay } from '../types';
import { priceFor } from '../data/grocery';
import { recipeById } from '../data/recipes';
import { normalize } from '../utils/matching';
import { loadJSON, saveJSON } from '../utils/storage';

const STORAGE_KEY = 'pa:grocery';

let nextId = 1;
function uid(): string {
  return `g${nextId++}`;
}

export function buildGroceryList(
  plan: PlanDay[],
  pantry: string[],
): GroceryLine[] {
  const have = new Set(pantry.map(normalize));
  const seen = new Set<string>();
  const lines: GroceryLine[] = [];

  for (const day of plan) {
    const recipe = recipeById(day.recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      if (have.has(normalize(ing))) continue;
      if (seen.has(normalize(ing))) continue;
      seen.add(normalize(ing));
      const { price, category } = priceFor(ing);
      lines.push({ id: uid(), name: ing, price, checked: false, category });
    }
  }

  lines.sort((a, b) => {
const catOrder: Record<string, number> = { Produce: 0, Protein: 1, Pantry: 2 };
      return (catOrder[a.category] ?? 3) - (catOrder[b.category] ?? 3);
    });

  return lines;
}

interface GroceryContextValue {
  lines: GroceryLine[];
  total: number;
  loading: boolean;
  regenerate: (plan: PlanDay[], pantry: string[]) => void;
  addMissing: (recipeIngredients: string[]) => void;
  toggleCheck: (id: string) => void;
  clearChecked: () => void;
}

const GroceryContext = createContext<GroceryContextValue | null>(null);

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<GroceryLine[]>([]);

  useEffect(() => {
    loadJSON<GroceryLine[]>(STORAGE_KEY, []).then((loaded) => {
      nextId = Math.max(nextId, loaded.length + 1);
      setLines(loaded);
    });
  }, []);

  const persist = useCallback((next: GroceryLine[]) => {
    setLines(next);
    saveJSON(STORAGE_KEY, next);
  }, []);

  const regenerate = useCallback(
    (plan: PlanDay[], pantry: string[]) => {
      persist(buildGroceryList(plan, pantry));
    },
    [persist],
  );

  const addMissing = useCallback(
    (recipeIngredients: string[]) => {
      const existingNames = new Set(lines.map((l) => normalize(l.name)));
      const toAdd = recipeIngredients.filter((i) => !existingNames.has(normalize(i)));
      if (toAdd.length === 0) return;
      const next = [
        ...lines,
        ...toAdd.map((name) => {
          const { price, category } = priceFor(name);
          return { id: uid(), name, price, checked: false, category };
        }),
      ];
      next.sort((a, b) => {
        const catOrder: Record<string, number> = { Produce: 0, Protein: 1, Pantry: 2 };
        return (catOrder[a.category] ?? 3) - (catOrder[b.category] ?? 3);
      });
      persist(next);
    },
    [lines, persist],
  );

  const toggleCheck = useCallback(
    (id: string) => {
      persist(lines.map((l) => (l.id === id ? { ...l, checked: !l.checked } : l)));
    },
    [lines, persist],
  );

  const clearChecked = useCallback(() => {
    persist(lines.filter((l) => !l.checked));
  }, [lines, persist]);

  const total = useMemo(() => lines.reduce((s, l) => s + l.price, 0), [lines]);

  const value = useMemo(
    () => ({ lines, total, loading: false, regenerate, addMissing, toggleCheck, clearChecked }),
    [lines, total, regenerate, addMissing, toggleCheck, clearChecked],
  );

  return <GroceryContext.Provider value={value}>{children}</GroceryContext.Provider>;
}

export function useGrocery(): GroceryContextValue {
  const ctx = useContext(GroceryContext);
  if (!ctx) throw new Error('useGrocery must be used within GroceryProvider');
  return ctx;
}