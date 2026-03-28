import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { type PersonalizedPolicy } from '@/constants/policies';

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  transport: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', icon: '🚗' },
  finance: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981', icon: '💰' },
  education: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#3b82f6', icon: '📖' },
  housing: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: '#8b5cf6', icon: '🏠' },
  health: { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)', text: '#ec4899', icon: '💊' },
  technology: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', text: '#06b6d4', icon: '📱' },
};

const TAG_COLORS: Record<string, { icon: string; color: string }> = {
  up: { icon: '↑', color: '#ef4444' },
  down: { icon: '↓', color: '#10b981' },
  neutral: { icon: '→', color: '#f59e0b' },
};

interface PolicyCardProps {
  policy: PersonalizedPolicy;
  onPress: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function PolicyCard({ policy, onPress }: PolicyCardProps) {
  const category = CATEGORY_COLORS[policy.category] || CATEGORY_COLORS.transport;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.85}
    >
      {/* Category + Date */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: category.bg, borderColor: category.border },
          ]}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={[styles.categoryText, { color: category.text }]}>
            {policy.category.charAt(0).toUpperCase() + policy.category.slice(1)}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(policy.date)}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{policy.title}</Text>

      {/* Summary */}
      <Text style={styles.summary}>{policy.summary}</Text>

      {/* Personal Impact */}
      {policy.personalImpact ? (
        <View style={styles.impactBanner}>
          <Text style={styles.impactIcon}>👤</Text>
          <View style={styles.impactContent}>
            <Text style={styles.impactLabel}>How this affects you</Text>
            <Text style={styles.impactText}>{policy.personalImpact}</Text>
          </View>
        </View>
      ) : null}

      {/* Tags + Read More */}
      <View style={styles.bottomRow}>
        <View style={styles.tags}>
          {policy.tags.map((tag, i) => {
            const dir = TAG_COLORS[tag.direction] || TAG_COLORS.neutral;
            return (
              <View
                key={i}
                style={[
                  styles.tag,
                  { backgroundColor: `${dir.color}18` },
                ]}
              >
                <Text style={[styles.tagText, { color: dir.color }]}>
                  {tag.label} {dir.icon}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.readMore}>Read more →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glassWhite,
    padding: 16,
    marginBottom: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 11,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
    color: Colors.civic500,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
    lineHeight: 24,
  },
  summary: {
    fontSize: 13,
    color: Colors.civic400,
    lineHeight: 19,
    marginBottom: 12,
  },
  impactBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(59,130,246,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  impactIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  impactContent: {
    flex: 1,
  },
  impactLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accentBlue,
    marginBottom: 3,
  },
  impactText: {
    fontSize: 13,
    color: Colors.civic300,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  readMore: {
    fontSize: 11,
    color: Colors.civic500,
    marginLeft: 8,
  },
});
