import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors, fonts } from '../theme';
import PressScale from './motion';

export default function ScanCard({ onPress }: { onPress?: () => void }) {
  return (
    <PressScale onPress={onPress} haptic="light" contentStyle={styles.card}>
      <View style={styles.ic}>
        <Camera size={22} color={colors.white} strokeWidth={1.9} />
      </View>
      <View style={styles.txt}>
        <Text style={styles.title}>Snap your fridge or grocery haul</Text>
        <Text style={styles.sub}>We&apos;ll pick out the ingredients for you</Text>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderWidth: 1.8,
    borderStyle: 'dashed',
    borderColor: colors.terracottaSoft,
    borderRadius: 18,
    backgroundColor: colors.terracottaTint,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
gap: 14,
    },
  ic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: { flex: 1 },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.ink, marginBottom: 2 },
  sub: { fontFamily: fonts.body, fontSize: 12.5, color: colors.inkSoft },
});