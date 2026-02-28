import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { PostJobContent } from '@/components/post/PostJobContent';
import { colors } from '@/lib/constants';
import { isLoggedIn } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';

export default function PostJobScreen() {
  const themedColors = useThemedColors();
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = () => {
      const loggedIn = isLoggedIn();
      setIsAuthenticated(loggedIn);
      setIsCheckingAuth(false);

      if (!loggedIn) {
        Alert.alert(
          '需要登录',
          '请先登录以发布职位',
          [
            {
              text: '取消',
              style: 'cancel',
              onPress: () => router.back(),
            },
            {
              text: '去登录',
              onPress: () => router.push('/profile'),
            },
          ]
        );
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log('Job data:', data);
    // API 调用已在 PostJobContent 组件中处理
  };

  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themedColors.background }}>
        <Text style={{ color: themedColors.dark }}>检查登录状态...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themedColors.background }}>
        <Text style={{ color: themedColors.dark, marginBottom: 16 }}>请先登录以发布职位</Text>
        <Button onPress={() => router.push('/profile')} size="lg">
          去登录
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: themedColors.background }}>
      <PostJobContent onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({});
