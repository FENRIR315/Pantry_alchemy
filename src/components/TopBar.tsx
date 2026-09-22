import React from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { colors, fonts, spacing } from '../theme';
import PressScale from './motion';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: Href;
  right?: React.ReactNode;
}

export default function TopBar({ title, subtitle, showBack, backTo, right }: TopBarProps) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      {showBack && (
        <PressScale
          onPress={() => (backTo ? router.replace(backTo) : router.back())}
          haptic="light"
          contentStyle={styles.iconBtn}
          hitSlop={8}
        >
          <ArrowLeft size={18} color={colors.ink} strokeWidth={2.2} />
        </PressScale>
      )}
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg + 2,
    paddingBottom: spacing.xs,
  },
  textWrap: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.inkSoft,
    marginTop: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: { width: 36 },
});

export type { TextStyle };