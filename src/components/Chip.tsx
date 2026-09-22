import React from 'react';
import { StyleSheet, Text, Pressable, TextInput, View, StyleProp, ViewStyle } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { colors, fonts, spacing } from '../theme';
import PressScale from './motion';

export function Chip({
  label,
  detail,
  onRemove,
}: {
  label: string;
  detail?: string;
  onRemove?: () => void;
}) {
  return (
    <PressScale contentStyle={styles.chip} haptic={false}>
      <Text style={styles.chipText}>
        {label}
        {detail ? <Text style={styles.chipDetail}> · {detail}</Text> : null}
      </Text>
      {onRemove && (
        <Pressable style={styles.chipX} onPress={onRemove} hitSlop={6}>
          <X size={10} color={colors.inkSoft} strokeWidth={2.6} />
        </Pressable>
      )}
    </PressScale>
  );
}

export function SuggestionPill({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <PressScale onPress={onPress} haptic="selection" contentStyle={styles.pill}>
      <Text style={styles.pillText}>+ {label}</Text>
    </PressScale>
  );
}

export function FilterPill({
  label,
  active,
  onPress,
  style,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <PressScale onPress={onPress} haptic={false} contentStyle={[styles.filter, active && styles.filterOn, style]}>
      <Text style={[styles.filterText, active && styles.filterTextOn]}>{label}</Text>
    </PressScale>
  );
}

export function SearchBar({
  placeholder,
  onSubmit,
  value,
  onChangeText,
}: {
  placeholder: string;
  onSubmit?: (text: string) => void;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={styles.search}>
      <Search size={18} color={colors.inkFaint} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        returnKeyType="done"
        onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
        value={value}
        onChangeText={onChangeText}
      />
      {value !== undefined && value.length > 0 && (
        <Pressable hitSlop={8} onPress={() => onChangeText?.('')}>
          <X size={15} color={colors.inkFaint} strokeWidth={2.4} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.card,
    borderWidth: 1.4,
    borderColor: colors.line,
    borderRadius: 999,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
  },
  chipText: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.ink },
  chipDetail: { fontFamily: fonts.body, fontSize: 12, color: colors.inkFaint },
  chipX: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.creamDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: colors.sageTint,
    borderWidth: 1,
    borderColor: colors.sageSoft,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pillText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.sage },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14.5,
    color: colors.ink,
    padding: 0,
  },
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  filterOn: { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
  filterText: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: colors.inkSoft },
  filterTextOn: { color: colors.cream },
});