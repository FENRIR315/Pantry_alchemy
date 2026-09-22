import React from 'react';
import { PantryProvider } from './PantryContext';
import { PlanProvider } from './PlanContext';
import { GroceryProvider } from './GroceryContext';
import { FavoritesProvider } from './FavoritesContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <PantryProvider>
        <PlanProvider>
          <GroceryProvider>{children}</GroceryProvider>
        </PlanProvider>
      </PantryProvider>
    </FavoritesProvider>
  );
}