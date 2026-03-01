import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { LanguageSelector } from '@/components/profile/LanguageSelector';
import { useAuthStore } from '@/store/authStore';
import { LoginContent } from '@/components/profile/LoginContent';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const colors = useThemedColors();
  const { isLoggedIn, initializeAuth, isLoading, logout } = useAuthStore();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化认证状态
  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsInitialized(true);
    };
    init();
  }, []);

  const handleMenuItemPress = (item: string) => {
    if (item === 'language') {
      setShowLanguageSelector(true);
    } else if (item === 'logout') {
      Alert.alert(
        '确认登出',
        '确定要登出吗？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '登出',
            style: 'destructive',
            onPress: async () => {
              await logout();
            },
          },
        ]
      );
    } else {
      // 其他菜单项
      console.log('Menu item pressed:', item);
    }
  };

  const handleLoginPress = () => {
    // 传递 returnUrl，登录成功后返回 profile 页面
    router.push('/login?returnUrl=/profile');
  };

  // 显示加载状态
  if (!isInitialized || isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <View style={{ fontSize: 40 }}>⏳</View>
        </View>
      </View>
    );
  }

  // 未登录时显示登录引导
  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoginContent onLoginPress={handleLoginPress} />
        <LanguageSelector
          visible={showLanguageSelector}
          onClose={() => setShowLanguageSelector(false)}
        />
      </View>
    );
  }

  // 已登录时显示用户资料
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProfileContent onMenuItemPress={handleMenuItemPress} />
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
