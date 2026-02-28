import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Message } from '@/types';
import { useThemedColors } from '@/lib/useThemedColors';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store/app-store';
import { t } from '@/lib/i18n';

interface MessagesContentProps {
  messages: Message[];
  onMessagePress?: (message: Message) => void;
  onSearch?: (query: string) => void;
}

export function MessagesContent({ messages, onMessagePress, onSearch }: MessagesContentProps) {
  const { language } = useAppStore();
  const colors = useThemedColors();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Search Bar */}
      <View style={{ padding: 16 }}>
        <Input
          placeholder={t('searchMessagesPlaceholder', language)}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            onSearch?.(text);
          }}
        />
      </View>

      {/* Message List */}
      <View style={{ paddingHorizontal: 16 }}>
        {messages.map((message) => (
          <TouchableOpacity
            key={message.id}
            onPress={() => onMessagePress?.(message)}
            activeOpacity={0.7}
          >
            <Card
              style={{
                marginBottom: 12,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                }}
              >
                <View
                  style={[
                    {
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: message.avatarColor || colors.gray200,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 16,
                      fontWeight: '700',
                    }}
                  >
                    {message.companyInitial}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.dark,
                      }}
                    >
                      {message.company}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.muted,
                      }}
                    >
                      {message.timestamp}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                    numberOfLines={1}
                  >
                    {message.lastMessage}
                  </Text>
                </View>
                {message.unread && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: colors.primary,
                      position: 'absolute',
                      top: 8,
                      right: 0,
                    }}
                  />
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
