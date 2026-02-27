import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/constants';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        variant === 'primary' && styles.primary,
        variant === 'success' && styles.success,
        variant === 'warning' && styles.warning,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'primary' && styles.textPrimary,
          variant === 'success' && styles.textSuccess,
          variant === 'warning' && styles.textWarning,
          size === 'sm' && styles.textSm,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    justifyContent: 'center',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  default: {
    backgroundColor: colors.gray100,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: '#10B981',
  },
  warning: {
    backgroundColor: '#F59E0B',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  textSm: {
    fontSize: 10,
  },
  textPrimary: {
    color: colors.white,
  },
  textSuccess: {
    color: colors.white,
  },
  textWarning: {
    color: colors.white,
  },
});
