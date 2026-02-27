import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MessagesContent } from '@/components/messages/MessagesContent';
import { mockMessages } from '@/lib/constants';
import { Message } from '@/types';
import { colors } from '@/lib/constants';

export default function MessagesScreen() {
  const handleMessagePress = (message: Message) => {
    console.log('Message pressed:', message);
    // Navigate to message detail
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  return (
    <View style={styles.container}>
      <MessagesContent
        messages={mockMessages}
        onMessagePress={handleMessagePress}
        onSearch={handleSearch}
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
