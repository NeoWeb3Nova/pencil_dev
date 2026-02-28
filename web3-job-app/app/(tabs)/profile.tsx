import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { LanguageSelector } from '@/components/profile/LanguageSelector';
import { mockProfile } from '@/lib/constants';
import { colors } from '@/lib/constants';

export default function ProfileScreen() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleMenuItemPress = (item: string) => {
    if (item === 'language') {
      setShowLanguageSelector(true);
    } else {
      console.log('Menu item pressed:', item);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileContent profile={mockProfile} onMenuItemPress={handleMenuItemPress} />
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
