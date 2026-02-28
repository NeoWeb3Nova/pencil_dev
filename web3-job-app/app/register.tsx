import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useThemedColors } from '@/lib/useThemedColors';
import { t } from '@/lib/i18n';
import type { RegisterRequest } from '@/types';

export default function RegisterScreen() {
  const colors = useThemedColors();
  const { register, isLoading } = useAuthStore();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  // 表单状态
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterRequest & { confirmPassword: string }>>({});

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterRequest & { confirmPassword: string }> = {};

    // 验证姓名
    if (!name.trim()) {
      newErrors.name = language === 'zh' ? '姓名不能为空' : t('name', language) + ' is required';
    } else if (name.trim().length < 2) {
      newErrors.name = t('nameTooShort', language);
    }

    // 验证邮箱
    if (!email.trim()) {
      newErrors.email = language === 'zh' ? '邮箱不能为空' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email';
    }

    // 验证密码
    if (!password) {
      newErrors.password = language === 'zh' ? '密码不能为空' : 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = t('passwordTooShort', language);
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = t('passwordStrength', language);
    }

    // 验证确认密码
    if (!confirmPassword) {
      newErrors.confirmPassword = language === 'zh' ? '请确认密码' : 'Please confirm your password';
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

    const result = await register({ email, password, name });

    if (result.success) {
      Alert.alert(
        t('registerSuccess', language),
        language === 'zh' ? '欢迎加入 Web3 Job App!' : 'Welcome to Web3 Job App!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(t('registerFailed', language), result.error || t('registerError', language));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>📝</Text>
          </View>
          <Text style={[styles.title, { color: colors.dark }]}>
            {t('registerTitle', language)}
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            {language === 'zh' ? '创建账号以开始使用' : 'Create an account to get started'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.dark }]}>
              {t('name', language)}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.name ? colors.danger : colors.gray300,
                  color: colors.dark,
                },
              ]}
              placeholder={t('namePlaceholder', language)}
              placeholderTextColor={colors.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.name && (
              <Text style={[styles.errorText, { color: colors.danger }]}>{errors.name}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.dark }]}>
              {t('email', language)}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.email ? colors.danger : colors.gray300,
                  color: colors.dark,
                },
              ]}
              placeholder={t('emailPlaceholder', language)}
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={[styles.errorText, { color: colors.danger }]}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.dark }]}>
              {t('password', language)}
            </Text>
            <View
              style={[
                styles.passwordContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.password ? colors.danger : colors.gray300,
                },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: colors.dark }]}
                placeholder={t('passwordPlaceholder', language)}
                placeholderTextColor={colors.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                <Text style={[styles.toggleButtonText, { color: colors.secondary }]}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={[styles.errorText, { color: colors.danger }]}>{errors.password}</Text>
            )}
            <Text style={[styles.hintText, { color: colors.secondary }]}>
              {t('passwordStrength', language)}
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.dark }]}>
              {t('confirmPassword', language)}
            </Text>
            <View
              style={[
                styles.passwordContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.confirmPassword ? colors.danger : colors.gray300,
                },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: colors.dark }]}
                placeholder={t('confirmPasswordPlaceholder', language)}
                placeholderTextColor={colors.secondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.toggleButton}
              >
                <Text style={[styles.toggleButtonText, { color: colors.secondary }]}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={[styles.errorText, { color: colors.danger }]}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              {
                backgroundColor: isLoading ? colors.gray300 : colors.primary,
              },
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>{t('createAccount', language)}</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.secondary }]}>
              {t('hasAccount', language)}{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                {t('toLogin', language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
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
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  toggleButton: {
    padding: 4,
  },
  toggleButtonText: {
    fontSize: 18,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
