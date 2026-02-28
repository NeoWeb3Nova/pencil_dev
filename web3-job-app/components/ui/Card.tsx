import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: object;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  const colors = useThemedColors();

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 12,
        },
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && {
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
