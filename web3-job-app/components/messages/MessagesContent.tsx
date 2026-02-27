import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Message } from '@/types';
import { colors } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface MessagesContentProps {
  messages: Message[];
  onMessagePress?: (message: Message) => void;
  onSearch?: (query: string) => void;
}

export function MessagesContent({ messages, onMessagePress, onSearch }: MessagesContentProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Input
          placeholder="搜索消息..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            onSearch?.(text);
          }}
        />
      </View>

      {/* Message List */}
      <View style={styles.messageList}>
        {messages.map((message) => (
          <TouchableOpacity
            key={message.id}
            onPress={() => onMessagePress?.(message)}
            activeOpacity={0.7}
          >
            <Card style={styles.messageCard}>
              <View style={styles.messageContent}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: message.avatarColor || colors.gray200 },
                  ]}
                >
                  <Text style={styles.avatarText}>{message.companyInitial}</Text>
                </View>
                <View style={styles.details}>
                  <View style={styles.header}>
                    <Text style={styles.company}>{message.company}</Text>
                    <Text style={styles.timestamp}>{message.timestamp}</Text>
                  </View>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {message.lastMessage}
                  </Text>
                </View>
                {message.unread && <View style={styles.unreadBadge} />}
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    padding: 16,
  },
  messageList: {
    paddingHorizontal: 16,
  },
  messageCard: {
    marginBottom: 12,
    padding: 16,
  },
  messageContent: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  timestamp: {
    fontSize: 12,
    color: colors.muted,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.secondary,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 8,
    right: 0,
  },
});
