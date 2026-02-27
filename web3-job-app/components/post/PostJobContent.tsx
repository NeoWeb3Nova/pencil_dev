import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PostJobContentProps {
  onSubmit?: (data: Record<string, unknown>) => void;
}

export function PostJobContent({ onSubmit }: PostJobContentProps) {
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
    { id: 'full-time', label: '全职' },
    { id: 'contract', label: '合同' },
    { id: 'part-time', label: '兼职' },
  ];

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Input
          label="职位名称"
          placeholder="高级 Solidity 工程师"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <Input
          label="公司名称"
          placeholder="以太坊基金会"
          value={formData.company}
          onChangeText={(text) => setFormData({ ...formData, company: text })}
        />

        <Input
          label="工作地点"
          placeholder="远程 / 上海"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <View style={styles.salaryRow}>
          <View style={styles.salaryInput}>
            <Input
              label="最低薪资"
              placeholder="$80K"
              value={formData.salaryMin}
              onChangeText={(text) => setFormData({ ...formData, salaryMin: text })}
            />
          </View>
          <View style={styles.salaryInput}>
            <Input
              label="最高薪资"
              placeholder="$180K"
              value={formData.salaryMax}
              onChangeText={(text) => setFormData({ ...formData, salaryMax: text })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>工作类型</Text>
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
          <Text style={styles.sectionLabel}>要求技能</Text>
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
          发布职位 - ¥299
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
