import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/lib/useThemedColors';
import { useAuthStore } from '@/store/authStore';
import { t } from '@/lib/i18n';

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemedColors();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 验证邮箱格式
  const validateEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('请输入邮箱');
      return false;
    }
    if (!emailRegex.test(text)) {
      setEmailError('请输入有效的邮箱地址');
      return false;
    }
    setEmailError('');
    return true;
  };

  // 验证密码
  const validatePassword = (text: string): boolean => {
    if (!text) {
      setPasswordError('请输入密码');
      return false;
    }
    if (text.length < 6) {
      setPasswordError('密码至少需要 6 位');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // 处理登录
  const handleLogin = async () => {
    clearError();

    // 验证表单
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      // 登录成功，返回上一页或首页
      Alert.alert('登录成功', '欢迎回来！', [
        {
          text: '确定',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert('登录失败', result.error || '登录失败，请检查您的账号密码');
    }
  };

  // 处理邮箱输入变化
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  // 处理密码输入变化
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      validatePassword(text);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo/标题区域 */}
        <View style={[styles.header, { marginTop: 60 }]}>
          <View
            style={[
              styles.logoPlaceholder,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.logoText}>🔐</Text>
          </View>
          <Text style={[styles.title, { color: colors.dark }]}>
            登录 Web3 Job
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            登录以继续访问您的账户
          </Text>
        </View>

        {/* 登录表单 */}
        <View style={styles.form}>
          {/* 邮箱输入框 */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.dark }]}>邮箱</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.white,
                  borderColor: emailError ? colors.danger : colors.gray200,
                  color: colors.dark,
                },
              ]}
              placeholder="请输入邮箱"
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => validateEmail(email)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {emailError ? (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {emailError}
              </Text>
            ) : null}
          </View>

          {/* 密码输入框 */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.dark }]}>密码</Text>
            <View
              style={[
                styles.passwordContainer,
                {
                  backgroundColor: colors.white,
                  borderColor: passwordError ? colors.danger : colors.gray200,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  { color: colors.dark },
                ]}
                placeholder="请输入密码"
                placeholderTextColor={colors.secondary}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={() => validatePassword(password)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={styles.showPasswordButton}
              >
                <Text style={{ fontSize: 14 }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {passwordError}
              </Text>
            ) : null}
          </View>

          {/* 通用错误提示 */}
          {error ? (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: `${colors.danger}15` },
              ]}
            >
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* 登录按钮 */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: isLoading ? colors.gray200 : colors.primary,
              },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>登录</Text>
            )}
          </TouchableOpacity>

          {/* 其他选项 */}
          <View style={styles.footer}>
            <Text style={{ color: colors.secondary, fontSize: 14 }}>
              还没有账号？
            </Text>
            <TouchableOpacity onPress={() => Alert.alert('敬请期待', '注册功能即将上线')}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
                立即注册
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    height: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  showPasswordButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
  },
});
