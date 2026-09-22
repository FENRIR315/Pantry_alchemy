import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PackageOpen } from 'lucide-react-native';
import TopBar from '../../components/TopBar';
import { Chip, SuggestionPill, SearchBar } from '../../components/Chip';
import ScanCard from '../../components/ScanCard';
import { SectionLabel, CountBadge, EmptyState } from '../../components/Labels';
import { PrimaryButton } from '../../components/Buttons';
import { Entrance } from '../../components/motion';
import DecorBackground from '../../components/Decor';
import AddItemSheet from '../../components/AddItemSheet';
import { usePantry, SUGGESTIONS } from '../../context/PantryContext';
import { normalize } from '../../utils/matching';
import { colors, spacing } from '../../theme';

export default function PantryScreen() {
  const router = useRouter();
  const { items, details, addItem, removeItem } = usePantry();
  const [query, setQuery] = useState('');
  const [sheet, setSheet] = useState<{ name: string } | null>(null);
  const [sheetId, setSheetId] = useState(0);

  const submit = (text: string) => {
    if (!text.trim()) return;
    openSheet(text.trim());
    setQuery('');
  };

  const openSheet = (name: string) => {
    setSheet({ name });
    setSheetId((n) => n + 1);
  };

  const detailFor = (item: string): string | undefined => {
    const d = details[normalize(item)];
    if (!d) return undefined;
    const parts: string[] = [];
    if (d.qty != null && d.weight == null) {
      parts.push(`${d.qty}${d.unit ? ` ${d.unit}` : ''}`);
    }
    if (d.weight != null) {
      parts.push(`${d.weight}${d.unit ? ` ${d.unit}` : ''}`);
    }
    return parts.length ? parts.join(' · ') : undefined;
  };

  return (
    <View style={styles.safe}>
      <DecorBackground />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <TopBar title="My Pantry" subtitle="Good evening — here's what you've got" />
        <View style={styles.body}>
        <SearchBar
          placeholder="Add an ingredient…"
          value={query}
          onChangeText={setQuery}
          onSubmit={submit}
        />
        <Entrance index={0}>
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <SuggestionPill key={s} label={s} onPress={() => openSheet(s)} />
            ))}
          </View>
        </Entrance>

        <Entrance index={1}>
          <ScanCard onPress={() => router.push('/scan')} />
        </Entrance>

        {items.length === 0 ? (
          <EmptyState
            title="Your pantry is empty"
            hint="Add ingredients or snap a photo of your haul."
            icon={<PackageOpen size={34} color={colors.inkFaint} strokeWidth={1.7} />}
          />
        ) : (
          <>
            <SectionLabel right={<CountBadge count={items.length} />}>
              In your pantry
            </SectionLabel>
            <View style={styles.grid}>
              {items.map((item, i) => (
                <Entrance key={item} index={i + 2} distance={10}>
                  <Chip label={item} detail={detailFor(item)} onRemove={() => removeItem(item)} />
                </Entrance>
              ))}
            </View>
          </>
        )}
      </View>
      <Entrance index={4} style={styles.cta}>
        <PrimaryButton title="See Matching Recipes" onPress={() => router.push('/(tabs)/recipes')} />
      </Entrance>
      </SafeAreaView>
      <AddItemSheet
        key={sheetId}
        visible={sheet !== null}
        initialName={sheet?.name}
        onClose={() => setSheet(null)}
        onSave={(name, meta) => addItem(name, meta)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});