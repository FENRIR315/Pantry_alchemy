import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { Entrance, PopIn } from './motion';

export function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{children}</Text>
      {right}
    </View>
  );
}

export function CountBadge({ count }: { count: number }) {
  return (
    <PopIn>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </PopIn>
  );
}

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Entrance>
      <View style={styles.empty}>
        {icon && <View style={styles.emptyIcon}>{icon}</View>}
        <Text style={styles.emptyTitle}>{title}</Text>
        {hint ? <Text style={styles.emptyHint}>{hint}</Text> : null}
      </View>
    </Entrance>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontFamily: fonts.bodyBold,
    fontSize: 12.5,
    textTransform: 'uppercase',
    letterSpacing: 0.06,
    color: colors.inkFaint,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.terracottaTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.terracotta },
  empty: {
    alignItems: 'center',
    paddingVertical: 42,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.creamDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  emptyHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
});