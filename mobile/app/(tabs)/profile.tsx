import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useProfile } from '@/constants/ProfileContext';
import Colors, { Radius, Spacing, Typography } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const OCCUPATION_LABELS: Record<string, string> = {
  student: 'Student',
  developer: 'Developer / Tech',
  trader: 'Trader / Business',
  healthcare: 'Healthcare',
  farmer: 'Farmer / Agric',
};

const AGE_LABELS: Record<string, string> = {
  '15-17': '15–17 (High School)',
  '18-24': '18–24 (University / Early Career)',
  '25-34': '25–34 (Young Professional)',
};

const LOCATION_LABELS: Record<string, string> = {
  urban: 'Urban',
  rural: 'Rural',
};

const FIELD_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Age Group': 'calendar-outline',
  Occupation: 'briefcase-outline',
  Location: 'location-outline',
};

const AVATAR_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  student: 'school-outline',
  developer: 'code-slash-outline',
  trader: 'storefront-outline',
  healthcare: 'medkit-outline',
  farmer: 'leaf-outline',
};

export default function ProfileScreen() {
  const { profile, clearProfile } = useProfile();

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'This will take you back to onboarding. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: clearProfile },
      ]
    );
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}>Your Profile</Text>
        <Text style={styles.headerSubtitle}>
          Your feed is personalized based on this
        </Text>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.surface]}
            style={styles.profileCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={AVATAR_ICONS[profile.occupation] || 'person-outline'}
                  size={30}
                  color={Colors.white}
                />
              </LinearGradient>
            </View>

            <View style={styles.profileFields}>
              <ProfileField
                label="Age Group"
                value={AGE_LABELS[profile.ageGroup] || profile.ageGroup}
              />
              <ProfileField
                label="Occupation"
                value={OCCUPATION_LABELS[profile.occupation] || profile.occupation}
              />
              <ProfileField
                label="Location"
                value={LOCATION_LABELS[profile.location] || profile.location}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Info */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.infoCard}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            PoliMedia uses your profile to show how each policy specifically
            affects someone like you. No data leaves your device.
          </Text>
        </Animated.View>

        {/* Reset button */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <TouchableOpacity
            onPress={handleReset}
            style={styles.resetButton}
            activeOpacity={0.7}
          >
            <View style={styles.resetButtonContent}>
              <Ionicons name="refresh-outline" size={16} color={Colors.white} />
              <Text style={styles.resetButtonText}>Change My Profile</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Version */}
        <Text style={styles.version}>PoliMedia v1.0.0 — Hackathon MVP</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  const iconName = FIELD_ICONS[label] || 'ellipse-outline';

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={iconName} size={14} color={Colors.textSecondary} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h1,
    fontFamily: Typography.fontFamily,
  },
  headerSubtitle: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xxl,
  },
  profileCard: {
    borderRadius: Radius.card,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileFields: {
    gap: Spacing.lg,
  },
  fieldContainer: {
    gap: 3,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.card,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
  },
  resetButton: {
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: Radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  resetButtonText: {
    ...Typography.button,
    fontFamily: Typography.fontFamily,
    color: Colors.white,
  },
  version: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: Spacing.xl,
  },
});
