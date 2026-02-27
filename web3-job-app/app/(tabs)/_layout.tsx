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
import { colors } from '@/lib/constants';

function TabBarIcon({ icon, color, size = 24 }: { icon: React.ElementType; color: string; size?: number }) {
  const IconComponent = icon;
  return <IconComponent size={size} color={color} />;
}

export default function TabLayout() {
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
          title: '首页',
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
          title: '职位',
          tabBarIcon: ({ color }) => <TabBarIcon icon={Briefcase} color={color} />,
          headerTitle: '浏览职位',
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: '发布',
          tabBarIcon: ({ color }) => <TabBarIcon icon={PlusCircle} color={color} />,
          headerTitle: '发布职位',
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: '消息',
          tabBarIcon: ({ color }) => <TabBarIcon icon={MessageSquare} color={color} />,
          headerTitle: '消息',
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
          title: '我的',
          tabBarIcon: ({ color }) => <TabBarIcon icon={User} color={color} />,
          headerTitle: '个人中心',
        }}
      />
    </Tabs>
  );
}
