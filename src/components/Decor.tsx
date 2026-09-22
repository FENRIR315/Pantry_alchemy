import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';

const { width: W, height: H } = Dimensions.get('window');

interface DecorBackgroundProps {
  warm?: boolean;
  sage?: boolean;
}

/**
 * Soft overlapping color blobs for login and empty states.
 * Rendered behind content; pointerEvents disabled.
 */
export default function DecorBackground({ warm = true, sage = false }: DecorBackgroundProps) {
  const blobs = warm
    ? [
        { cx: -60, cy: 110, r: 190, fill: colors.terracotta, o: 0.06 },
        { cx: W + 30, cy: 300, r: 230, fill: colors.gold, o: 0.09 },
        { cx: 140, cy: H + 40, r: 170, fill: colors.terracottaSoft, o: 0.16 },
      ]
    : sage
      ? [
          { cx: -70, cy: 120, r: 200, fill: colors.sage, o: 0.07 },
          { cx: W + 40, cy: 280, r: 210, fill: colors.gold, o: 0.08 },
          { cx: 120, cy: H + 30, r: 180, fill: colors.sageSoft, o: 0.18 },
        ]
      : [
          { cx: -60, cy: 110, r: 190, fill: colors.terracotta, o: 0.06 },
          { cx: W + 30, cy: 300, r: 230, fill: colors.gold, o: 0.09 },
          { cx: 140, cy: H + 40, r: 170, fill: colors.terracottaSoft, o: 0.16 },
        ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        {blobs.map((b, i) => (
          <Circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity={b.o} />
        ))}
      </Svg>
    </View>
  );
}

export const decorStyles = StyleSheet.create({
  screen: { flex: 1 },
});