import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { language, saveLanguage } = useAppStore();
  const colors = useThemedColors();

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
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 24,
            width: '85%',
            maxWidth: 320,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.dark,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            {t('selectLanguage', language)}
          </Text>

          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: language === 'zh' ? colors.primaryLight : colors.gray100,
              },
            ]}
            onPress={() => handleLanguageSelect('zh')}
          >
            <Text
              style={[
                {
                  fontSize: 16,
                  color: language === 'zh' ? colors.primaryDark : colors.dark,
                  fontWeight: language === 'zh' ? '600' : '400',
                },
              ]}
            >
              🇨🇳 {t('chinese', language)}
            </Text>
            {language === 'zh' && (
              <Text
                style={{
                  fontSize: 20,
                  color: colors.primary,
                  fontWeight: '600',
                }}
              >
                ✓
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: language === 'en' ? colors.primaryLight : colors.gray100,
              },
            ]}
            onPress={() => handleLanguageSelect('en')}
          >
            <Text
              style={[
                {
                  fontSize: 16,
                  color: language === 'en' ? colors.primaryDark : colors.dark,
                  fontWeight: language === 'en' ? '600' : '400',
                },
              ]}
            >
              🇺🇸 {t('english', language)}
            </Text>
            {language === 'en' && (
              <Text
                style={{
                  fontSize: 20,
                  color: colors.primary,
                  fontWeight: '600',
                }}
              >
                ✓
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 14,
              alignItems: 'center',
              marginTop: 8,
            }}
            onPress={onClose}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.secondary,
                fontWeight: '500',
              }}
            >
              {t('cancel', language)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
