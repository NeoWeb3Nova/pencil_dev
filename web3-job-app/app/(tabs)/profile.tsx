import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { LoginContent } from '@/components/profile/LoginContent';
import { LanguageSelector } from '@/components/profile/LanguageSelector';
import { mockProfile } from '@/lib/constants';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const colors = useThemedColors();
  const { isLoggedIn, initializeAuth, user } = useAuthStore();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth().then(() => setIsInitialized(true));
  }, []);

  const handleMenuItemPress = (item: string) => {
    if (item === 'language') {
      setShowLanguageSelector(true);
    } else if (item === 'resume') {
      router.push('/resume' as any);
    } else {
      console.log('Menu item pressed:', item);
    }
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.dark }}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!isLoggedIn ? (
        <LoginContent onLoginPress={() => router.push('/login')} />
      ) : (
        <ProfileContent profile={{ ...mockProfile, name: user?.name || mockProfile.name, email: user?.email || mockProfile.email }} onMenuItemPress={handleMenuItemPress} />
      )}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
