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
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

const AGE_GROUPS = [
  { id: '15-17', label: '15–17', emoji: '🎒', desc: 'High School' },
  { id: '18-24', label: '18–24', emoji: '🎓', desc: 'University / Early Career' },
  { id: '25-34', label: '25–34', emoji: '💼', desc: 'Young Professional' },
];

const OCCUPATIONS = [
  { id: 'student', label: 'Student', emoji: '📚' },
  { id: 'developer', label: 'Developer / Tech', emoji: '💻' },
  { id: 'trader', label: 'Trader / Business', emoji: '🏪' },
  { id: 'healthcare', label: 'Healthcare', emoji: '🏥' },
  { id: 'farmer', label: 'Farmer / Agric', emoji: '🌾' },
];

const LOCATIONS = [
  { id: 'urban', label: 'Urban', emoji: '🏙️', desc: 'City / Town' },
  { id: 'rural', label: 'Rural', emoji: '🌿', desc: 'Village / Countryside' },
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
            colors={[Colors.accentBlue, Colors.accentPurple]}
            style={styles.logoIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoEmoji}>⚡</Text>
          </LinearGradient>
          <Text style={styles.logoText}>CivicPulse</Text>
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
                      ? [Colors.accentBlue, Colors.accentPurple]
                      : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.08)']
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
          entering={FadeInDown.duration(400).springify()}
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
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      {'desc' in option && option.desc ? (
                        <Text style={styles.optionDesc}>{option.desc}</Text>
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
    backgroundColor: Colors.civic900,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: 14,
    color: Colors.civic400,
    marginTop: 4,
  },
  logoHighlight: {
    color: Colors.white,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
    borderRadius: 2,
  },
  progressText: {
    color: Colors.civic500,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },
  questionContainer: {
    width: '100%',
  },
  questionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
  },
  questionSubtitle: {
    fontSize: 14,
    color: Colors.civic400,
    marginBottom: 20,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glassWhite,
    gap: 14,
  },
  optionButtonSelected: {
    borderColor: 'rgba(59, 130, 246, 0.4)',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  optionEmoji: {
    fontSize: 26,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.civic400,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 32,
    padding: 12,
  },
  skipText: {
    color: Colors.civic500,
    fontSize: 13,
  },
});
