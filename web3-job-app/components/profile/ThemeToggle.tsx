import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '@/store/app-store';
import { colors } from '@/lib/constants';
import { t } from '@/lib/i18n';

interface ThemeToggleProps {
  onToggle?: () => void;
}

export function ThemeToggle({ onToggle }: ThemeToggleProps) {
  const { themeMode, setThemeMode, language } = useAppStore();

  const handleToggle = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    onToggle?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuIcon}>🌙</Text>
        <Text style={styles.menuLabel}>{t('darkMode', language)}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.toggle,
          themeMode === 'dark' && styles.toggleActive,
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.toggleKnob,
            themeMode === 'dark' && styles.toggleKnobActive,
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
  menuLabel: {
    fontSize: 14,
    color: colors.dark,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray300,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
});
