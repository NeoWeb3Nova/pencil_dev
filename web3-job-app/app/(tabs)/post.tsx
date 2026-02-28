import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { PostJobContent } from '@/components/post/PostJobContent';
import { colors } from '@/lib/constants';

export default function PostJobScreen() {
  const themedColors = useThemedColors();

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log('Job posted:', data);
    alert('职位发布成功！');
  };

  return (
    <View style={{ flex: 1, backgroundColor: themedColors.background }}>
      <PostJobContent onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({});
