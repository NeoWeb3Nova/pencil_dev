import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { mockProfile } from '@/lib/constants';
import { colors } from '@/lib/constants';

export default function ProfileScreen() {
  const handleMenuItemPress = (item: string) => {
    console.log('Menu item pressed:', item);
  };

  return (
    <View style={styles.container}>
      <ProfileContent profile={mockProfile} onMenuItemPress={handleMenuItemPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
