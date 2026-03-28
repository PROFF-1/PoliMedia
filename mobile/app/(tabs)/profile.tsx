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
import Colors from '@/constants/Colors';

const OCCUPATION_LABELS: Record<string, string> = {
  student: '📚 Student',
  developer: '💻 Developer / Tech',
  trader: '🏪 Trader / Business',
  healthcare: '🏥 Healthcare',
  farmer: '🌾 Farmer / Agric',
};

const AGE_LABELS: Record<string, string> = {
  '15-17': '🎒 15–17 (High School)',
  '18-24': '🎓 18–24 (University / Early Career)',
  '25-34': '💼 25–34 (Young Professional)',
};

const LOCATION_LABELS: Record<string, string> = {
  urban: '🏙️ Urban',
  rural: '🌿 Rural',
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
            colors={['rgba(59,130,246,0.08)', 'rgba(139,92,246,0.08)']}
            style={styles.profileCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[Colors.accentBlue, Colors.accentPurple]}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>
                  {profile.occupation === 'student'
                    ? '🎓'
                    : profile.occupation === 'developer'
                    ? '💻'
                    : profile.occupation === 'trader'
                    ? '🏪'
                    : profile.occupation === 'healthcare'
                    ? '🏥'
                    : '🌾'}
                </Text>
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
          <Text style={styles.infoEmoji}>🧠</Text>
          <Text style={styles.infoText}>
            CivicPulse uses your profile to show how each policy specifically
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
            <Text style={styles.resetButtonText}>🔄 Change My Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Version */}
        <Text style={styles.version}>CivicPulse v1.0.0 — Hackathon MVP</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.civic900,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: Colors.civic500,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
  },
  profileFields: {
    gap: 16,
  },
  fieldContainer: {
    gap: 3,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.civic500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.glassWhite,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 24,
  },
  infoEmoji: {
    fontSize: 20,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: Colors.civic400,
    fontSize: 13,
    lineHeight: 19,
  },
  resetButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.accentRed,
    fontSize: 14,
    fontWeight: '600',
  },
  version: {
    color: Colors.civic600,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
});
