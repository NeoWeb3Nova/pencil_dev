import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { UserProfile } from '@/types';
import { useThemedColors } from '@/lib/useThemedColors';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';
import { ThemeToggle } from '@/components/profile/ThemeToggle';

interface ProfileContentProps {
  profile: UserProfile;
  onMenuItemPress?: (item: string) => void;
}

export function ProfileContent({ profile, onMenuItemPress }: ProfileContentProps) {
  const { language } = useAppStore();
  const colors = useThemedColors();

  const menuItems1 = [
    { id: 'resume', label: t('myResume', language), icon: '📄' },
    { id: 'saved', label: t('savedJobs', language), icon: '🔖' },
    { id: 'wallet', label: t('walletConnect', language), icon: '💳' },
  ];

  const menuItems2 = [
    { id: 'language', label: t('language', language), value: language === 'zh' ? '中文' : 'English', icon: '🌍' },
    { id: 'analytics', label: t('analytics', language), icon: '📊' },
  ];

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Card
        style={{
          margin: 16,
          padding: 24,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: colors.dark,
            marginBottom: 4,
          }}
        >
          {profile.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.secondary,
          }}
        >
          {profile.email}
        </Text>
      </Card>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 16,
          marginBottom: 20,
        }}
      >
        <Card
          style={{
            flex: 1,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {profile.stats.applied}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.secondary,
            }}
          >
            {t('applied', language)}
          </Text>
        </Card>
        <Card
          style={{
            flex: 1,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {profile.stats.interviews}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.secondary,
            }}
          >
            {t('interviews', language)}
          </Text>
        </Card>
        <Card
          style={{
            flex: 1,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {profile.stats.offers}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.secondary,
            }}
          >
            {t('offers', language)}
          </Text>
        </Card>
      </View>

      {/* Menu Section 1 */}
      <Card
        style={{
          marginHorizontal: 16,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {menuItems1.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: index !== menuItems1.length - 1 ? 1 : 0,
                borderBottomColor: colors.gray100,
              },
            ]}
            onPress={() => onMenuItemPress?.(item.id)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.dark,
                }}
              >
                {item.label}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                color: colors.muted,
              }}
            >
              ›
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Menu Section 2 */}
      <Card
        style={{
          marginHorizontal: 16,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {menuItems2.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: index !== menuItems2.length - 1 ? 1 : 0,
                borderBottomColor: colors.gray100,
              },
            ]}
            onPress={() => onMenuItemPress?.(item.id)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.dark,
                }}
              >
                {item.label}
              </Text>
              {item.value && (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.secondary,
                    marginLeft: 8,
                  }}
                >
                  {item.value}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 24,
                color: colors.muted,
              }}
            >
              ›
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Theme Toggle */}
      <Card
        style={{
          marginHorizontal: 16,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        <ThemeToggle />
      </Card>
    </ScrollView>
  );
}
