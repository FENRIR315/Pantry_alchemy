import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { detectFood, API_BASE_URL } from '../utils/server';
import { colors, fonts, spacing } from '../theme';
import TopBar from '../components/TopBar';
import { GhostButton } from '../components/Buttons';
import { Entrance } from '../components/motion';

const { width } = Dimensions.get('window');

const STAGES = ['Sending photo…', 'Running the detector…', 'Sorting ingredients…'];

function ShimmerBar() {
  const x = useSharedValue(-140);
  useEffect(() => {
    x.value = withRepeat(withTiming(width * 0.8, { duration: 1300, easing: Easing.linear }), -1, false);
  }, [x]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));
  return (
    <View style={styles.shimmerTrack}>
      <Animated.View style={[animatedStyle, styles.shimmerStrip]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGrad}
        />
      </Animated.View>
    </View>
  );
}

export default function ScanningScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (uri) {
      stageTimer.current = setInterval(() => {
        setStage((s) => Math.min(STAGES.length - 1, s + 1));
      }, 1500);
    }
    return () => {
      if (stageTimer.current) clearInterval(stageTimer.current);
    };
  }, [uri]);

  useEffect(() => {
    if (!uri) return;
    let cancelled = false;

    detectFood({ uri, fileName: 'scan.jpg', mimeType: 'image/jpeg' })
      .then((res) => {
        if (cancelled) return;
        const results = JSON.stringify(res.ingredients);
        router.replace({ pathname: '/confirm', params: { uri, results } });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(
          `Couldn't reach ${API_BASE_URL}.\n\nStart the detector on your PC, then make sure your phone can reach it (same Wi-Fi + firewall).`,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [uri, router]);

  const status = error ?? (!uri ? 'No image provided.' : null);

  return (
    <View style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.wrap}>
        <TopBar title="Scan Ingredients" showBack backTo="/scan" />
        <View style={styles.body}>
          {!status ? (
            <>
              {uri ? (
                <Entrance>
                  <Image source={{ uri }} style={styles.preview} contentFit="cover" transition={250} />
                </Entrance>
              ) : null}
              <View style={styles.statusWrap}>
                <Text style={styles.stage}>{STAGES[stage]}</Text>
                <ShimmerBar />
              </View>
              <Text style={styles.msg}>Give it a beat — your model is on the job</Text>
            </>
          ) : (
            <>
              <Text style={styles.error}>{status}</Text>
              <GhostButton title="Try again" onPress={() => router.replace('/scan')} />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, gap: 18 },
  preview: {
    width: width * 0.62,
    height: width * 0.62,
    borderRadius: 24,
    borderWidth: 1.4,
    borderColor: colors.line,
  },
  statusWrap: { alignSelf: 'stretch', alignItems: 'center', gap: 10 },
  stage: { fontFamily: fonts.display, fontSize: 16, color: colors.ink },
  shimmerTrack: {
    width: '78%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.creamDeep,
    overflow: 'hidden',
  },
  shimmerStrip: { width: 140, height: 8 },
  shimmerGrad: { flex: 1, height: 8 },
  msg: { fontFamily: fonts.body, fontSize: 12.5, color: colors.inkFaint },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.terracotta,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});