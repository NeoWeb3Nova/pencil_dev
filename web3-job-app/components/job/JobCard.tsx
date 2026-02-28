import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Job } from '@/types';
import { useThemedColors } from '@/lib/useThemedColors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface JobCardProps {
  job: Job;
  onPress?: () => void;
}

export function JobCard({ job, onPress }: JobCardProps) {
  const colors = useThemedColors();

  return (
    <Card
      variant="outlined"
      style={{
        marginBottom: 12,
        padding: 16,
      }}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              {job.company.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
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
              {job.company}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Badge variant="primary" size="sm">
                {job.salary}
              </Badge>
              <Badge size="sm">{job.location}</Badge>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 6,
              }}
            >
              {job.skills.slice(0, 3).map((skill) => (
                <View
                  key={skill}
                  style={{
                    backgroundColor: colors.gray100,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.secondary,
                    }}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
