import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeContent } from '@/components/home/HomeContent';
import { Job } from '@/types';
import { colors } from '@/lib/constants';

export default function HomeScreen() {
  const router = useRouter();

  const handleJobPress = (job: Job) => {
    router.push(`/job/${job.id}`);
  };

  return (
    <View style={styles.container}>
      <HomeContent onJobPress={handleJobPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
