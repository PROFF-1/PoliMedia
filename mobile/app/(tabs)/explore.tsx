import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useProfile } from '@/constants/ProfileContext';
import { getPersonalizedPolicies, type PersonalizedPolicy } from '@/constants/policies';
import PolicyCard from '@/components/PolicyCard';
import Colors, { Radius, Spacing, Typography } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const { profile } = useProfile();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const policies = useMemo(() => {
    if (!profile) return [];
    return getPersonalizedPolicies(profile.occupation, profile.location);
  }, [profile]);

  const filteredPolicies = useMemo(() => {
    if (!searchQuery.trim()) return policies;
    const q = searchQuery.toLowerCase();
    return policies.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [policies, searchQuery]);

  const handlePolicyPress = (policy: PersonalizedPolicy) => {
    router.push({
      pathname: '/policy/[id]',
      params: { id: policy.id.toString() },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Policies</Text>
        <Text style={styles.headerSubtitle}>Search and discover policy updates</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search policies..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={16} color={Colors.textSecondary} style={styles.clearButton} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultCount}>
          {filteredPolicies.length} {filteredPolicies.length === 1 ? 'policy' : 'policies'} found
        </Text>
        {filteredPolicies.map((policy, index) => (
          <Animated.View
            key={policy.id}
            entering={FadeInDown.delay(index * 80).duration(400)}
          >
            <PolicyCard
              policy={policy}
              onPress={() => handlePolicyPress(policy)}
            />
          </Animated.View>
        ))}
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.headerGlass,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h1,
    fontFamily: Typography.fontFamily,
  },
  headerSubtitle: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: 14,
    paddingVertical: Spacing.md,
    borderRadius: Radius.input,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    fontFamily: Typography.fontFamily,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  resultCount: {
    ...Typography.caption,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.xs,
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
});
