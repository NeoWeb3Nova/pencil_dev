import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { t } from '@/lib/i18n';
import { useAppStore } from '@/store/app-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { register } from '@/lib/api';
import { useRouter } from 'expo-router';

interface RegisterContentProps {
  onRegisterSuccess?: () => void;
}

export function RegisterContent({ onRegisterSuccess }: RegisterContentProps) {
  const colors = useThemedColors();
  const { language } = useAppStore();
  const router = useRouter();

  // 表单状态
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 错误状态
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // 验证函数
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // 验证姓名
    if (!name.trim()) {
      newErrors.name = t('name', language);
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = t('email', language);
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('invalidEmail', language);
    }

    // 验证密码长度
    if (!password) {
      newErrors.password = t('password', language);
    } else if (password.length < 6) {
      newErrors.password = t('passwordTooShort', language);
    }

    // 验证确认密码
    if (!confirmPassword) {
      newErrors.confirmPassword = t('confirmPassword', language);
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch', language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理注册
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        Alert.alert(
          t('registerSuccess', language),
          t('registerDesc', language),
          [
            {
              text: 'OK',
              onPress: () => {
                if (onRegisterSuccess) {
                  onRegisterSuccess();
                } else {
                  router.replace('/');
                }
              },
            },
          ]
        );
      } else {
        // 处理特定错误
        const errorMessage = result.error || t('registerFailed', language);
        if (errorMessage.includes('email') || errorMessage.includes('Email')) {
          setErrors({ ...errors, email: t('emailExists', language) });
        }
        Alert.alert(t('registerFailed', language), errorMessage);
      }
    } catch (error) {
      Alert.alert(t('registerFailed', language), t('networkError', language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>🚀</Text>
        </View>
        <Text style={[styles.title, { color: colors.dark }]}>
          {t('registerTitle', language)}
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          {t('registerDesc', language)}
        </Text>
      </View>

      {/* 表单字段 */}
      <View style={styles.formContainer}>
        {/* 姓名 */}
        <Input
          label={t('name', language)}
          placeholder={t('namePlaceholder', language)}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          error={errors.name}
        />

        {/* 邮箱 */}
        <Input
          label={t('email', language)}
          placeholder={t('emailPlaceholder', language)}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors({ ...errors, email: undefined });
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        {/* 密码 */}
        <Input
          label={t('password', language)}
          placeholder={t('passwordPlaceholder', language)}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors({ ...errors, password: undefined });
            }
            if (confirmPassword && text !== confirmPassword) {
              setErrors({ ...errors, confirmPassword: t('passwordMismatch', language) });
            } else {
              setErrors({ ...errors, confirmPassword: undefined });
            }
          }}
          secureTextEntry
          error={errors.password}
        />

        {/* 确认密码 */}
        <Input
          label={t('confirmPassword', language)}
          placeholder={t('confirmPasswordPlaceholder', language)}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors({ ...errors, confirmPassword: undefined });
            }
            if (text && password !== text) {
              setErrors({ ...errors, confirmPassword: t('passwordMismatch', language) });
            } else {
              setErrors({ ...errors, confirmPassword: undefined });
            }
          }}
          secureTextEntry
          error={errors.confirmPassword}
        />
      </View>

      {/* 注册按钮 */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          size="lg"
          style={styles.registerButton}
        >
          {t('registerButton', language)}
        </Button>
      </View>

      {/* 登录链接 */}
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, { color: colors.secondary }]}>
          {t('hasAccount', language)}{' '}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.loginLink, { color: colors.primary }]}>
            {t('login', language)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  registerButton: {
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
