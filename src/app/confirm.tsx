import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Plus, Check, Pencil } from 'lucide-react-native';
import TopBar from '../components/TopBar';
import { PrimaryButton } from '../components/Buttons';
import PressScale, { BouncingCheck, Entrance } from '../components/motion';
import DecorBackground from '../components/Decor';
import AddItemSheet from '../components/AddItemSheet';
import { usePantry } from '../context/PantryContext';
import { mapModelClass } from '../data/ingredientMap';
import { colors, fonts, spacing } from '../theme';
import type { PantryMeta } from '../context/PantryContext';

interface Detection { name: string; confidence: number }

function pct(confidence: number): string {
  const c = Math.round(confidence * 100);
  return `${c}%`;
}

function qtyLabel(meta: PantryMeta | undefined): string | null {
  if (!meta) return null;
  const parts: string[] = [];
  if (meta.qty != null && meta.weight == null) {
    parts.push(`${meta.qty}${meta.unit ? ` ${meta.unit}` : ''}`);
  }
  if (meta.weight != null) {
    parts.push(`${meta.weight}${meta.unit ? ` ${meta.unit}` : ''}`);
  }
  return parts.length ? parts.join(' · ') : null;
}

export default function ConfirmScreen() {
  const { uri, results } = useLocalSearchParams<{ uri: string; results: string }>();
  const router = useRouter();
  const { addItem } = usePantry();
  const [extras, setExtras] = useState<string[]>([]);
  const [metaMap, setMetaMap] = useState<Record<string, PantryMeta>>({});
  const [sheet, setSheet] = useState<{ name: string; lockName: boolean; id: number } | null>(null);

  const detections: Detection[] = useMemo(() => {
    try {
      return results ? (JSON.parse(results) as Detection[]) : [];
    } catch {
      return [];
    }
  }, [results]);

  const names = useMemo(() => detections.map((d) => mapModelClass(d.name)), [detections]);

  const all = useMemo(() => [...names, ...extras], [names, extras]);
  const [checked, setChecked] = useState<boolean[]>(() => all.map(() => true));

  const setQty = (name: string) =>
    setSheet((prev) => ({ name, lockName: true, id: (prev?.id ?? 0) + 1 }));

  const addMissed = () => setSheet((prev) => ({ name: '', lockName: false, id: (prev?.id ?? 0) + 1 }));

  const handleSheetSave = (name: string, meta: PantryMeta) => {
    if (sheet?.lockName) {
      setMetaMap((prev) => ({ ...prev, [name]: meta }));
    } else if (name) {
      if (!extras.includes(name)) {
        setExtras((prev) => [...prev, name]);
        setChecked((prev) => [...prev, true]);
      }
      if (meta.qty != null || meta.unit) {
        setMetaMap((prev) => ({ ...prev, [name]: meta }));
      }
    }
    setSheet(null);
  };

  const toggle = (index: number) =>
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));

  const selectedCount = checked.filter(Boolean).length;
  const confirmAdd = () => {
    const selected = all.filter((_, i) => checked[i] ?? false);
    for (const name of selected) addItem(name, metaMap[name] ?? {});
    router.replace('/(tabs)/pantry');
  };

  const confidenceFor = (index: number): string => {
    if (index < detections.length) return pct(detections[index].confidence);
    return '';
  };

  return (
    <View style={styles.wrap}>
      <DecorBackground />
      <SafeAreaView edges={['top']} style={styles.wrap}>
      <TopBar title="Confirm Ingredients" showBack backTo="/scan" />
      <Text style={styles.subtitle}>Uncheck anything we got wrong, and set amounts</Text>

      <Entrance index={0} style={styles.thumb}>
        {uri ? (
          <Image source={{ uri }} style={styles.thumbImg} contentFit="cover" transition={200} />
        ) : (
          <Text style={styles.thumbText}>Scanned image</Text>
        )}
      </Entrance>

      <View style={styles.scroll}>
        {all.map((name, i) => {
          const conf = confidenceFor(i);
          const metaLabel = qtyLabel(metaMap[name]);
          return (
            <Entrance key={`${name}-${i}`} index={i + 1} distance={10}>
              <PressScale onPress={() => toggle(i)} haptic="selection" contentStyle={styles.row}>
                <BouncingCheck checked={checked[i] ?? true} size={24} />
                <View style={styles.nameWrap}>
                  <Text style={styles.name} numberOfLines={2}>
                    {name}
                    {(conf || metaLabel) ? (
                      <Text style={styles.note}>
                        {'  ·  '}
                        {metaLabel ? `${metaLabel} · ` : ''}
                        {conf ? `${conf} sure` : ''}
                      </Text>
                    ) : null}
                  </Text>
                </View>
                <PressScale
                  onPress={() => setQty(name)}
                  haptic="light"
                  contentStyle={[styles.qtyBtn, metaLabel && styles.qtyBtnOn]}
                >
                  <Pencil size={13} color={metaLabel ? colors.cream : colors.inkSoft} strokeWidth={2.2} />
                </PressScale>
              </PressScale>
            </Entrance>
          );
        })}

        <Pressable style={styles.addMissed} onPress={addMissed}>
          <Plus size={18} color={colors.terracotta} strokeWidth={2.2} />
          <Text style={styles.addMissedText}>Add something we missed</Text>
        </Pressable>
      </View>

      <View style={styles.cta}>
        <PrimaryButton
          title={`Add ${selectedCount} to Pantry`}
          onPress={confirmAdd}
          icon={<Check size={16} color="#fff" strokeWidth={2.4} />}
          disabled={selectedCount === 0}
        />
      </View>
      </SafeAreaView>

      <AddItemSheet
        key={sheet?.id ?? 0}
        visible={sheet !== null}
        initialName={sheet?.name ?? ''}
        lockName={sheet?.lockName ?? false}
        onClose={() => setSheet(null)}
        onSave={handleSheetSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.inkSoft,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  thumb: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    height: 120,
    borderRadius: 18,
    backgroundColor: colors.creamDeep,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.inkFaint },
  scroll: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 4, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  nameWrap: { flex: 1 },
  name: { fontFamily: fonts.bodyMedium, fontSize: 14.5, color: colors.ink },
  note: { fontFamily: fonts.body, fontSize: 12.5, color: colors.inkFaint },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.creamDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnOn: { backgroundColor: colors.terracotta },
  addMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  addMissedText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.terracotta },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});