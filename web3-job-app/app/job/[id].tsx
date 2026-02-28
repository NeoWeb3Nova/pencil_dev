import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { JobDetail } from '@/components/job/JobDetail';
import { mockJobs } from '@/lib/constants';

// 简单路由参数模拟
const mockJobId = '1';

export default function JobDetailScreen() {
  const colors = useThemedColors();
  const job = mockJobs.find((j) => j.id === mockJobId) || mockJobs[0];

  const handleApply = () => {
    alert('申请成功！');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <JobDetail job={job} onApply={handleApply} />
    </View>
  );
}

const styles = StyleSheet.create({});
