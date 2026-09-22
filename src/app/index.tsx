import React from 'react';
import { StyleSheet, Text, View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { UtensilsCrossed } from 'lucide-react-native';
import { colors, fonts, radii } from '../theme';
import { PrimaryButton } from '../components/Buttons';
import { Entrance } from '../components/motion';
import DecorBackground from '../components/Decor';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <DecorBackground />
      <View style={styles.wrap}>
        <Entrance>
          <View style={styles.logo}>
            <LinearGradient
              colors={colors.gradientTerracotta}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoInner}
            >
              <UtensilsCrossed size={30} color="#fff" strokeWidth={1.9} />
            </LinearGradient>
          </View>
        </Entrance>
        <Entrance index={1}>
          <Text style={styles.title}>Pantry Alchemy</Text>
          <Text style={styles.tagline}>Cook with what you&apos;ve got.</Text>
        </Entrance>

        <Entrance index={2}>
          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputText}>you@dorm.edu</Text>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputText}>••••••••</Text>
              </View>
            </View>
          </View>
        </Entrance>

        <Entrance index={3} style={styles.cta}>
          <PrimaryButton title="Log In" onPress={() => router.replace('/(tabs)/pantry')} />
        </Entrance>

        <Entrance index={4}>
          <Pressable style={styles.switch} onPress={() => {}} hitSlop={8}>
            <Text style={styles.switchText}>
              New here? <Text style={styles.switchLink}>Create an account</Text>
            </Text>
          </Pressable>
        </Entrance>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.ink,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: 32,
  },
  fields: { marginTop: 4 },
  fieldGroup: { marginBottom: 14 },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12.5,
    color: colors.inkSoft,
    marginBottom: 6,
  },
  inputWrap: {
    borderWidth: 1.6,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  inputText: { fontFamily: fonts.body, fontSize: 14.5, color: colors.ink },
  cta: { marginTop: 8 },
  switch: { marginTop: 18 },
  switchText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  switchLink: { color: colors.terracotta, fontFamily: fonts.bodySemiBold },
});