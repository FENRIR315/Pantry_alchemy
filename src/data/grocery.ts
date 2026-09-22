export type Category = 'Produce' | 'Protein' | 'Pantry';

interface PriceEntry {
  price: number;
  category: Category;
}

export const GROCERY_PRICES: Record<string, PriceEntry> = {
  Tomato: { price: 40, category: 'Produce' },
  Eggplant: { price: 45, category: 'Produce' },
  Squash: { price: 45, category: 'Produce' },
  'Ampalaya Leaves': { price: 35, category: 'Produce' },
  Kangkong: { price: 20, category: 'Produce' },
  Sitaw: { price: 30, category: 'Produce' },
  Radish: { price: 28, category: 'Produce' },
  Chayote: { price: 40, category: 'Produce' },
  Scallion: { price: 15, category: 'Produce' },
  Ginger: { price: 25, category: 'Produce' },
  Spinach: { price: 25, category: 'Produce' },
  'Green Chilli Pepper': { price: 30, category: 'Produce' },
  Onion: { price: 45, category: 'Produce' },
  Garlic: { price: 40, category: 'Produce' },

  Eggs: { price: 85, category: 'Protein' },
  Chicken: { price: 210, category: 'Protein' },
  Pork: { price: 180, category: 'Protein' },
  'Dried Shrimp': { price: 60, category: 'Protein' },
  Fish: { price: 150, category: 'Protein' },
  'Ground Meat': { price: 140, category: 'Protein' },
  Tofu: { price: 45, category: 'Protein' },

  Rice: { price: 120, category: 'Pantry' },
  'Cooking Oil': { price: 95, category: 'Pantry' },
  'Soy Sauce': { price: 55, category: 'Pantry' },
  'Fish Sauce': { price: 65, category: 'Pantry' },
  Vinegar: { price: 40, category: 'Pantry' },
  Salt: { price: 20, category: 'Pantry' },
  'Tamarind Mix': { price: 25, category: 'Pantry' },
  'Bay Leaves': { price: 15, category: 'Pantry' },
  'Black Pepper': { price: 25, category: 'Pantry' },
  'White Pepper': { price: 25, category: 'Pantry' },
  'Chicken Broth': { price: 45, category: 'Pantry' },
  Cornstarch: { price: 20, category: 'Pantry' },
  'Mung Beans': { price: 60, category: 'Pantry' },
};

export const DEFAULT_PRICE: PriceEntry = { price: 50, category: 'Pantry' };

export function priceFor(name: string): PriceEntry {
  return GROCERY_PRICES[name] ?? DEFAULT_PRICE;
}