import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { Button } from '@/components/ui/Button';
import { t } from '@/lib/i18n';
import { useAppStore } from '@/store/app-store';

interface LoginContentProps {
  onLoginPress: () => void;
}

export function LoginContent({ onLoginPress }: LoginContentProps) {
  const colors = useThemedColors();
  const { language } = useAppStore();

  const features = [
    { icon: '📝', title: t('postJobs', language), description: t('postJobsDesc', language) },
    { icon: '💬', title: t('messaging', language), description: t('messagingDesc', language) },
    { icon: '📄', title: t('myResume', language), description: t('myResumeDesc', language) },
    { icon: '🔔', title: t('notifications', language), description: t('notificationsDesc', language) },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.logoPlaceholder,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.logoText}>👋</Text>
        </View>
        <Text style={[styles.title, { color: colors.dark }]}>
          {t('welcome', language)}
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          {t('loginToContinue', language)}
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {features.map((feature, index) => (
          <View
            key={index}
            style={[
              styles.featureCard,
              { backgroundColor: colors.white, borderColor: colors.gray100 },
            ]}
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.dark }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.secondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Login Button */}
      <View style={styles.footer}>
        <Button onPress={onLoginPress} size="lg" style={{ width: '100%' }}>
          {t('login', language)}
        </Button>

        <View style={styles.registerContainer}>
          <Text style={{ color: colors.secondary, fontSize: 14 }}>
            {t('noAccount', language)}
          </Text>
          <TouchableOpacity onPress={() => alert('注册功能即将上线')}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
              {t('register', language)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
    lineHeight: 20,
  },
  features: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
