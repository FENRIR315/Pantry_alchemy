import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import TopBar from '../../components/TopBar';
import DayRow from '../../components/DayRow';
import { PrimaryButton } from '../../components/Buttons';
import { Entrance } from '../../components/motion';
import DecorBackground from '../../components/Decor';
import { usePlan } from '../../context/PlanContext';
import { usePantry } from '../../context/PantryContext';
import { useGrocery } from '../../context/GroceryContext';
import { matchRecipe } from '../../utils/matching';
import { recipeById } from '../../data/recipes';
import { colors, fonts, spacing } from '../../theme';

export default function PlannerScreen() {
  const router = useRouter();
  const { plan, swapDay } = usePlan();
  const { items } = usePantry();
  const { regenerate } = useGrocery();

  const matches = useMemo(
    () =>
      plan.map((d) => {
        const recipe = recipeById(d.recipeId);
        return recipe ? matchRecipe(recipe, items).percent : 0;
      }),
    [plan, items],
  );

  const summary = useMemo(() => {
    const avg = matches.length ? Math.round(matches.reduce((s, m) => s + m, 0) / matches.length) : 0;
    const allSet = matches.filter((m) => m >= 80).length;
    return { avg, allSet };
  }, [matches]);

  const handleSwap = useCallback(
    (index: number) => {
      swapDay(index, items);
    },
    [swapDay, items],
  );

  const handleGenerate = useCallback(() => {
    regenerate(plan, items);
    router.push('/(tabs)/list');
  }, [regenerate, plan, items, router]);

  return (
    <View style={styles.safe}>
      <DecorBackground sage />
      <SafeAreaView edges={['top']} style={styles.safe}>
      <TopBar title="This Week's Plan" subtitle="Built to stretch your pantry across 7 days" />

      <Entrance index={0} style={styles.summaryWrap}>
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.avg}%</Text>
            <Text style={styles.summaryLabel}>avg. match</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.allSet}</Text>
            <Text style={styles.summaryLabel}>ready to cook</Text>
          </View>
        </View>
      </Entrance>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {plan.map((day, i) => (
          <Entrance key={day.day} index={i + 1} distance={12}>
            <DayRow
              day={day}
              matchPercent={matches[i]}
              onSwap={() => handleSwap(i)}
            />
          </Entrance>
        ))}
        <Text style={styles.hint}>Tap Swap to re-roll a day from your best pantry matches.</Text>
      </ScrollView>
      <Entrance index={8} style={styles.cta}>
        <PrimaryButton title="Generate Grocery List" onPress={handleGenerate} />
      </Entrance>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  summaryWrap: { paddingHorizontal: spacing.xl, marginTop: spacing.md },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.4,
    borderColor: colors.line,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.ink },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.04,
    marginTop: 2,
  },
  summaryDivider: { width: 1.4, height: 34, backgroundColor: colors.line },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});