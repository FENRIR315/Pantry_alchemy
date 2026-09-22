/* eslint-disable react-hooks/immutability -- reanimated shared-value mutations are intentional */
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  StyleProp,
  ViewStyle,
  Platform,
  Insets,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fonts, motion } from '../theme';

export type HapticFeedback =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error'
  | false;

function runHaptic(feedback: HapticFeedback) {
  if (!feedback || Platform.OS === 'web') return;
  switch (feedback) {
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'heavy':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
    default:
      Haptics.selectionAsync();
  }
}

interface PressScaleProps {
  children?: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  haptic?: HapticFeedback;
  to?: number;
  contentStyle?: StyleProp<ViewStyle>;
  hitSlop?: number | Insets | null;
  testID?: string;
}

/**
 * Wrapper that lays out nothing itself: the visual style lives on the inner
 * Animated.View so the whole control (background, border, shadow) scales with
 * a spring while the hit area / ripple stay put.
 */
export default function PressScale({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  haptic = 'light',
  to = motion.pressScale,
  contentStyle,
  hitSlop,
  testID,
}: PressScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(to, motion.spring);
    if (haptic) runHaptic(haptic);
    onPressIn?.();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, motion.spring);
    onPressOut?.();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      disabled={disabled}
      hitSlop={hitSlop ?? undefined}
      android_ripple={{ color: 'rgba(120, 60, 20, 0.10)' }}
      testID={testID}
    >
      <Animated.View style={[animatedStyle, contentStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

interface EntranceProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}

/** Fade + rise, staggered by index. */
export function Entrance({ children, index = 0, delay = 0, distance = 16, style }: EntranceProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(distance);

  useEffect(() => {
    const d = delay + index * motion.stagger;
    opacity.value = withDelay(d, withTiming(1, { duration: motion.base, easing: Easing.bezier(...motion.easing) }));
    translateY.value = withDelay(d, withSpring(0, motion.spring));
  }, [index, delay, distance, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

/** Pop-in (scale) used for success checkmarks, badges, toasts. */
export function PopIn({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View entering={ZoomIn.springify().damping(13).stiffness(220).mass(0.7)} style={style}>
      {children}
    </Animated.View>
  );
}

interface CheckStyleProps {
  checked: boolean;
  onPress?: () => void;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** Animated checkbox dot used in confirm rows and receipt lines. */
export function BouncingCheck({ checked, onPress, color = colors.sage, size = 22, style }: CheckStyleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (checked) {
      scale.value = withSpring(1.15, motion.spring);
      scale.value = withDelay(70, withSpring(1, { ...motion.spring }));
    }
  }, [checked, scale]);

  const box = (
    <Animated.View
      style={[
        styles.checkBox,
        { width: size, height: size, borderRadius: size * 0.36 },
        checked && { backgroundColor: color, borderColor: color },
        animatedStyle,
      ]}
    >
      {checked && <Text style={styles.checkMark}>✓</Text>}
    </Animated.View>
  );

  if (!onPress) {
    return <View style={[styles.checkWrap, style]}>{box}</View>;
  }

  return (
    <Pressable
      onPress={() => {
        runHaptic('selection');
        onPress?.();
      }}
      hitSlop={8}
      style={[styles.checkWrap, style]}
    >
      {box}
    </Pressable>
  );
}

export function SuccessToast({ message }: { message: string }) {
  return (
    <PopIn>
      <View style={styles.toast} pointerEvents="none">
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </PopIn>
  );
}

const styles = StyleSheet.create({
  checkWrap: { alignItems: 'center', justifyContent: 'center' },
  checkBox: {
    borderWidth: 1.8,
    borderColor: colors.line,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 15 },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    top: 60,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.ink,
    zIndex: 50,
  },
  toastText: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.cream },
});