import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UtensilsCrossed, Clock, Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, fonts } from '../theme';
import MatchRing from './MatchRing';
import PressScale from './motion';
import { RecipeMatch } from '../utils/matching';

export default function RecipeCard({ match, featured }: { match: RecipeMatch; featured?: boolean }) {
  const router = useRouter();
  const { recipe, missing, percent } = match;

  return (
    <PressScale
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      haptic="light"
      contentStyle={[styles.card, featured && styles.cardFeatured]}
    >
      <View style={styles.thumbWrap}>
        <View style={[styles.thumb, { backgroundColor: recipe.color }]}>
          <UtensilsCrossed size={26} color="#fff" strokeWidth={1.8} />
        </View>
        {featured && (
          <View style={styles.bestBadge}>
            <Crown size={10} color={colors.goldDeep} strokeWidth={2.4} fill={colors.gold} />
            <Text style={styles.bestText}>Best match</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={styles.meta}>
          <Clock size={12} color={colors.inkSoft} strokeWidth={2} />
          <Text style={styles.metaText}>{recipe.minutes} min</Text>
          <Text style={[styles.metaText, missing.length > 0 && styles.missingText]}>
            · {missing.length === 0 ? 'all set' : `${missing.length} missing`}
          </Text>
        </View>
      </View>
      <MatchRing percent={percent} />
    </PressScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1.4,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 12,
    marginTop: 12,
  },
  cardFeatured: {
    borderColor: colors.gold,
    borderWidth: 1.8,
    backgroundColor: colors.goldTint,
  },
  thumbWrap: { position: 'relative' },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestBadge: {
    position: 'absolute',
    bottom: -7,
    left: '50%',
    transform: [{ translateX: -34 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.goldTint,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
    width: 68,
    justifyContent: 'center',
  },
  bestText: {
    fontFamily: fonts.bodyBold,
    fontSize: 8.5,
    color: colors.goldDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.05,
  },
  info: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.ink, marginBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft },
  missingText: { fontFamily: fonts.bodySemiBold, color: colors.terracotta },
});