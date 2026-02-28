import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  leftIcon?: React.ReactNode;
  style?: object;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  error,
  leftIcon,
  style,
}: InputProps) {
  const colors = useThemedColors();

  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label && (
        <Text
          style={[
            {
              fontSize: 14,
              fontWeight: '600',
              color: colors.dark,
              marginBottom: 8,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: error ? '#EF4444' : colors.border,
          },
          leftIcon ? { paddingLeft: 0 } : undefined,
        ]}
      >
        {leftIcon && <View style={{ paddingLeft: 12, paddingRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={[
            {
              flex: 1,
              height: 48,
              paddingHorizontal: 12,
              fontSize: 14,
              color: colors.dark,
            },
            multiline
              ? {
                  height: 100,
                  paddingTop: 12,
                  paddingBottom: 12,
                }
              : undefined,
            leftIcon ? { paddingLeft: 0 } : undefined,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
      {error && (
        <Text
          style={[
            {
              fontSize: 12,
              color: '#EF4444',
              marginTop: 4,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
