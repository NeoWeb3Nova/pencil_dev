import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import {
  Home,
  Briefcase,
  PlusCircle,
  MessageSquare,
  User,
  Bell,
  Search,
} from 'lucide-react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

function TabBarIcon({ icon, color, size = 24 }: { icon: React.ElementType; color: string; size?: number }) {
  const IconComponent = icon;
  return <IconComponent size={size} color={color} />;
}

export default function TabLayout() {
  const { language } = useAppStore();
  const colors = useThemedColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 83,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: colors.dark,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('homeTitle', language),
          tabBarIcon: ({ color }) => <TabBarIcon icon={Home} color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable>
                <TabBarIcon icon={Bell} color={colors.dark} />
              </Pressable>
              <Pressable>
                <TabBarIcon icon={Search} color={colors.dark} />
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: t('jobsTitle', language),
          tabBarIcon: ({ color }) => <TabBarIcon icon={Briefcase} color={color} />,
          headerTitle: t('browseJobs', language),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: t('postTitle', language),
          tabBarIcon: ({ color }) => <TabBarIcon icon={PlusCircle} color={color} />,
          headerTitle: t('postJobTitle', language),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('messagesTitle', language),
          tabBarIcon: ({ color }) => <TabBarIcon icon={MessageSquare} color={color} />,
          headerTitle: t('messagesHeader', language),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable>
                <TabBarIcon icon={Search} color={colors.dark} />
              </Pressable>
              <Pressable>
                <TabBarIcon icon={Bell} color={colors.dark} />
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profileTitle', language),
          tabBarIcon: ({ color }) => <TabBarIcon icon={User} color={color} />,
          headerTitle: t('profileHeader', language),
        }}
      />
    </Tabs>
  );
}
