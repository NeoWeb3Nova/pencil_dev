import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

interface PostJobContentProps {
  onSubmit?: (data: Record<string, unknown>) => void;
}

export function PostJobContent({ onSubmit }: PostJobContentProps) {
  const { language } = useAppStore();
  const colors = useThemedColors();
  const [formData, setFormData] = React.useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    skills: [] as string[],
  });

  const jobTypes = [
    { id: 'full-time', label: t('jobTypeFullTime', language) },
    { id: 'contract', label: t('jobTypeContract', language) },
    { id: 'part-time', label: t('jobTypePartTime', language) },
  ];

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: 16 }}>
        <Input
          label={t('jobTitleLabel', language)}
          placeholder={t('jobTitlePlaceholder', language)}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <Input
          label={t('companyLabel', language)}
          placeholder={t('companyPlaceholder', language)}
          value={formData.company}
          onChangeText={(text) => setFormData({ ...formData, company: text })}
        />

        <Input
          label={t('locationLabel', language)}
          placeholder={t('locationPlaceholder', language)}
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Input
              label={t('salaryMinLabel', language)}
              placeholder={t('salaryMinPlaceholder', language)}
              value={formData.salaryMin}
              onChangeText={(text) => setFormData({ ...formData, salaryMin: text })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label={t('salaryMaxLabel', language)}
              placeholder={t('salaryMaxPlaceholder', language)}
              value={formData.salaryMax}
              onChangeText={(text) => setFormData({ ...formData, salaryMax: text })}
            />
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.dark,
              marginBottom: 8,
            }}
          >
            {t('jobTypeLabel', language)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}
          >
            {jobTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setFormData({ ...formData, jobType: type.id })}
                style={[
                  {
                    backgroundColor:
                      formData.jobType === type.id ? colors.primary : colors.gray100,
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
                        formData.jobType === type.id ? colors.white : colors.secondary,
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.dark,
              marginBottom: 8,
            }}
          >
            {t('skillsLabel', language)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {['Solidity', 'Web3.js', 'DeFi'].map((skill) => (
              <TouchableOpacity
                key={skill}
                onPress={() => {
                  const skills = formData.skills.includes(skill)
                    ? formData.skills.filter((s) => s !== skill)
                    : [...formData.skills, skill];
                  setFormData({ ...formData, skills });
                }}
                style={[
                  {
                    backgroundColor:
                      formData.skills.includes(skill) ? colors.primary : colors.gray100,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      fontSize: 14,
                      fontWeight: '500',
                      color:
                        formData.skills.includes(skill) ? colors.white : colors.secondary,
                    },
                  ]}
                >
                  {skill} {formData.skills.includes(skill) ? '✓' : '+'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button onPress={handleSubmit} size="lg" style={{ marginTop: 8 }}>
          {t('submitJob', language)}
        </Button>
      </View>
    </ScrollView>
  );
}
