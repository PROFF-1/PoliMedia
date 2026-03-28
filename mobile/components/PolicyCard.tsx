import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors, { Radius, Spacing, Typography } from '@/constants/Colors';
import { type PersonalizedPolicy } from '@/constants/policies';
import { Ionicons } from '@expo/vector-icons';

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  transport: { bg: Colors.warning + '20', border: Colors.border, text: Colors.textPrimary, icon: 'car-outline' },
  finance: { bg: Colors.success + '20', border: Colors.border, text: Colors.textPrimary, icon: 'cash-outline' },
  education: { bg: Colors.primaryLight, border: Colors.border, text: Colors.primary, icon: 'book-outline' },
  housing: { bg: Colors.surfaceAlt, border: Colors.border, text: Colors.textPrimary, icon: 'home-outline' },
  health: { bg: Colors.error + '20', border: Colors.border, text: Colors.textPrimary, icon: 'medkit-outline' },
  technology: { bg: Colors.primaryLight, border: Colors.border, text: Colors.primary, icon: 'hardware-chip-outline' },
};

const TAG_COLORS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  up: { icon: 'arrow-up', color: Colors.error },
  down: { icon: 'arrow-down', color: Colors.success },
  neutral: { icon: 'remove', color: Colors.warning },
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
          <Ionicons name={category.icon} size={12} color={category.text} />
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
          <Ionicons name="person-outline" size={14} color={Colors.primary} style={styles.impactIcon} />
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
                <View style={styles.tagRow}>
                  <Text style={[styles.tagText, { color: dir.color }]}>{tag.label}</Text>
                  <Ionicons name={dir.icon} size={12} color={dir.color} />
                </View>
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
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
    padding: Spacing.lg,
    marginBottom: 2,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  categoryText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
  },
  title: {
    ...Typography.h2,
    fontFamily: Typography.fontFamily,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  summary: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  impactBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  impactIcon: {
    marginTop: 1,
  },
  impactContent: {
    flex: 1,
  },
  impactLabel: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 3,
  },
  impactText: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
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
    borderRadius: Radius.pill,
  },
  tagText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMore: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    color: Colors.textLink,
    marginLeft: 8,
  },
});
