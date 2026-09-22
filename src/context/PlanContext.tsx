import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PlanDay } from '../types';
import { DEFAULT_PLAN, recipeById } from '../data/recipes';
import { loadJSON, saveJSON } from '../utils/storage';
import { bestSwapCandidates, matchRecipe } from '../utils/matching';

const STORAGE_KEY = 'pa:plan';

interface PlanContextValue {
  plan: PlanDay[];
  loading: boolean;
  setDayRecipe: (index: number, recipeId: string) => void;
  swapDay: (index: number, pantry: string[]) => string | null;
  addRecipeToPlan: (recipeId: string, pantry: string[]) => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanDay[] | null>(null);

  useEffect(() => {
    loadJSON<PlanDay[]>(STORAGE_KEY, DEFAULT_PLAN).then(setPlan);
  }, []);

  const persist = useCallback((next: PlanDay[]) => {
    setPlan(next);
    saveJSON(STORAGE_KEY, next);
  }, []);

  const setDayRecipe = useCallback(
    (index: number, recipeId: string) => {
      if (!plan || index < 0 || index >= plan.length) return;
      const next = [...plan];
      next[index] = { ...next[index], recipeId };
      persist(next);
    },
    [plan, persist],
  );

  const swapDay = useCallback(
    (index: number, pantry: string[]) => {
      if (!plan || index < 0 || index >= plan.length) return null;
      const excludeIds = plan.map((d) => d.recipeId);
      excludeIds.splice(index, 1);
      const picks = bestSwapCandidates(pantry, excludeIds, 5);
      if (picks.length === 0) return null;
      const pick = picks[Math.floor(Math.random() * picks.length)];
      setDayRecipe(index, pick.recipe.id);
      return pick.recipe.id;
    },
    [plan, setDayRecipe],
  );

  const addRecipeToPlan = useCallback(
    (recipeId: string, pantry: string[]) => {
      if (!plan) return;
      const matched = plan.map((d, i) => ({
        i,
        match: matchRecipe(recipeById(d.recipeId)!, pantry).percent,
      }));
      const worst = matched.reduce((a, b) => (b.match < a.match ? b : a));
      const next = [...plan];
      next[worst.i] = { ...next[worst.i], recipeId };
      persist(next);
    },
    [plan, persist],
  );

  const value = useMemo(
    () => ({
      plan: plan ?? DEFAULT_PLAN,
      loading: plan == null,
      setDayRecipe,
      swapDay,
      addRecipeToPlan,
    }),
    [plan, setDayRecipe, swapDay, addRecipeToPlan],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}