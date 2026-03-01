import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { t } from '@/lib/i18n';
import { useAppStore } from '@/store/app-store';
import { useRouter } from 'expo-router';

interface LoginContentProps {
  onLoginPress: () => void;
}

export function LoginContent({ onLoginPress }: LoginContentProps) {
  const colors = useThemedColors();
  const { language } = useAppStore();
  const router = useRouter();

  const features = [
    {
      icon: '📝',
      title: t('postJobs', language),
      description: t('postJobsDesc', language) || '发布职位，吸引优秀人才',
    },
    {
      icon: '💬',
      title: t('messaging', language),
      description: t('messagingDesc', language) || '与候选人直接沟通',
    },
    {
      icon: '📄',
      title: t('myResume', language),
      description: t('resumeDesc', language) || '管理您的在线简历',
    },
    {
      icon: '🔔',
      title: t('notifications', language),
      description: t('notificationsDesc', language) || '获取最新的职位通知',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>🚀</Text>
        </View>
        <Text style={[styles.title, { color: colors.dark }]}>
          {t('welcome', language)}
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          {t('loginToExplore', language) || '登录以探索更多机会'}
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View
            key={index}
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.gray200,
              },
            ]}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: colors.gray100 }]}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
            </View>
            <Text style={[styles.featureTitle, { color: colors.dark }]}>
              {feature.title}
            </Text>
            <Text style={[styles.featureDescription, { color: colors.secondary }]}>
              {feature.description}
            </Text>
          </View>
        ))}
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: colors.primary }]}
        onPress={onLoginPress}
      >
        <Text style={styles.loginButtonText}>{t('login', language)}</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={[styles.registerText, { color: colors.secondary }]}>
          {t('noAccount', language)}{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={[styles.registerLink, { color: colors.primary }]}>
            {t('register', language)}
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
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
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
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    textAlign: 'center',
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
