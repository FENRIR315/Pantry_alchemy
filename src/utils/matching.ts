import { Recipe } from '../types';
import { RECIPES } from '../data/recipes';

export const normalize = (name: string): string => name.trim().toLowerCase();

export interface RecipeMatch {
  recipe: Recipe;
  have: string[];
  missing: string[];
  percent: number;
}

export function matchRecipe(recipe: Recipe, pantry: string[]): RecipeMatch {
  const have = new Set(pantry.map(normalize));
  const present = recipe.ingredients.filter((i) => have.has(normalize(i)));
  const missing = recipe.ingredients.filter((i) => !have.has(normalize(i)));
  const percent = recipe.ingredients.length
    ? Math.round((present.length / recipe.ingredients.length) * 100)
    : 0;
  return { recipe, have: present, missing, percent };
}

export function rankRecipes(pantry: string[]): RecipeMatch[] {
  return RECIPES.map((r) => matchRecipe(r, pantry)).sort(
    (a, b) => b.percent - a.percent || a.recipe.minutes - b.recipe.minutes,
  );
}

export function bestSwapCandidates(
  pantry: string[],
  excludeRecipeIds: string[],
  count = 3,
): RecipeMatch[] {
  return rankRecipes(pantry)
    .filter((m) => !excludeRecipeIds.includes(m.recipe.id) && m.percent > 0)
    .slice(0, count);
}