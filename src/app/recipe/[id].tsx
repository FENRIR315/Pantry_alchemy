import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Clock, Users, Check, X, UtensilsCrossed } from 'lucide-react-native';
import { recipeById } from '../../data/recipes';
import { matchRecipe } from '../../utils/matching';
import { usePantry } from '../../context/PantryContext';
import { usePlan } from '../../context/PlanContext';
import { useGrocery } from '../../context/GroceryContext';
import { useFavorites } from '../../context/FavoritesContext';
import { PrimaryButton, OutlineButton } from '../../components/Buttons';
import MatchRing from '../../components/MatchRing';
import PressScale, { SuccessToast, Entrance } from '../../components/motion';
import DecorBackground from '../../components/Decor';
import { colors, spacing } from '../../theme';

type Toast = 'plan' | 'grocery' | 'favorite' | 'unfavorite' | null;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = id ? recipeById(id) : undefined;
  const { items } = usePantry();
  const { addRecipeToPlan } = usePlan();
  const { addMissing: addToList } = useGrocery();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [toast, setToast] = useState<Toast>(null);
  const [scrolled, setScrolled] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const match = useMemo(() => (recipe ? matchRecipe(recipe, items) : null), [recipe, items]);

  const showToast = (next: Toast) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), 1700);
  };

  if (!recipe || !match) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.error}>Recipe not found.</Text>
      </View>
    );
  }

  const faved = isFavorite(recipe.id);

  const addToPlan = () => {
    addRecipeToPlan(recipe.id, items);
    showToast('plan');
    setTimeout(() => router.push('/(tabs)/planner'), 650);
  };

  const addToGrocery = () => {
    if (match.missing.length === 0) return;
    addToList(match.missing);
    showToast('grocery');
    setTimeout(() => router.push('/(tabs)/list'), 650);
  };

  const handleFavorite = () => {
    toggleFavorite(recipe.id);
    showToast(faved ? 'unfavorite' : 'favorite');
  };

  const toastMsg =
    toast === 'plan'
      ? 'Added to this week’s plan'
      : toast === 'grocery'
        ? 'Missing items added to list'
        : toast === 'favorite'
          ? 'Saved to favorites'
          : toast === 'unfavorite'
            ? 'Removed from favorites'
            : null;

  return (
    <View style={styles.wrap}>
      <StatusBar style={scrolled ? 'dark' : 'light'} />
      <DecorBackground />
      {toastMsg ? <SuccessToast message={toastMsg} /> : null}

      <ScrollView
        onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 90)}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: recipe.color }]}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroTop}>
            <PressScale onPress={() => router.back()} haptic="light" contentStyle={styles.iconBtnWhite}>
              <ArrowLeft size={18} color="#fff" strokeWidth={2.2} />
            </PressScale>
            <PressScale onPress={handleFavorite} haptic="light" contentStyle={styles.iconBtnWhite}>
              <Heart
                size={18}
                color={faved ? colors.terracotta : colors.inkFaint}
                strokeWidth={2}
                fill={faved ? colors.terracotta : 'transparent'}
              />
            </PressScale>
          </View>
          <View style={styles.heroMark}>
            <UtensilsCrossed size={64} color="rgba(255,255,255,0.18)" strokeWidth={1.6} />
          </View>
          <Text style={styles.heroTitle}>{recipe.title}</Text>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.inkSoft} strokeWidth={2} />
            <Text style={styles.metaText}>{recipe.minutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color={colors.inkSoft} strokeWidth={2} />
            <Text style={styles.metaText}>Serves {recipe.servings}</Text>
          </View>
        </View>

        <View style={styles.matchBanner}>
          <MatchRing
            percent={match.percent}
            size={56}
            strokeWidth={6}
            color={colors.sage}
            track={colors.sageSoft}
          />
          <View style={styles.matchInfo}>
            <Text style={styles.matchTitle}>
              {match.percent >= 80
                ? 'Great pantry match'
                : match.percent >= 50
                  ? 'Good pantry match'
                  : 'Some ingredients needed'}
            </Text>
            <Text style={styles.matchSub}>
              You have {match.have.length} of {recipe.ingredients.length} ingredient
              {recipe.ingredients.length === 1 ? '' : 's'} already
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${match.percent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.cols}>
          <View style={styles.colHave}>
            <Text style={styles.colTitleHave}>
              <Check size={13} color={colors.sage} strokeWidth={2.4} /> You Have
            </Text>
            {match.have.map((name) => (
              <Text key={name} style={styles.ing}>{name}</Text>
            ))}
            {match.have.length === 0 && <Text style={styles.noIng}>—</Text>}
          </View>
          <View style={styles.colMiss}>
            <Text style={styles.colTitleMiss}>
              <X size={13} color={colors.terracotta} strokeWidth={2.4} /> Missing
            </Text>
            {match.missing.map((name) => (
              <Text key={name} style={styles.ing}>{name}</Text>
            ))}
            {match.missing.length === 0 && <Text style={styles.noIng}>All set!</Text>}
          </View>
        </View>

        <Text style={styles.sectionHead}>Instructions</Text>
        <View style={styles.steps}>
          {recipe.steps.map((step, i) => (
            <Entrance key={i} index={i} distance={10} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </Entrance>
          ))}
        </View>
      </ScrollView>

      <View style={styles.ctaWrap}>
        <PrimaryButton title="Add to Meal Plan" onPress={addToPlan} />
        <OutlineButton title="Add Missing to Grocery List" onPress={addToGrocery} disabled={match.missing.length === 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  error: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 80,
  },
  scroll: { paddingBottom: 120 },

  hero: {
    height: 210,
    justifyContent: 'flex-end',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20,15,8,0.30)' },
  heroMark: { position: 'absolute', right: -14, top: 70, opacity: 0.9 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 3,
  },
  heroTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 24,
    color: '#fff',
    zIndex: 3,
    paddingRight: 40,
  },

  iconBtnWhite: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  meta: { flexDirection: 'row', gap: 14, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontFamily: 'WorkSans_400Regular', fontSize: 12.5, color: colors.inkSoft },

  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 18,
    backgroundColor: colors.sageTint,
    borderWidth: 1.4,
    borderColor: colors.sageSoft,
  },
  matchInfo: { flex: 1 },
  matchTitle: { fontFamily: 'WorkSans_600SemiBold', fontSize: 14, color: colors.ink, marginBottom: 2 },
  matchSub: { fontFamily: 'WorkSans_400Regular', fontSize: 12, color: colors.inkSoft },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.sageSoft,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: 7, borderRadius: 4, backgroundColor: colors.sage },

  cols: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  colHave: {
    flex: 1,
    backgroundColor: colors.sageTint,
    borderWidth: 1.2,
    borderColor: colors.sageSoft,
    borderRadius: 18,
    padding: 12,
  },
  colMiss: {
    flex: 1,
    backgroundColor: colors.terracottaTint,
    borderWidth: 1.2,
    borderColor: colors.terracottaSoft,
    borderRadius: 18,
    padding: 12,
  },
  colTitleHave: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 11.5,
    textTransform: 'uppercase',
    letterSpacing: 0.04,
    color: colors.sage,
    marginBottom: 8,
  },
  colTitleMiss: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 11.5,
    textTransform: 'uppercase',
    letterSpacing: 0.04,
    color: colors.terracotta,
    marginBottom: 8,
  },
  ing: { fontFamily: 'WorkSans_400Regular', fontSize: 13, color: colors.ink, paddingVertical: 3 },
  noIng: { fontFamily: 'WorkSans_400Regular', fontSize: 13, color: colors.inkFaint },

  sectionHead: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 12.5,
    textTransform: 'uppercase',
    letterSpacing: 0.06,
    color: colors.inkFaint,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  steps: { paddingHorizontal: spacing.xl },
  step: { flexDirection: 'row', gap: 12, paddingVertical: 10 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: 'Fredoka_600SemiBold', fontSize: 12, color: colors.cream },
  stepText: {
    flex: 1,
    fontFamily: 'WorkSans_400Regular',
    fontSize: 13.5,
    color: colors.inkSoft,
    lineHeight: 20,
    paddingTop: 2,
  },

  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.cream,
    gap: 10,
  },
});