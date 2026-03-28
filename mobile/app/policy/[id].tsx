import React, { useMemo, useState } from 'react';
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
import { usePolicies } from '@/constants/PoliciesContext';
import Colors, { Radius, Spacing, Typography } from '@/constants/Colors';
import { API_BASE_URL } from '@/constants/API';
import { Ionicons } from '@expo/vector-icons';

const TAG_COLORS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  up: { icon: 'arrow-up', color: Colors.error },
  down: { icon: 'arrow-down', color: Colors.success },
  neutral: { icon: 'remove', color: Colors.warning },
};

export default function PolicyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useProfile();
  const { policies, loading: policiesLoading } = usePolicies();
  const router = useRouter();
  
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [fetchedPolicy, setFetchedPolicy] = useState<PersonalizedPolicy | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const policy = useMemo(() => {
    return policies.find((p) => p.id.toString() === id) || fetchedPolicy;
  }, [id, policies, fetchedPolicy]);

  const loadPolicy = async () => {
    if (!id || policies.find((p) => p.id.toString() === id)) return;
    
    setFetchLoading(true);
    try {
      const url = `${API_BASE_URL}/api/policies/${id}?occupation=${profile?.occupation || ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFetchedPolicy(data);
      }
    } catch (error) {
      console.error('Failed to fetch policy by ID:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  React.useEffect(() => {
    loadPolicy();
  }, [id, profile?.occupation]);

  const fetchAIExplanation = async () => {
    if (aiLoading || !policy) return;
    setAiLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyTitle: policy.title,
          policySummary: policy.summary,
          occupation: profile?.occupation,
          ageGroup: profile?.ageGroup,
          location: profile?.location,
        }),
      });
      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (error) {
      console.error('Failed to fetch AI explanation:', error);
      setAiExplanation("Unable to connect to the AI at the moment. Please try again later!");
    } finally {
      setAiLoading(false);
    }
  };

  if ((policiesLoading || fetchLoading) && !policy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="sync-outline" size={48} color={Colors.primary} style={styles.errorIcon} />
          <Text style={styles.errorText}>Loading policy details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!policy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} style={styles.errorIcon} />
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
            <Ionicons name="close" size={16} color={Colors.textSecondary} />
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.title}>{policy.title}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaDate}>{formattedDate}</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <TouchableOpacity onPress={() => Linking.openURL(policy.source)}>
              <View style={styles.metaItem}>
                <Ionicons name="link-outline" size={12} color={Colors.textLink} />
                <Text style={styles.metaSource}>{policy.sourceName}</Text>
              </View>
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
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={17} color={Colors.textPrimary} />
            <Text style={styles.sectionTitle}>How this affects you</Text>
          </View>
          <Text style={styles.impactText}>{policy.personalImpact}</Text>
          {policy.locationImpact ? (
            <View style={styles.locationDivider}>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.locationText}>{policy.locationImpact}</Text>
              </View>
            </View>
          ) : null}
        </Animated.View>

        {/* Tags */}
        {policy.tags && policy.tags.length > 0 ? (
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
                  <View style={styles.tagRow}>
                    <Text style={[styles.tagText, { color: dir.color }]}>{tag.label}</Text>
                    <Ionicons name={dir.icon} size={12} color={dir.color} />
                  </View>
                </View>
              );
            })}
          </Animated.View>
        ) : null}

        {/* Deep Explanation */}
        {policy.deepExplanation ? (
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.deepDiveCard}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="search-outline" size={17} color={Colors.textPrimary} />
              <Text style={styles.sectionTitle}>Deep Dive</Text>
            </View>
            <Text style={styles.deepDiveText}>{policy.deepExplanation}</Text>
          </Animated.View>
        ) : null}

        {/* AI Section (hooked up to /api/explain) */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.aiCard}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles-outline" size={17} color={Colors.textPrimary} />
            <Text style={styles.aiTitle}>AI Explanation</Text>
          </View>
          {aiExplanation ? (
             <View style={styles.aiResponseContainer}>
                <Text style={styles.aiResponseText}>{aiExplanation}</Text>
                <TouchableOpacity onPress={() => setAiExplanation(null)} style={styles.resetAi}>
                   <View style={styles.clearAiRow}>
                     <Ionicons name="close" size={12} color={Colors.error} />
                     <Text style={styles.resetAiText}>Clear</Text>
                   </View>
                </TouchableOpacity>
             </View>
          ) : (
            <>
              <TouchableOpacity 
                 disabled={aiLoading}
                 onPress={fetchAIExplanation} 
                 style={[styles.aiButton, aiLoading && {opacity: 0.6}]} 
                 activeOpacity={0.8}
              >
                <View style={styles.aiButtonContent}>
                  <Ionicons name="sparkles" size={14} color={Colors.white} />
                  <Text style={styles.aiButtonText}>
                    {aiLoading ? 'Working on it...' : `Explain this to me like I'm ${profile?.ageGroup === '15-17' ? 'in high school' : `a ${profile?.occupation}`}`}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.aiNote}>
                Powered by Alle-AI (Claude Opus)
              </Text>
            </>
          )}
        </Animated.View>

        {/* Source link */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <TouchableOpacity
            onPress={() => Linking.openURL(policy.source)}
            style={styles.sourceButton}
          >
            <View style={styles.sourceButtonContent}>
              <Ionicons name="open-outline" size={14} color={Colors.primary} />
              <Text style={styles.sourceButtonText}>View Original Source</Text>
            </View>
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
    backgroundColor: Colors.bg,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.headerGlass,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.border,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  closeButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  closeText: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
  },
  title: {
    ...Typography.h1,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metaDate: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
  },
  metaDot: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
  },
  metaSource: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    color: Colors.textLink,
    textDecorationLine: 'underline',
  },
  summary: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  impactCard: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionTitle: {
    ...Typography.h2,
    fontFamily: Typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 0,
  },
  impactText: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
  },
  locationDivider: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceAlt,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  locationText: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
  },
  deepDiveCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  deepDiveText: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
  },
  aiCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  aiTitle: {
    ...Typography.h2,
    fontFamily: Typography.fontFamily,
    fontSize: 18,
    marginBottom: 0,
  },
  aiButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  aiButtonText: {
    ...Typography.button,
    fontFamily: Typography.fontFamily,
    color: Colors.white,
  },
  aiButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aiResponseContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aiResponseText: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
  },
  resetAi: {
    marginTop: Spacing.md,
    alignSelf: 'flex-end',
  },
  resetAiText: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    color: Colors.error,
    fontWeight: '600',
  },
  clearAiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiNote: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  sourceButton: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  sourceButtonText: {
    ...Typography.button,
    fontFamily: Typography.fontFamily,
    color: Colors.primary,
  },
  sourceButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  backLink: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textLink,
    textDecorationLine: 'underline',
  },
});
