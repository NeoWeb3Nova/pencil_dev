import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { JobCard } from '@/components/job/JobCard';
import { colors, mockJobs } from '@/lib/constants';
import { Job } from '@/types';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

export default function JobsScreen() {
  const { language } = useAppStore();
  const router = useRouter();

  const handleJobPress = (job: Job) => {
    router.push(`/job/${job.id}`);
  };

  const categories = [
    { id: 'all', label: t('categoryAll', language) },
    { id: 'solidity', label: t('categorySolidity', language) },
    { id: 'frontend', label: t('categoryFrontend', language) },
    { id: 'backend', label: t('categoryBackend', language) },
    { id: 'defi', label: t('categoryDeFi', language) },
    { id: 'nft', label: t('categoryNFT', language) },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
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
      </ScrollView>

      {/* Job List */}
      <ScrollView style={styles.jobList} showsVerticalScrollIndicator={false}>
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} onPress={() => handleJobPress(job)} />
        ))}
        {mockJobs.map((job) => (
          <JobCard key={`${job.id}-2`} job={job} onPress={() => handleJobPress(job)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoryScroll: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  jobList: {
    flex: 1,
    padding: 16,
  },
});
