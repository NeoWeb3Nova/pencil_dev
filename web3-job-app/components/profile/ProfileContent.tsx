import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { UserProfile } from '@/types';
import { colors } from '@/lib/constants';
import { Card } from '@/components/ui/Card';

interface ProfileContentProps {
  profile: UserProfile;
  onMenuItemPress?: (item: string) => void;
}

export function ProfileContent({ profile, onMenuItemPress }: ProfileContentProps) {
  const menuItems1 = [
    { id: 'resume', label: '我的简历', icon: '📄' },
    { id: 'saved', label: '保存的职位', icon: '🔖' },
    { id: 'wallet', label: '钱包连接', icon: '💳' },
  ];

  const menuItems2 = [
    { id: 'darkmode', label: '深色模式', icon: '🌙' },
    { id: 'language', label: '语言', value: '中文', icon: '🌍' },
    { id: 'analytics', label: '数据统计', icon: '📊' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </Card>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{profile.stats.applied}</Text>
          <Text style={styles.statLabel}>已申请</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{profile.stats.interviews}</Text>
          <Text style={styles.statLabel}>面试</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{profile.stats.offers}</Text>
          <Text style={styles.statLabel}>Offer</Text>
        </Card>
      </View>

      {/* Menu Section 1 */}
      <Card style={styles.menuCard}>
        {menuItems1.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, index !== menuItems1.length - 1 && styles.menuItemBorder]}
            onPress={() => onMenuItemPress?.(item.id)}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Menu Section 2 */}
      <Card style={styles.menuCard}>
        {menuItems2.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, index !== menuItems2.length - 1 && styles.menuItemBorder]}
            onPress={() => onMenuItemPress?.(item.id)}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondary,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
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
  menuValue: {
    fontSize: 14,
    color: colors.secondary,
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    color: colors.muted,
  },
});
