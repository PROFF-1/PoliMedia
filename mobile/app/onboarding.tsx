import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useProfile } from '@/constants/ProfileContext';
import Colors, { Radius, Spacing, Typography } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AGE_GROUPS = [
  { id: '15-17', label: '15–17', icon: 'school-outline', desc: 'High School' },
  { id: '18-24', label: '18–24', icon: 'book-outline', desc: 'University / Early Career' },
  { id: '25-34', label: '25–34', icon: 'briefcase-outline', desc: 'Young Professional' },
];

const OCCUPATIONS = [
  { id: 'student', label: 'Student', icon: 'library-outline' },
  { id: 'developer', label: 'Developer / Tech', icon: 'code-slash-outline' },
  { id: 'trader', label: 'Trader / Business', icon: 'storefront-outline' },
  { id: 'healthcare', label: 'Healthcare', icon: 'medkit-outline' },
  { id: 'farmer', label: 'Farmer / Agric', icon: 'leaf-outline' },
];

const LOCATIONS = [
  { id: 'urban', label: 'Urban', icon: 'business-outline', desc: 'City / Town' },
  { id: 'rural', label: 'Rural', icon: 'map-outline', desc: 'Village / Countryside' },
];

const STEPS = [
  {
    key: 'ageGroup',
    title: 'How old are you?',
    subtitle: 'This helps us tailor policies that affect your stage of life',
    options: AGE_GROUPS,
  },
  {
    key: 'occupation',
    title: 'What do you do?',
    subtitle: "We'll show how policies impact your work and income",
    options: OCCUPATIONS,
  },
  {
    key: 'location',
    title: 'Where do you live?',
    subtitle: 'Urban and rural communities face different policy effects',
    options: LOCATIONS,
  },
];

export default function OnboardingScreen() {
  const { setProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [profile, setLocalProfile] = useState({
    ageGroup: '',
    occupation: '',
    location: '',
  });

  const currentStep = STEPS[step];

  const handleSelect = (value: string) => {
    const newProfile = { ...profile, [currentStep.key]: value };
    setLocalProfile(newProfile);

    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 350);
    } else {
      setTimeout(() => setProfile(newProfile), 400);
    }
  };

  const handleSkip = () => {
    setProfile({ ageGroup: '18-24', occupation: 'student', location: 'urban' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.logoContainer}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.logoIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoInnerRing}>
              <MaterialCommunityIcons name="bullhorn" size={18} color={Colors.primaryDark} />
            </View>
          </LinearGradient>
          <Text style={styles.logoText}>PoliMedia</Text>
          <Text style={styles.logoSubtext}>
            Policies that matter to <Text style={styles.logoHighlight}>you</Text>
          </Text>
        </Animated.View>

        {/* Progress Bar */}
        <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            {STEPS.map((_, i) => (
              <View key={i} style={styles.progressSegment}>
                <LinearGradient
                  colors={
                    i <= step
                      ? [Colors.primary, Colors.primaryDark]
                      : [Colors.surfaceAlt, Colors.surfaceAlt]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressBar}
                />
              </View>
            ))}
          </View>
          <Text style={styles.progressText}>{step + 1} of {STEPS.length}</Text>
        </Animated.View>

        {/* Question */}
        <Animated.View
          key={step}
          entering={FadeInDown.duration(200)}
          style={styles.questionContainer}
        >
          <Text style={styles.questionTitle}>{currentStep.title}</Text>
          <Text style={styles.questionSubtitle}>{currentStep.subtitle}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentStep.options.map((option, index) => {
              const isSelected = profile[currentStep.key as keyof typeof profile] === option.id;
              return (
                <Animated.View
                  key={option.id}
                  entering={FadeInUp.delay(index * 80).duration(400)}
                >
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelect(option.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionIconWrap}>
                      <Ionicons
                        name={option.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={isSelected ? Colors.primary : Colors.textSecondary}
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      {'desc' in option && (option as any).desc ? (
                        <Text style={styles.optionDesc}>{String((option as any).desc)}</Text>
                      ) : null}
                    </View>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Skip */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip personalization →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoInnerRing: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: Typography.fontFamily,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  logoSubtext: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  logoHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    marginBottom: Spacing.xxxl,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
    borderRadius: Radius.pill,
  },
  progressText: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  questionContainer: {
    width: '100%',
  },
  questionTitle: {
    ...Typography.h1,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.xs,
  },
  questionSubtitle: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionDesc: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: Spacing.xxxl,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.bg,
  },
  skipText: {
    ...Typography.button,
    fontFamily: Typography.fontFamily,
    color: Colors.primary,
  },
});
