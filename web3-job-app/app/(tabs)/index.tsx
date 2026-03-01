import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { HomeContent } from '@/components/home/HomeContent';
import { Job } from '@/types';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemedColors();

  const handleJobPress = (job: Job) => {
    router.push(`/job/${job.id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HomeContent onJobPress={handleJobPress} />
    </View>
  );
}

const styles = StyleSheet.create({});
