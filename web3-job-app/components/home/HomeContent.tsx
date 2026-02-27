import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, mockJobs } from '@/lib/constants';
import { JobCard } from '@/components/job/JobCard';
import { Input } from '@/components/ui/Input';

interface HomeContentProps {
  onJobPress?: (job: typeof mockJobs[0]) => void;
  onSearch?: (query: string) => void;
}

export function HomeContent({ onJobPress, onSearch }: HomeContentProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    { id: 'all', label: '全部职位' },
    { id: 'solidity', label: '智能合约' },
    { id: 'frontend', label: '前端' },
    { id: 'defi', label: 'DeFi' },
  ];
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>🚀 加入 Ethereum Foundation</Text>
        <Text style={styles.heroSubtitle}>构建去中心化的未来</Text>
      </View>

      {/* Search Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>搜索</Text>
        <Input
          placeholder="Web3、智能合约..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={null}
        />
      </View>

      {/* Category Pills */}
      <View style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryPill,
              selectedCategory === category.id && styles.categoryPillActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommended Jobs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>推荐职位</Text>
          <Text style={styles.viewAll}>查看全部</Text>
        </View>
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} onPress={() => onJobPress?.(job)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 24,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  viewAll: {
    fontSize: 14,
    color: colors.primary,
  },
  categories: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryPill: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColor: colors.dark,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
});
