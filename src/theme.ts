export const colors = {
  cream: '#FAF1DC',
  creamDeep: '#F3E7C9',
  card: '#FFFCF3',
  ink: '#2B1710',
  inkSoft: '#6B5744',
  inkFaint: '#9C8973',
  terracotta: '#C1502D',
  terracottaDeep: '#A73F22',
  terracottaSoft: '#EFC1AA',
  terracottaTint: '#FBE9DF',
  sage: '#7E9473',
  sageDeep: '#5F7A55',
  sageSoft: '#D8E2D1',
  sageTint: '#EEF3EA',
  gold: '#D9A441',
  goldDeep: '#C08A2D',
  goldTint: '#F8ECD6',
  line: '#E6D6AE',
  white: '#FFFFFF',
  darkViewfinder: '#241812',
  danger: '#B3261E',
  // gradients (start -> end)
  gradientTerracotta: ['#D96A3F', '#C1502D', '#A73F22'] as const,
  gradientGold: ['#E7BE60', '#D9A441', '#C08A2D'] as const,
  gradientSage: ['#93A989', '#7E9473', '#657B5C'] as const,
};

export const fonts = {
  display: 'Fredoka_600SemiBold',
  displayBold: 'Fredoka_700Bold',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodySemiBold: 'WorkSans_600SemiBold',
  bodyBold: 'WorkSans_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoBold: 'IBMPlexMono_600SemiBold',
};

export const radii = {
  lg: 28,
  md: 18,
  sm: 10,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screen: 20,
};

export const shadows = {
  card: {
    shadowColor: '#2B1710',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  cta: {
    shadowColor: '#C1502D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const layout = {
  maxContentWidth: 480,
  tabBarHeight: 66,
  cornerOffset: 44,
};

export const motion = {
  fast: 140,
  base: 240,
  slow: 420,
  stagger: 55,
  pressScale: 0.965,
  spring: { damping: 15, stiffness: 260, mass: 0.8 },
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
};