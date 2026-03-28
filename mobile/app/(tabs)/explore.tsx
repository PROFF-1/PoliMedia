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
import Colors from '@/constants/Colors';

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
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search policies..."
          placeholderTextColor={Colors.civic500}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
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
    backgroundColor: Colors.civic900,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.glassWhite,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
  },
  clearButton: {
    color: Colors.civic400,
    fontSize: 16,
    padding: 4,
  },
  resultCount: {
    color: Colors.civic500,
    fontSize: 12,
    marginBottom: 4,
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
