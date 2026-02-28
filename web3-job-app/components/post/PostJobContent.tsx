import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';
import { postJob } from '@/lib/api';
import { router } from 'expo-router';

interface PostJobContentProps {
  onSubmit?: (data: Record<string, unknown>) => void;
}

interface FormErrors {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  salary?: string;
}

export function PostJobContent({ onSubmit }: PostJobContentProps) {
  const { language } = useAppStore();
  const colors = useThemedColors();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [formData, setFormData] = React.useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    skills: [] as string[],
    description: '',
  });

  const jobTypes = [
    { id: 'full-time', label: t('jobTypeFullTime', language) },
    { id: 'contract', label: t('jobTypeContract', language) },
    { id: 'part-time', label: t('jobTypePartTime', language) },
  ];

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证职位名称
    if (!formData.title.trim()) {
      newErrors.title = '职位名称不能为空';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = '职位名称至少 3 个字符';
    }

    // 验证公司名称
    if (!formData.company.trim()) {
      newErrors.company = '公司名称不能为空';
    } else if (formData.company.trim().length < 2) {
      newErrors.company = '公司名称至少 2 个字符';
    }

    // 验证工作地点
    if (!formData.location.trim()) {
      newErrors.location = '工作地点不能为空';
    }

    // 验证薪资范围
    if (formData.salaryMin && formData.salaryMax) {
      const min = parseFloat(formData.salaryMin.replace(/[^0-9.]/g, ''));
      const max = parseFloat(formData.salaryMax.replace(/[^0-9.]/g, ''));
      if (!isNaN(min) && !isNaN(max) && min > max) {
        newErrors.salary = '最低薪资不能高于最高薪资';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('验证失败', '请修正表单中的错误');
      return;
    }

    setIsLoading(true);

    try {
      // 解析薪资金额为数字
      const salaryMin = formData.salaryMin
        ? parseFloat(formData.salaryMin.replace(/[^0-9.]/g, ''))
        : undefined;
      const salaryMax = formData.salaryMax
        ? parseFloat(formData.salaryMax.replace(/[^0-9.]/g, ''))
        : undefined;

      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salaryMin: isNaN(salaryMin!) ? undefined : salaryMin,
        salaryMax: isNaN(salaryMax!) ? undefined : salaryMax,
        description: formData.description || `Join ${formData.company} as a ${formData.title}. We are looking for a talented ${formData.title} to join our team.`,
        skills: formData.skills.length > 0 ? formData.skills : undefined,
        type: formData.jobType as 'full-time' | 'contract' | 'part-time',
      };

      const result = await postJob(jobData);

      if (result.success) {
        Alert.alert(
          '发布成功',
          '您的职位已成功发布！',
          [
            {
              text: '查看职位',
              onPress: () => router.push('/jobs'),
            },
          ]
        );
        // 重置表单
        setFormData({
          title: '',
          company: '',
          location: '',
          salaryMin: '',
          salaryMax: '',
          jobType: 'full-time',
          skills: [],
          description: '',
        });
        setErrors({});
      } else {
        Alert.alert('发布失败', result.error || '发布职位时出错，请稍后重试');
      }
    } catch (error) {
      Alert.alert('错误', '网络错误，请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }

    // 同时调用外部 onSubmit 回调
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
          onChangeText={(text) => {
            setFormData({ ...formData, title: text });
            if (errors.title) {
              setErrors({ ...errors, title: undefined });
            }
          }}
          error={errors.title}
        />

        <Input
          label={t('companyLabel', language)}
          placeholder={t('companyPlaceholder', language)}
          value={formData.company}
          onChangeText={(text) => {
            setFormData({ ...formData, company: text });
            if (errors.company) {
              setErrors({ ...errors, company: undefined });
            }
          }}
          error={errors.company}
        />

        <Input
          label={t('locationLabel', language)}
          placeholder={t('locationPlaceholder', language)}
          value={formData.location}
          onChangeText={(text) => {
            setFormData({ ...formData, location: text });
            if (errors.location) {
              setErrors({ ...errors, location: undefined });
            }
          }}
          error={errors.location}
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
              keyboardType="numeric"
              onChangeText={(text) => {
                setFormData({ ...formData, salaryMin: text });
                if (errors.salary) {
                  setErrors({ ...errors, salary: undefined });
                }
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label={t('salaryMaxLabel', language)}
              placeholder={t('salaryMaxPlaceholder', language)}
              value={formData.salaryMax}
              keyboardType="numeric"
              onChangeText={(text) => {
                setFormData({ ...formData, salaryMax: text });
                if (errors.salary) {
                  setErrors({ ...errors, salary: undefined });
                }
              }}
            />
          </View>
        </View>
        {errors.salary && (
          <Text style={{ color: colors.error, fontSize: 12, marginTop: 4, marginBottom: 12 }}>
            {errors.salary}
          </Text>
        )}

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

        <Button
          onPress={handleSubmit}
          size="lg"
          style={{ marginTop: 8 }}
          disabled={isLoading}
        >
          {isLoading ? '发布中...' : t('submitJob', language)}
        </Button>
      </View>
    </ScrollView>
  );
}
