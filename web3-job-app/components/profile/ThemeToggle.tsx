import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '@/store/app-store';
import { useThemedColors } from '@/lib/useThemedColors';
import { t } from '@/lib/i18n';

interface ThemeToggleProps {
  onToggle?: () => void;
}

export function ThemeToggle({ onToggle }: ThemeToggleProps) {
  const { themeMode, setThemeMode, language } = useAppStore();
  const colors = useThemedColors();

  const handleToggle = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    onToggle?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuIcon}>🌙</Text>
        <Text style={[styles.menuLabel, { color: colors.dark }]}>{t('darkMode', language)}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.toggle,
          { backgroundColor: themeMode === 'dark' ? colors.primary : colors.gray300 },
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.toggleKnob,
            {
              backgroundColor: colors.white,
              transform: [{ translateX: themeMode === 'dark' ? 22 : 0 }],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
