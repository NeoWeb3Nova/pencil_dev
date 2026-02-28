import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Job } from '@/types';
import { useThemedColors } from '@/lib/useThemedColors';
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
  const colors = useThemedColors();
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onApply?.();
    setIsApplying(false);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Card
        style={{
          margin: 16,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <View
            style={[
              {
                width: 64,
                height: 64,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 28,
              }}
            >
              ⬡
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.dark,
                marginBottom: 4,
              }}
            >
              {job.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8,
              }}
            >
              {job.company} • {job.location}
            </Text>
            <View
              style={{
                backgroundColor: colors.primary,
                alignSelf: 'flex-start',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {job.salary}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.dark,
              marginBottom: 12,
            }}
          >
            {t('jobDescription', language)}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.secondary,
              lineHeight: 22,
            }}
          >
            {job.description}
          </Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.dark,
              marginBottom: 12,
            }}
          >
            {t('jobRequirements', language)}
          </Text>
          {job.requirements.map((req, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: '700',
                }}
              >
                ✓
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                {req}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.dark,
              marginBottom: 12,
            }}
          >
            {t('skillsTags', language)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {job.skills.map((skill) => (
              <Badge key={skill} variant="default" size="md">
                {skill}
              </Badge>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 8 }}>
          <Button
            onPress={handleApply}
            loading={isApplying}
            size="lg"
            style={{ width: '100%' }}
          >
            {t('applyNow', language)}
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}
