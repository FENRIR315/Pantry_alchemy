import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { colors, fonts } from '../theme';
import MatchRing from './MatchRing';
import PressScale from './motion';
import { Recipe, PlanDay } from '../types';
import { recipeById } from '../data/recipes';

interface DayRowProps {
  day: PlanDay;
  matchPercent: number;
  onSwap?: () => void;
}

export default function DayRow({ day, matchPercent, onSwap }: DayRowProps) {
  const recipe: Recipe | undefined = recipeById(day.recipeId);

  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Text style={styles.badgeDay}>{day.day}</Text>
        <Text style={styles.badgeNum}>{day.dateLabel}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe?.title ?? 'Pick a recipe'}
        </Text>
        <Text style={styles.sub}>
          {matchPercent}% of ingredients on hand
        </Text>
      </View>
      <PressScale onPress={onSwap} haptic="selection" contentStyle={styles.swap}>
        <RefreshCw size={13} color={colors.terracotta} strokeWidth={2.4} />
        <Text style={styles.swapText}>Swap</Text>
      </PressScale>
      <MatchRing percent={matchPercent} size={40} strokeWidth={4} color={colors.sage} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1.4,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 10,
    marginTop: 10,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.creamDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDay: {
    fontFamily: fonts.bodyBold,
    fontSize: 9.5,
    textTransform: 'uppercase',
    color: colors.inkFaint,
  },
  badgeNum: { fontFamily: fonts.display, fontSize: 14, color: colors.ink },
  info: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft },
  swap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.terracottaTint,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  swapText: { fontFamily: fonts.bodySemiBold, fontSize: 11.5, color: colors.terracotta },
});