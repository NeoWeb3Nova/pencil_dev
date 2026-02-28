import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemedColors } from '@/lib/useThemedColors';
import { MessagesContent } from '@/components/messages/MessagesContent';
import { mockMessages } from '@/lib/constants';
import { Message } from '@/types';

export default function MessagesScreen() {
  const colors = useThemedColors();

  const handleMessagePress = (message: Message) => {
    console.log('Message pressed:', message);
    // Navigate to message detail
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <MessagesContent
        messages={mockMessages}
        onMessagePress={handleMessagePress}
        onSearch={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
