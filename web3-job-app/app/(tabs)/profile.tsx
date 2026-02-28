import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { LanguageSelector } from '@/components/profile/LanguageSelector';
import { mockProfile } from '@/lib/constants';

export default function ProfileScreen() {
  const colors = useThemedColors();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleMenuItemPress = (item: string) => {
    if (item === 'language') {
      setShowLanguageSelector(true);
    } else {
      console.log('Menu item pressed:', item);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProfileContent profile={mockProfile} onMenuItemPress={handleMenuItemPress} />
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
