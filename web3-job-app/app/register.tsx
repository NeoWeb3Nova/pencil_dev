import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { RegisterContent } from '@/components/profile/RegisterContent';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const colors = useThemedColors();
  const router = useRouter();

  const handleRegisterSuccess = () => {
    // 注册成功后跳转到登录页
    router.push('/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RegisterContent onRegisterSuccess={handleRegisterSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({});
