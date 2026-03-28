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
import { getPersonalizedPolicies, type PersonalizedPolicy } from '@/constants/policies';
import PolicyCard from '@/components/PolicyCard';
import Colors from '@/constants/Colors';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All', emoji: '🔥' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'education', label: 'Education', emoji: '📖' },
  { id: 'housing', label: 'Housing', emoji: '🏠' },
  { id: 'health', label: 'Health', emoji: '💊' },
  { id: 'technology', label: 'Tech', emoji: '📱' },
];

export default function FeedScreen() {
  const { profile } = useProfile();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const policies = useMemo(() => {
    if (!profile) return [];
    return getPersonalizedPolicies(profile.occupation, profile.location);
  }, [profile]);

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
              colors={[Colors.accentBlue, Colors.accentPurple]}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={{ fontSize: 14 }}>⚡</Text>
            </LinearGradient>
            <Text style={styles.headerTitle}>PoliMedia</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.profileBadge}
          >
            <Text style={styles.profileBadgeText}>👤 {profile?.occupation}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          {getGreeting()} — here's what affects you today
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
              <Text style={styles.filterEmoji}>{filter.emoji}</Text>
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
            tintColor={Colors.accentBlue}
            colors={[Colors.accentBlue]}
          />
        }
      >
        {filteredPolicies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No policies in this category yet</Text>
          </View>
        ) : (
          filteredPolicies.map((policy, index) => (
            <Animated.View
              key={policy.id}
              entering={FadeInDown.delay(index * 100).duration(500).springify()}
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
    backgroundColor: Colors.civic900,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
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
    gap: 8,
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  profileBadge: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  profileBadgeText: {
    color: Colors.civic400,
    fontSize: 12,
  },
  headerSubtitle: {
    color: Colors.civic500,
    fontSize: 12,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.glassWhite,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    gap: 4,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  filterEmoji: {
    fontSize: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.civic400,
  },
  filterLabelActive: {
    color: Colors.accentBlue,
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.civic400,
    fontSize: 15,
  },
});
