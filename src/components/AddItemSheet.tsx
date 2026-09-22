import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Keyboard,
} from 'react-native';
import { X, Minus, Plus, ChevronDown } from 'lucide-react-native';
import { colors, fonts, radii, shadows, spacing } from '../theme';
import { PrimaryButton, GhostButton } from './Buttons';
import type { PantryMeta } from '../context/PantryContext';

export const UNITS = [
  'kg',
  'g',
  'L',
  'ml',
  'pcs',
  'bunch',
  'can',
  'pack',
  'head',
  'clove',
  'tbsp',
  'tsp',
  'cup',
  'bottle',
  'sack',
  'bag',
];

const STEP = 1;

interface AddItemSheetProps {
  visible: boolean;
  initialName?: string;
  lockName?: boolean;
  onClose: () => void;
  onSave: (name: string, meta: PantryMeta) => void;
}

function sanitizeQty(text: string): string {
  return text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}

function formatQty(value: number): string {
  if (!Number.isFinite(value)) return '';
  return String(Math.round(value * 100) / 100);
}

export default function AddItemSheet({
  visible,
  initialName = '',
  lockName = false,
  onClose,
  onSave,
}: AddItemSheetProps) {
  const [name, setName] = useState(initialName);
  const [qty, setQty] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<string | null>(null);
  const [unitOpen, setUnitOpen] = useState(false);

  const parsedQty = qty.trim() ? parseFloat(qty) : NaN;
  const parsedWeight = weight.trim() ? parseFloat(weight) : NaN;
  const validQty = qty.trim() === '' || (!isNaN(parsedQty) && parsedQty > 0);
  const validWeight = weight.trim() === '' || (!isNaN(parsedWeight) && parsedWeight > 0);
  const canSave = name.trim().length > 0 && validQty && validWeight;
  const current = qty.trim() === '' ? 0 : parsedQty;

  const step = (delta: number) => {
    const next = Math.max(0, (Number.isFinite(current) ? current : 0) + delta);
    setQty(formatQty(Math.round(next * 100) / 100));
  };

  const save = () => {
    if (!canSave) return;
    const meta: PantryMeta = {};
    if (qty.trim()) meta.qty = Math.round(parsedQty * 100) / 100;
    if (weight.trim()) meta.weight = Math.round(parsedWeight * 100) / 100;
    if (unit) meta.unit = unit;
    onSave(name.trim(), meta);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>{lockName ? 'Set Quantity' : 'Add an Ingredient'}</Text>
              <Text style={styles.subtitle}>
                {lockName ? 'How much do you have?' : "Quantities and weight are optional"}
              </Text>
            </View>
            <Pressable hitSlop={10} onPress={onClose} style={styles.close}>
              <X size={16} color={colors.inkSoft} strokeWidth={2.4} />
            </Pressable>
          </View>

          {lockName ? (
            <View style={styles.nameLocked}>
              <Text style={styles.nameLockedText} numberOfLines={2}>
                {name}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.label}>Ingredient</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Chicken thigh"
                placeholderTextColor={colors.inkFaint}
              />
            </>
          )}

          <Text style={styles.label}>Quantity</Text>
          <View style={styles.stepper}>
            <Pressable
              style={[styles.stepBtn, current <= 0 && styles.stepBtnOff]}
              onPress={() => step(-STEP)}
              disabled={current <= 0}
              hitSlop={6}
            >
              <Minus size={18} color={current <= 0 ? colors.inkFaint : colors.terracotta} strokeWidth={2.4} />
            </Pressable>
            <TextInput
              style={[styles.input, styles.qtyInput]}
              value={qty}
              onChangeText={(t) => setQty(sanitizeQty(t))}
              placeholder="0"
              placeholderTextColor={colors.inkFaint}
              keyboardType="decimal-pad"
              returnKeyType="done"
              textAlign="center"
              selectTextOnFocus
            />
            <Pressable style={styles.stepBtn} onPress={() => step(STEP)} hitSlop={6}>
              <Plus size={18} color={colors.terracotta} strokeWidth={2.4} />
            </Pressable>
          </View>

          <Text style={styles.label}>Weight & Unit — optional</Text>
          <View style={styles.weightRow}>
            <TextInput
              style={[styles.input, styles.weightInput]}
              value={weight}
              onChangeText={(t) => setWeight(sanitizeQty(t))}
              placeholder="0"
              placeholderTextColor={colors.inkFaint}
              keyboardType="decimal-pad"
              returnKeyType="done"
              textAlign="center"
              selectTextOnFocus
            />

            <View style={styles.unitWrap}>
              <Pressable
                style={styles.unitField}
                onPress={() => {
                  Keyboard.dismiss();
                  setUnitOpen((o) => !o);
                }}
              >
                <Text style={unit ? styles.unitText : styles.unitPlaceholder} numberOfLines={1}>
                  {unit ?? 'Unit'}
                </Text>
                <ChevronDown
                  size={15}
                  color={colors.inkFaint}
                  strokeWidth={2.4}
                  style={unitOpen ? styles.chevronUp : undefined}
                />
              </Pressable>
            </View>

            {unitOpen && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                  {UNITS.map((u) => (
                    <Pressable
                      key={u}
                      style={[styles.dropdownRow, unit === u && styles.dropdownRowOn]}
                      onPress={() => {
                        setUnit(u);
                        setUnitOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownRowText, unit === u && styles.dropdownRowTextOn]}>
                        {u}
                      </Text>
                      {unit === u ? <View style={styles.dropdownDot} /> : null}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <PrimaryButton title="Save to Pantry" onPress={save} disabled={!canSave} style={styles.save} />
          <GhostButton title="Cancel" onPress={onClose} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43, 38, 28, 0.45)',
  },
  card: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: 10,
    paddingBottom: spacing.lg + 8,
    zIndex: 30,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.line,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWrap: { flex: 1 },
  title: { fontFamily: fonts.bodyBold, fontSize: 21, color: colors.ink },
  subtitle: { fontFamily: fonts.body, fontSize: 13.5, color: colors.inkSoft, marginTop: 2 },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.creamDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.cream,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  nameLocked: {
    backgroundColor: colors.creamDeep,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 2,
  },
  nameLockedText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.ink },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.6,
    borderColor: colors.terracotta,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnOff: { borderColor: colors.line, backgroundColor: colors.creamDeep },
  qtyInput: { flex: 1, minWidth: 0 },
  weightRow: { flexDirection: 'row', alignItems: 'center', gap: 12, position: 'relative' },
  weightInput: { flex: 1, minWidth: 0 },
  unitWrap: { width: 118 },
  unitField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cream,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    height: 46,
  },
  unitText: { fontFamily: fonts.body, fontSize: 14.5, color: colors.ink },
  unitPlaceholder: { fontFamily: fonts.body, fontSize: 14.5, color: colors.inkFaint },
  chevronUp: { transform: [{ rotate: '180deg' }] },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    overflow: 'hidden',
    zIndex: 10,
    ...shadows.card,
  },
  dropdownScroll: { maxHeight: 240 },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDeep,
  },
  dropdownRowOn: { backgroundColor: colors.terracottaTint },
  dropdownRowText: { fontFamily: fonts.body, fontSize: 14.5, color: colors.ink },
  dropdownRowTextOn: { fontFamily: fonts.bodySemiBold, color: colors.terracottaDeep },
  dropdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.terracotta,
  },
  save: { marginTop: spacing.lg, marginBottom: 8 },
});