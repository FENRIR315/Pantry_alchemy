export interface Recipe {
  id: string;
  title: string;
  tagline: string;
  minutes: number;
  servings: number;
  color: string;
  vegetarian?: boolean;
  under30?: boolean;
  ingredients: string[];
  steps: string[];
}

export interface PlanDay {
  day: string;
  dateLabel: string;
  recipeId: string;
}

export interface GroceryLine {
  id: string;
  name: string;
  price: number;
  checked: boolean;
  category: string;
}

export interface DetectedIngredient {
  name: string;
  confidence: number;
}

export interface DetectResponse {
  count: number;
  inference_ms: number;
  ingredients: DetectedIngredient[];
  detections: unknown[];
}