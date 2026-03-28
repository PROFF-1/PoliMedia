import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useProfile } from '@/constants/ProfileContext';
import { usePolicies } from '@/constants/PoliciesContext';
import type { PersonalizedPolicy } from '@/constants/policies';
import PolicyCard from '@/components/PolicyCard';
import Colors, { Radius, Spacing, Typography } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'transport', label: 'Transport', icon: 'car-outline' },
  { id: 'finance', label: 'Finance', icon: 'cash-outline' },
  { id: 'education', label: 'Education', icon: 'book-outline' },
  { id: 'housing', label: 'Housing', icon: 'home-outline' },
  { id: 'health', label: 'Health', icon: 'medkit-outline' },
  { id: 'technology', label: 'Tech', icon: 'hardware-chip-outline' },
];

export default function FeedScreen() {
  const { profile } = useProfile();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { policies, loading, refreshPolicies } = usePolicies();
  const [refreshing, setRefreshing] = useState(false);

  const filteredPolicies = useMemo(() => {
    if (activeFilter === 'all') return policies;
    return policies.filter((p) => p.category === activeFilter);
  }, [policies, activeFilter]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPolicies();
    setRefreshing(false);
  };

  const handlePolicyPress = (policy: PersonalizedPolicy) => {
    router.push({
      pathname: '/policy/[id]',
      params: { id: policy.id.toString() },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerIconInner}>
                <MaterialCommunityIcons name="bullhorn" size={16} color={Colors.primaryDark} />
              </View>
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>PoliMedia</Text>
              <Text style={styles.headerMeta}>Policy intelligence brief</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.profileBadge}
          >
            <Ionicons name="person-circle-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.profileBadgeText}>{profile?.occupation}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          {getGreeting()}, here is your curated impact feed
        </Text>
      </Animated.View>

      {/* Category Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {CATEGORY_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setActiveFilter(filter.id)}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={filter.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={activeFilter === filter.id ? Colors.white : Colors.primary}
              />
              <Text
                style={[
                  styles.filterLabel,
                  activeFilter === filter.id && styles.filterLabelActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.emptyState}>
            <Ionicons name="sync-outline" size={56} color={Colors.primary} />
            <Text style={styles.emptyText}>Loading latest policies...</Text>
          </View>
        ) : filteredPolicies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="mail-open-outline" size={56} color={Colors.primary} />
            <Text style={styles.emptyText}>No policies in this category yet</Text>
          </View>
        ) : (
          filteredPolicies.map((policy, index) => (
            <Animated.View
              key={policy.id}
              entering={FadeInDown.delay(index * 80).duration(200)}
            >
              <PolicyCard
                policy={policy}
                onPress={() => handlePolicyPress(policy)}
              />
            </Animated.View>
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.headerGlass,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerIconInner: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h2,
    fontFamily: Typography.fontFamily,
  },
  headerMeta: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  profileBadgeText: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    textTransform: 'capitalize',
  },
  headerSubtitle: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  filterLabelActive: {
    color: Colors.white,
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    ...Typography.body,
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
  },
});
