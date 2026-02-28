import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Job } from '@/types';
import { colors } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

interface JobDetailProps {
  job: Job;
  onApply?: () => void;
}

export function JobDetail({ job, onApply }: JobDetailProps) {
  const { language } = useAppStore();
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onApply?.();
    setIsApplying(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>⬡</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company} • {job.location}</Text>
            <View style={styles.salaryBadge}>
              <Text style={styles.salaryText}>{job.salary}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('jobDescription', language)}</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('jobRequirements', language)}</Text>
          {job.requirements.map((req, index) => (
            <View key={index} style={styles.requirement}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('skillsTags', language)}</Text>
          <View style={styles.skills}>
            {job.skills.map((skill) => (
              <Badge key={skill} variant="default" size="md">
                {skill}
              </Badge>
            ))}
          </View>
        </View>

        <View style={styles.applySection}>
          <Button
            onPress={handleApply}
            loading={isApplying}
            size="lg"
            style={styles.applyButton}
          >
            {t('applyNow', language)}
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    margin: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  salaryBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  salaryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.secondary,
    lineHeight: 22,
  },
  requirement: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  checkmark: {
    color: colors.primary,
    fontWeight: '700',
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: colors.secondary,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  applySection: {
    marginTop: 8,
  },
  applyButton: {
    width: '100%',
  },
});
