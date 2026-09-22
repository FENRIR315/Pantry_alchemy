import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, Image, Zap, ZapOff } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme';
import PressScale from '../components/motion';

type CameraRef = { takePictureAsync: (opts?: { quality?: number }) => Promise<{ uri: string }> | null };

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [torch, setTorch] = useState(false);
  const camRef = useRef<CameraRef | null>(null);

  const goScanning = (uri: string) => {
    router.push({ pathname: '/scanning', params: { uri } });
  };

  const capture = async () => {
    if (busy || !camRef.current) return;
    setBusy(true);
    try {
      const result = await camRef.current.takePictureAsync({ quality: 0.82 });
      if (result?.uri) goScanning(result.uri);
    } catch {
      Alert.alert('Capture failed', 'Please try again or upload a photo from your gallery.');
    } finally {
      setBusy(false);
    }
  };

  const pickGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access in your device settings.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.82,
    });
    if (!res.canceled && res.assets[0]?.uri) goScanning(res.assets[0].uri);
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.deniedWrap}>
        <StatusBar style="dark" />
        <View style={[styles.deniedRow, { paddingTop: insets.top + 16 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={18} color={colors.ink} strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.deniedTitle}>Camera Access</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.deniedBody}>
          <Text style={styles.deniedMsg}>
            Pantry Alchemy needs camera access to scan ingredients automatically.
          </Text>
          <PressScale onPress={requestPermission} haptic="light" contentStyle={styles.permBtn}>
            <Text style={styles.permBtnText}>Allow Camera Access</Text>
          </PressScale>
          <Pressable onPress={pickGallery} hitSlop={8}>
            <Text style={styles.deniedGhost}>Upload from gallery instead</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView
        ref={(r) => { camRef.current = r as CameraRef; }}
        style={styles.camera}
        facing="back"
        enableTorch={torch}
      />
      <View style={styles.overlay}>
        <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={18} color={colors.ink} strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.topTitle}>Scan Ingredients</Text>
          <Pressable
            onPress={() => setTorch((t) => !t)}
            style={[styles.torchBtn, torch && styles.torchOn]}
            hitSlop={8}
          >
            {torch ? (
              <Zap size={17} color={colors.terracotta} strokeWidth={2.2} fill={colors.terracotta} />
            ) : (
              <ZapOff size={17} color={colors.ink} strokeWidth={2.2} />
            )}
          </Pressable>
        </View>

        <View style={styles.middle}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.hintText}>Point your camera at your fridge, pantry shelf, or grocery haul</Text>
        </View>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 28 }]}>
          <PressScale onPress={capture} disabled={busy} haptic="medium" contentStyle={[styles.shutter, busy && styles.shutterBusy]} />
          <Pressable style={styles.uploadBtn} onPress={pickGallery} hitSlop={8}>
            <Image size={15} color={colors.inkSoft} strokeWidth={2} />
            <Text style={styles.uploadText}>Upload from gallery instead</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkViewfinder },
  centered: { flex: 1, backgroundColor: colors.darkViewfinder, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.inkFaint, fontFamily: 'WorkSans_500Medium', fontSize: 14 },

  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  topTitle: { fontFamily: 'Fredoka_600SemiBold', fontSize: 20, color: '#fff' },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchOn: { backgroundColor: colors.goldTint },

  middle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: '74%',
    aspectRatio: 1,
    position: 'relative',
  },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: colors.terracottaSoft },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 10 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 10 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 10 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 10 },
  hintText: {
    color: '#EAD9C4',
    fontFamily: 'WorkSans_500Medium',
    fontSize: 13.5,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: 22,
    paddingHorizontal: 40,
  },

  controls: {
    alignItems: 'center',
    gap: 16,
  },
  shutter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: colors.terracotta,
  },
  shutterBusy: { opacity: 0.75 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  uploadText: { fontFamily: 'WorkSans_500Medium', fontSize: 13.5, color: colors.inkSoft },

  deniedWrap: { flex: 1, backgroundColor: colors.cream },
  deniedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  deniedBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 22 },
  deniedTitle: { fontFamily: 'Fredoka_600SemiBold', fontSize: 20, color: colors.ink },
  deniedMsg: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
    lineHeight: 20,
  },
  permBtn: {
    backgroundColor: colors.terracotta,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  permBtnText: { color: '#fff', fontFamily: 'WorkSans_600SemiBold', fontSize: 14.5 },
  deniedGhost: {
    fontFamily: 'WorkSans_600SemiBold',
    fontSize: 14,
    color: colors.terracotta,
    textAlign: 'center',
  },
});