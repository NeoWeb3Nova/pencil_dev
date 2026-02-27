import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PostJobContent } from '@/components/post/PostJobContent';
import { colors } from '@/lib/constants';

export default function PostJobScreen() {
  const handleSubmit = (data: Record<string, unknown>) => {
    console.log('Job posted:', data);
    alert('职位发布成功！');
  };

  return (
    <View style={styles.container}>
      <PostJobContent onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
