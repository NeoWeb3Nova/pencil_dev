import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { JobCard } from '@/components/job/JobCard';
import { useThemedColors } from '@/lib/useThemedColors';
import { colors } from '@/lib/constants';
import { Job } from '@/types';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '@/lib/api';

// Format date helper - moved outside component to avoid hoisting issues
const formatDate = (dateString: string, language: 'zh' | 'en'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('today', language);
  if (diffDays === 1) return t('yesterday', language);
  if (diffDays < 7) return `${diffDays}${t('daysAgo', language)}`;
  return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US');
};

export default function JobsScreen() {
  const { language } = useAppStore();
  const themedColors = useThemedColors();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = React.useState('all');

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

  // Use React Query to fetch jobs from real API
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', selectedCategory],
    queryFn: async () => {
      const response = await getJobs(1, 20);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch jobs');
      }
      return response.data || [];
    },
    select: (data) => {
      // Map API response to frontend Job type
      return data.map((job: any) => ({
        ...job,
        type: (job.type || 'full-time') as 'full-time' | 'contract' | 'part-time',
        salary: job.salaryMin && job.salaryMax
          ? `$${(job.salaryMin / 1000).toFixed(0)}-${(job.salaryMax / 1000).toFixed(0)}K/年`
          : '面议',
        postedAt: job.createdAt
          ? formatDate(job.createdAt, language)
          : t('unknown', language),
      }));
    },
  });

  // Filter jobs by category
  const filterJobsByCategory = (jobs: Job[]) => {
    if (selectedCategory === 'all') return jobs;

    const categoryKeywords: Record<string, string[]> = {
      solidity: ['solidity', 'smart contract', 'ethereum'],
      frontend: ['frontend', 'react', 'web3', 'ui'],
      backend: ['backend', 'go', 'rust', 'node'],
      defi: ['defi', 'protocol', 'liquidity'],
      nft: ['nft', 'marketplace', 'collectible'],
    };

    const keywords = categoryKeywords[selectedCategory] || [];
    return jobs.filter(
      (job) =>
        keywords.some((keyword) =>
          job.title.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword) ||
          job.skills.some((skill) => skill.toLowerCase().includes(keyword))
        )
    );
  };

  const filteredJobs = data ? filterJobsByCategory(data) : [];

  return (
    <View style={{ flex: 1, backgroundColor: themedColors.background }}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          maxHeight: 60,
          borderBottomWidth: 1,
          borderBottomColor: themedColors.border,
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              {
                backgroundColor:
                  selectedCategory === category.id
                    ? themedColors.primary
                    : themedColors.gray100,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
              },
            ]}
          >
            <Text
              style={[
                {
                  fontSize: 14,
                  fontWeight: '600',
                  color:
                    selectedCategory === category.id
                      ? colors.white
                      : themedColors.secondary,
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Job List */}
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
            <ActivityIndicator size="large" color={themedColors.primary} />
            <Text style={{ marginTop: 16, color: themedColors.secondary, fontSize: 14 }}>
              {t('loading', language) || 'Loading jobs...'}
            </Text>
          </View>
        )}

        {error && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              {t('error', language) || 'Error'}
            </Text>
            <Text style={{ color: themedColors.secondary, fontSize: 14, textAlign: 'center' }}>
              {(error as Error).message}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={{
                marginTop: 16,
                paddingHorizontal: 24,
                paddingVertical: 10,
                backgroundColor: themedColors.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.white, fontWeight: '600' }}>
                {t('retry', language) || 'Retry'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !error && filteredJobs.length === 0 && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: themedColors.secondary, fontSize: 14 }}>
              {t('noJobs', language) || 'No jobs available'}
            </Text>
          </View>
        )}

        {!isLoading && !error && filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} onPress={() => handleJobPress(job)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
