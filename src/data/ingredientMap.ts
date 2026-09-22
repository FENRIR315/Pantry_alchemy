export const MODEL_CLASSES: Record<string, string> = {
  anchovy: 'Anchovy',
  annona: 'Annona',
  apple: 'Apple',
  artichoke: 'Artichoke',
  avocado: 'Avocado',
  banana: 'Banana',
  'bay leaf': 'Bay Leaves',
  beet: 'Beet',
  'bell pepper': 'Bell Pepper',
  blueberry: 'Blueberries',
  broccoli: 'Broccoli',
  cabbage: 'Cabbage',
  carrot: 'Carrot',
  cauliflower: 'Cauliflower',
  cherry: 'Cherry',
  chicken: 'Chicken',
  chickpeas: 'Chickpeas',
  coriander: 'Coriander',
  cranberry: 'Cranberries',
  cucumber: 'Cucumber',
  egg: 'Eggs',
  eggplant: 'Eggplant',
  fish: 'Fish',
  garlic: 'Garlic',
  ginger: 'Ginger',
  gooseberry: 'Gooseberry',
  grape: 'Grapes',
  'green chilli pepper': 'Green Chilli Pepper',
  guava: 'Guava',
  kumquat: 'Kumquat',
  leek: 'Leek',
  lemon: 'Lemon',
  lettuce: 'Lettuce',
  'long pepper': 'Long Pepper',
  mango: 'Mango',
  mince: 'Ground Meat',
  mulberry: 'Mulberries',
  mutton: 'Mutton',
  oil: 'Cooking Oil',
  okra: 'Okra',
  onion: 'Onion',
  orange: 'Orange',
  'palm fruit': 'Palm Fruit',
  papaya: 'Papaya',
  parsley: 'Parsley',
  pear: 'Pear',
  pineapple: 'Pineapple',
  pitaya: 'Dragon Fruit',
  pork: 'Pork',
  potato: 'Potato',
  pumpkin: 'Pumpkin',
  radish: 'Radish',
  raspberry: 'Raspberries',
  'red meat': 'Red Meat',
  rice: 'Rice',
  salt: 'Salt',
  shrimp: 'Dried Shrimp',
  strawberry: 'Strawberries',
  tofu: 'Tofu',
  tomato: 'Tomato',
  turmeric: 'Turmeric',
  'white beans': 'White Beans',
  'white button mushroom': 'White Mushroom',
  zucchini: 'Zucchini',
};

export function mapModelClass(name: string): string {
  const key = name.trim().toLowerCase();
  return MODEL_CLASSES[key] ?? titleCase(name);
}

export function isKnownModelClass(name: string): boolean {
  return name.trim().toLowerCase() in MODEL_CLASSES;
}

function titleCase(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}