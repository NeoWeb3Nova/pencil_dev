import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/constants';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { language, saveLanguage } = useAppStore();

  const handleLanguageSelect = async (lang: 'zh' | 'en') => {
    await saveLanguage(lang);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('selectLanguage', language)}</Text>

          <TouchableOpacity
            style={[
              styles.option,
              language === 'zh' && styles.optionSelected,
            ]}
            onPress={() => handleLanguageSelect('zh')}
          >
            <Text
              style={[
                styles.optionText,
                language === 'zh' && styles.optionTextSelected,
              ]}
            >
              🇨🇳 {t('chinese', language)}
            </Text>
            {language === 'zh' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              language === 'en' && styles.optionSelected,
            ]}
            onPress={() => handleLanguageSelect('en')}
          >
            <Text
              style={[
                styles.optionText,
                language === 'en' && styles.optionTextSelected,
              ]}
            >
              🇺🇸 {t('english', language)}
            </Text>
            {language === 'en' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>{t('cancel', language)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.gray100,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: 16,
    color: colors.dark,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primaryDark,
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '500',
  },
});
