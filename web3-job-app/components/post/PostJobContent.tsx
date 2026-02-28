import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

interface PostJobContentProps {
  onSubmit?: (data: Record<string, unknown>) => void;
}

export function PostJobContent({ onSubmit }: PostJobContentProps) {
  const { language } = useAppStore();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
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

        <View style={styles.salaryRow}>
          <View style={styles.salaryInput}>
            <Input
              label={t('salaryMinLabel', language)}
              placeholder={t('salaryMinPlaceholder', language)}
              value={formData.salaryMin}
              onChangeText={(text) => setFormData({ ...formData, salaryMin: text })}
            />
          </View>
          <View style={styles.salaryInput}>
            <Input
              label={t('salaryMaxLabel', language)}
              placeholder={t('salaryMaxPlaceholder', language)}
              value={formData.salaryMax}
              onChangeText={(text) => setFormData({ ...formData, salaryMax: text })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('jobTypeLabel', language)}</Text>
          <View style={styles.jobTypes}>
            {jobTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setFormData({ ...formData, jobType: type.id })}
                style={[
                  styles.jobTypePill,
                  formData.jobType === type.id && styles.jobTypePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.jobTypeText,
                    formData.jobType === type.id && styles.jobTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('skillsLabel', language)}</Text>
          <View style={styles.skills}>
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
                  styles.skillTag,
                  formData.skills.includes(skill) && styles.skillTagActive,
                ]}
              >
                <Text
                  style={[
                    styles.skillText,
                    formData.skills.includes(skill) && styles.skillTextActive,
                  ]}
                >
                  {skill} {formData.skills.includes(skill) ? '✓' : '+'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button onPress={handleSubmit} size="lg" style={styles.submitButton}>
          {t('submitJob', language)}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 16,
  },
  salaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  salaryInput: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  jobTypes: {
    flexDirection: 'row',
    gap: 8,
  },
  jobTypePill: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  jobTypePillActive: {
    backgroundColor: colors.primary,
  },
  jobTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  jobTypeTextActive: {
    color: colors.white,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skillTagActive: {
    backgroundColor: colors.primary,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary,
  },
  skillTextActive: {
    color: colors.white,
  },
  submitButton: {
    marginTop: 8,
  },
});
