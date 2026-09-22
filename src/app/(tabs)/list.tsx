import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../components/TopBar';
import { ReceiptLine } from '../../components/Receipt';
import { PrimaryButton } from '../../components/Buttons';
import { EmptyState } from '../../components/Labels';
import { Entrance } from '../../components/motion';
import DecorBackground from '../../components/Decor';
import { useGrocery } from '../../context/GroceryContext';
import { Category } from '../../data/grocery';
import { colors, fonts, spacing } from '../../theme';

export default function ListScreen() {
  const { lines, toggleCheck, clearChecked } = useGrocery();
  const categories: Category[] = ['Produce', 'Protein', 'Pantry'];
  const checkedCount = lines.filter((l) => l.checked).length;
  const pct = lines.length ? Math.round((checkedCount / lines.length) * 100) : 0;

  return (
    <View style={styles.safe}>
      <DecorBackground />
      <SafeAreaView edges={['top']} style={styles.safe}>
      <TopBar
        title="Grocery List"
        subtitle={
          lines.length === 0
            ? 'Nothing on the list yet'
            : `${lines.length} item${lines.length === 1 ? '' : 's'} to shop`
        }
      />
      {lines.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="Your list is ready when you are"
            hint="Generate a grocery list from your weekly plan, or add missing ingredients from any recipe."
          />
        </View>
      ) : (
        <>
          <Entrance index={0} style={styles.progressWrap}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                {checkedCount} of {lines.length} found
              </Text>
              <Text style={styles.progressPct}>{pct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
          </Entrance>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((cat) => {
              const items = lines.filter((l) => l.category === cat);
              if (items.length === 0) return null;
              return (
                <View key={cat}>
                  <Text style={styles.cat}>{cat.toUpperCase()}</Text>
                  {items.map((l, i) => (
                    <Entrance key={l.id} index={i} distance={10}>
                      <ReceiptLine line={l} onToggle={() => toggleCheck(l.id)} />
                    </Entrance>
                  ))}
                </View>
              );
            })}
            <Text style={styles.hint}>Tap a line to tick it off as you shop.</Text>
          </ScrollView>
        </>
      )}
      {lines.length > 0 && (
        <View style={styles.cta}>
          <PrimaryButton title="Done Shopping" onPress={clearChecked} />
        </View>
      )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  emptyWrap: { flex: 1, justifyContent: 'center' },
  progressWrap: { paddingHorizontal: spacing.xl, marginTop: spacing.sm },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: colors.inkSoft },
  progressPct: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.sage },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.sageSoft,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: colors.sage },
  cat: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 10.5,
    letterSpacing: 0.12,
    color: colors.terracotta,
    marginTop: spacing.lg,
    marginBottom: 4,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});