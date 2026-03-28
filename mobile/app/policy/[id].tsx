import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useProfile } from '@/constants/ProfileContext';
import { getPersonalizedPolicies } from '@/constants/policies';
import Colors from '@/constants/Colors';

const TAG_COLORS: Record<string, { icon: string; color: string }> = {
  up: { icon: '↑', color: '#ef4444' },
  down: { icon: '↓', color: '#10b981' },
  neutral: { icon: '→', color: '#f59e0b' },
};

export default function PolicyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useProfile();
  const router = useRouter();

  const policy = useMemo(() => {
    if (!profile) return null;
    const policies = getPersonalizedPolicies(profile.occupation, profile.location);
    return policies.find((p) => p.id.toString() === id) || null;
  }, [id, profile]);

  if (!policy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>❌</Text>
          <Text style={styles.errorText}>Policy not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(policy.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Handle bar */}
      <View style={styles.handleBar}>
        <View style={styles.handle} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Close */}
        <Animated.View entering={FadeIn.duration(300)}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.title}>{policy.title}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <Text style={styles.metaDate}>📅 {formattedDate}</Text>
            <Text style={styles.metaDot}>•</Text>
            <TouchableOpacity onPress={() => Linking.openURL(policy.source)}>
              <Text style={styles.metaSource}>🔗 {policy.sourceName}</Text>
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <Text style={styles.summary}>{policy.summary}</Text>
        </Animated.View>

        {/* Personal Impact */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.impactCard}
        >
          <Text style={styles.sectionTitle}>👤 How this affects you</Text>
          <Text style={styles.impactText}>{policy.personalImpact}</Text>
          {policy.locationImpact ? (
            <View style={styles.locationDivider}>
              <Text style={styles.locationText}>📍 {policy.locationImpact}</Text>
            </View>
          ) : null}
        </Animated.View>

        {/* Tags */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.tagsContainer}
        >
          {policy.tags.map((tag, i) => {
            const dir = TAG_COLORS[tag.direction] || TAG_COLORS.neutral;
            return (
              <View
                key={i}
                style={[styles.tag, { backgroundColor: `${dir.color}18` }]}
              >
                <Text style={[styles.tagText, { color: dir.color }]}>
                  {tag.label} {dir.icon}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Deep Explanation */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.deepDiveCard}
        >
          <Text style={styles.sectionTitle}>🔍 Deep Dive</Text>
          <Text style={styles.deepDiveText}>{policy.deepExplanation}</Text>
        </Animated.View>

        {/* AI Section (placeholder — hook up to /api/explain when API is ready) */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.aiCard}
        >
          <Text style={styles.aiTitle}>🤖 AI Explanation</Text>
          <TouchableOpacity style={styles.aiButton} activeOpacity={0.8}>
            <Text style={styles.aiButtonText}>
              ✨ Explain this to me like I'm{' '}
              {profile?.ageGroup === '15-17'
                ? 'in high school'
                : `a ${profile?.occupation}`}
            </Text>
          </TouchableOpacity>
          <Text style={styles.aiNote}>
            AI explanations will be available when connected to the server
          </Text>
        </Animated.View>

        {/* Source link */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <TouchableOpacity
            onPress={() => Linking.openURL(policy.source)}
            style={styles.sourceButton}
          >
            <Text style={styles.sourceButtonText}>
              🌐 View Original Source
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.civic800,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.civic600,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    padding: 4,
  },
  closeText: {
    color: Colors.civic500,
    fontSize: 13,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 32,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  metaDate: {
    fontSize: 12,
    color: Colors.civic400,
  },
  metaDot: {
    fontSize: 12,
    color: Colors.civic500,
  },
  metaSource: {
    fontSize: 12,
    color: Colors.accentBlue,
  },
  summary: {
    fontSize: 14,
    color: Colors.civic300,
    lineHeight: 21,
    marginBottom: 18,
  },
  impactCard: {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentBlue,
    marginBottom: 8,
  },
  impactText: {
    fontSize: 14,
    color: Colors.civic200,
    lineHeight: 21,
  },
  locationDivider: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,130,246,0.1)',
  },
  locationText: {
    fontSize: 13,
    color: Colors.civic300,
    lineHeight: 19,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deepDiveCard: {
    backgroundColor: Colors.glassWhite,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  deepDiveText: {
    fontSize: 14,
    color: Colors.civic300,
    lineHeight: 22,
  },
  aiCard: {
    backgroundColor: 'rgba(139,92,246,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.12)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentPurple,
    marginBottom: 10,
  },
  aiButton: {
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  aiButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accentPurple,
  },
  aiNote: {
    fontSize: 11,
    color: Colors.civic500,
    textAlign: 'center',
    marginTop: 8,
  },
  sourceButton: {
    backgroundColor: Colors.glassWhite,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  sourceButtonText: {
    color: Colors.civic300,
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: Colors.civic400,
    fontSize: 16,
    marginBottom: 16,
  },
  backLink: {
    color: Colors.accentBlue,
    fontSize: 14,
  },
});
