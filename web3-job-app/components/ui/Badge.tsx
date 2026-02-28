import React from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const colors = useThemedColors();

  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'success':
        return { backgroundColor: '#10B981' };
      case 'warning':
        return { backgroundColor: '#F59E0B' };
      default:
        return { backgroundColor: colors.gray100 };
    }
  };

  const getTextStyle = () => {
    if (variant === 'default') {
      return { color: colors.secondary };
    }
    return { color: colors.white };
  };

  const getSizeStyle = () => {
    if (size === 'sm') {
      return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 10 };
    }
    return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 };
  };

  const sizeStyle = getSizeStyle();

  return (
    <View
      style={[
        {
          borderRadius: 16,
          justifyContent: 'center',
        },
        getBadgeStyle(),
      ]}
    >
      <Text
        style={[
          {
            fontWeight: '600',
            fontSize: sizeStyle.fontSize,
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
          },
          getTextStyle(),
        ]}
      >
        {children}
      </Text>
    </View>
  );
}
