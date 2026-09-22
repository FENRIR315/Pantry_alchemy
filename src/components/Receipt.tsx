import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import PressScale, { BouncingCheck } from './motion';
import { GroceryLine } from '../types';
import { Category } from '../data/grocery';

export function ReceiptHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.shop}>PANTRY ALCHEMY</Text>
      <Text style={styles.tagline}>COOK WITH WHAT YOU&apos;VE GOT</Text>
      <Text style={styles.week}>WEEKLY SHOPPING LIST</Text>
      <View style={styles.serrated} />
    </View>
  );
}

export function ReceiptLine({ line, onToggle }: { line: GroceryLine; onToggle?: () => void }) {
  return (
    <PressScale onPress={onToggle} haptic="selection" contentStyle={styles.line}>
      <BouncingCheck checked={line.checked} size={19} style={styles.checkBoxCell} />
      <Text
        style={[styles.name, line.checked && styles.nameDone]}
        numberOfLines={1}
      >
        {line.name}
      </Text>
    </PressScale>
  );
}

export default function Receipt({ lines }: { lines: GroceryLine[] }) {
  const categories: Category[] = ['Produce', 'Protein', 'Pantry'];

  return (
    <View style={styles.receipt}>
      <ReceiptHeader />
      {categories.map((cat) => {
        const items = lines.filter((l) => l.category === cat);
        if (items.length === 0) return null;
        return (
          <View key={cat}>
            <Text style={styles.cat}>{cat.toUpperCase()}</Text>
            {items.map((l) => (
              <ReceiptLine key={l.id} line={l} />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 8,
  },
  shop: {
    fontFamily: fonts.monoBold,
    fontSize: 13,
    letterSpacing: 0.18,
    color: colors.ink,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 0.1,
    color: colors.inkFaint,
    marginTop: 3,
  },
  week: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 0.14,
    color: colors.inkSoft,
    marginTop: 8,
  },
  serrated: {
    alignSelf: 'stretch',
    height: 12,
    marginTop: 12,
    backgroundColor: colors.cream,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  receipt: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
    marginTop: 16,
  },
  cat: {
    fontFamily: fonts.monoBold,
    fontSize: 10.5,
    letterSpacing: 0.12,
    color: colors.terracotta,
    marginTop: 14,
    marginBottom: 4,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
  },
  checkBoxCell: { width: 22, alignItems: 'center' },
  name: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 12.5,
    color: colors.ink,
  },
  nameDone: { textDecorationLine: 'line-through', color: colors.inkFaint },
});