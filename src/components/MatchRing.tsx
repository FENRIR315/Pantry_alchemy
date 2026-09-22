import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts, motion } from '../theme';

interface MatchRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  track?: string;
  showLabel?: boolean;
}

export default function MatchRing({
  percent,
  size = 46,
  strokeWidth = 5,
  color = colors.terracotta,
  track = colors.line,
  showLabel = true,
}: MatchRingProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const progress = useSharedValue(0);

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progress.value = withTiming(clamped, {
      duration: motion.slow,
      easing: Easing.bezier(...motion.easing),
    });
  }, [clamped, progress]);

  useEffect(() => {
    const start = Date.now();
    const duration = motion.slow;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setDisplay(Math.round(clamped * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circ * (1 - progress.value / 100),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cx} r={r} stroke={track} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle
          cx={cx}
          cy={cx}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </Svg>
      {showLabel && (
        <View style={styles.labelWrap} pointerEvents="none">
          <Text
            numberOfLines={1}
            style={[styles.label, { fontFamily: fonts.display, fontSize: Math.max(10, size * 0.24) }]}
          >
            {display}%
          </Text>
        </View>
      )}
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  labelWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: colors.ink, fontWeight: '700', textAlign: 'center' },
});