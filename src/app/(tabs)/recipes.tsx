import React, { useMemo, useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../components/TopBar';
import { FilterPill } from '../../components/Chip';
import RecipeCard from '../../components/RecipeCard';
import { EmptyState } from '../../components/Labels';
import { Entrance } from '../../components/motion';
import DecorBackground from '../../components/Decor';
import { usePantry } from '../../context/PantryContext';
import { rankRecipes } from '../../utils/matching';
import { colors, fonts, spacing } from '../../theme';

type Filter = 'match' | 'under30' | 'vegetarian';

export default function RecipesScreen() {
  const { items } = usePantry();
  const [filter, setFilter] = useState<Filter>('match');

  const matches = useMemo(() => rankRecipes(items), [items]);

  const visible = useMemo(() => {
    if (filter === 'under30') return matches.filter((m) => m.recipe.under30);
    if (filter === 'vegetarian') return matches.filter((m) => m.recipe.vegetarian);
    return matches;
  }, [matches, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'match', label: 'Highest Match' },
    { key: 'under30', label: 'Under 30 min' },
    { key: 'vegetarian', label: 'Vegetarian' },
  ];

  return (
    <View style={styles.safe}>
      <DecorBackground sage />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <TopBar
          title="Recipes for You"
          subtitle={`Based on ${items.length} ingredient${items.length === 1 ? '' : 's'} in your pantry`}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => (
            <FilterPill
              key={f.key}
              label={f.label}
              active={filter === f.key}
              onPress={() => setFilter(f.key)}
            />
          ))}
        </ScrollView>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {visible.length === 0 ? (
            <EmptyState title="No recipes here yet" hint="Add a few pantry staples to unlock matches." />
          ) : (
            <>
              <Text style={styles.count}>
                {visible.length} recipe{visible.length === 1 ? '' : 's'} · {filter === 'under30' ? 'made in a hurry' : filter === 'vegetarian' ? 'meat-free picks' : 'sorted by what you have'}
              </Text>
              {visible.map((m, i) => (
                <Entrance key={m.recipe.id} index={i} distance={14}>
                  <RecipeCard match={m} featured={filter === 'match' && i === 0} />
                </Entrance>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 96,
  },
  count: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkFaint,
    marginTop: spacing.xs,
  },
});