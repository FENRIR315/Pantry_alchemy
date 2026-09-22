import React from 'react';
import { StyleSheet, Text, ActivityIndicator, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, shadows } from '../theme';
import PressScale, { HapticFeedback } from './motion';

export type ButtonSize = 'lg' | 'sm';
export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'flat' | 'gold';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  size?: ButtonSize;
  variant?: ButtonVariant;
  haptic?: HapticFeedback;
}

function ButtonContent({
  title,
  loading,
  icon,
  variant,
  color,
  size,
}: {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
  variant: ButtonVariant;
  color: string;
  size: ButtonSize;
}) {
  const spinner = loading ? (
    <ActivityIndicator color={color} size="small" />
  ) : null;

  if (variant === 'outline' || variant === 'ghost') {
    const content = (
      <>
        {!loading && icon}
        <Text style={[styles.baseText, size === 'sm' && styles.smText, { color }]}>{title}</Text>
      </>
    );
    return loading ? (
      <View style={styles.row}>
        {spinner}
        <Text style={[styles.baseText, size === 'sm' && styles.smText, { color, opacity: 0.65 }]}>{title}</Text>
      </View>
    ) : content;
  }

  return (
    <View style={styles.row}>
      {spinner ? spinner : icon}
      <Text style={[styles.baseText, size === 'sm' && styles.smText, styles.lightText]}>{title}</Text>
    </View>
  );
}

export function PrimaryButton({ title, onPress, loading, disabled, icon, style, size = 'lg', haptic = 'light' }: ButtonProps) {
  const dim = disabled || loading;
  return (
    <PressScale onPress={onPress} disabled={dim} haptic={haptic} contentStyle={[styles.lgSize, style]}>
      <LinearGradient
        colors={colors.gradientTerracotta}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.solid, size === 'sm' && styles.smSize, dim && styles.disabled]}
      >
        <ButtonContent title={title} loading={loading} icon={icon} variant="primary" color={colors.white} size={size} />
      </LinearGradient>
    </PressScale>
  );
}

export function FlatButton({ title, onPress, loading, disabled, icon, style, size = 'lg', haptic = 'light' }: ButtonProps) {
  const dim = disabled || loading;
  return (
    <PressScale onPress={onPress} disabled={dim} haptic={haptic} contentStyle={[styles.lgSize, style]}>
      <LinearGradient
        colors={colors.gradientSage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.solid, size === 'sm' && styles.smSize, dim && styles.disabled]}
      >
        <ButtonContent title={title} loading={loading} icon={icon} variant="flat" color={colors.white} size={size} />
      </LinearGradient>
    </PressScale>
  );
}

export function GoldButton({ title, onPress, loading, disabled, icon, style, size = 'lg', haptic = 'light' }: ButtonProps) {
  const dim = disabled || loading;
  return (
    <PressScale onPress={onPress} disabled={dim} haptic={haptic} contentStyle={[styles.lgSize, style]}>
      <LinearGradient
        colors={colors.gradientGold}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.solid, size === 'sm' && styles.smSize, dim && styles.disabled]}
      >
        <ButtonContent title={title} loading={loading} icon={icon} variant="gold" color={colors.ink} size={size} />
      </LinearGradient>
    </PressScale>
  );
}

export function OutlineButton({ title, onPress, icon, style, size = 'lg', haptic }: ButtonProps) {
  return (
    <PressScale onPress={onPress} haptic={haptic} contentStyle={[styles.lgSize, size === 'sm' && styles.smWrap, style]}>
      <View style={[styles.outline, size === 'sm' && styles.smSizeOuter]}>
        <ButtonContent title={title} icon={icon} variant="outline" color={colors.sage} size={size} />
      </View>
    </PressScale>
  );
}

export function GhostButton({ title, onPress, icon, style, size = 'lg', haptic }: ButtonProps) {
  return (
    <PressScale onPress={onPress} haptic={haptic} contentStyle={[styles.ghost, size === 'sm' && styles.ghostSm, style]}>
      <ButtonContent title={title} icon={icon} variant="ghost" color={colors.terracotta} size={size} />
    </PressScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  solid: {
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 24,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cta,
  },
  lgSize: { minHeight: 52 },
  smSize: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    minHeight: 40,
  },
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.6,
    borderColor: colors.sage,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 20,
    minHeight: 48,
    backgroundColor: 'transparent',
  },
  smSizeOuter: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 40 },
  smWrap: { minHeight: 40 },
  ghost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  ghostSm: { paddingVertical: 6, paddingHorizontal: 10 },
  baseText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  smText: { fontSize: 13.5 },
  lightText: { color: colors.white },
  disabled: { opacity: 0.55 },
});