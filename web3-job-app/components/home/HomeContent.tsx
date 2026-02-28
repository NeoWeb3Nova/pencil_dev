import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { colors, mockJobs } from '@/lib/constants';
import { JobCard } from '@/components/job/JobCard';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

interface HomeContentProps {
  onJobPress?: (job: typeof mockJobs[0]) => void;
  onSearch?: (query: string) => void;
}

export function HomeContent({ onJobPress, onSearch }: HomeContentProps) {
  const { language } = useAppStore();
  const themedColors = useThemedColors();
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    { id: 'all', label: t('categoryAll', language) },
    { id: 'solidity', label: t('categorySolidity', language) },
    { id: 'frontend', label: t('categoryFrontend', language) },
    { id: 'defi', label: t('categoryDeFi', language) },
  ];
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: themedColors.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner */}
      <View
        style={{
          backgroundColor: colors.primary,
          margin: 16,
          padding: 24,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: colors.white,
            marginBottom: 4,
          }}
        >
          {t('heroTitle', language)}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.primaryLight,
          }}
        >
          {t('heroSubtitle', language)}
        </Text>
      </View>

      {/* Search Section */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: themedColors.dark,
            marginBottom: 8,
          }}
        >
          {t('searchLabel', language)}
        </Text>
        <Input
          placeholder={t('searchPlaceholder', language)}
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={null}
        />
      </View>

      {/* Category Pills */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 16,
          marginBottom: 20,
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
                    ? themedColors.dark
                    : themedColors.gray100,
                paddingHorizontal: 16,
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
      </View>

      {/* Recommended Jobs */}
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: themedColors.dark,
            }}
          >
            {t('recommendedJobs', language)}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: themedColors.primary,
            }}
          >
            {t('viewAll', language)}
          </Text>
        </View>
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} onPress={() => onJobPress?.(job)} />
        ))}
      </View>
    </ScrollView>
  );
}
