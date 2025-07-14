import { ChevronRight, MessageCircle, Plus } from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  messages: Message[];
  timestamp: Date;
}

interface SidebarProps {
  visible: boolean;
  sidebarAnim: Animated.Value;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  onOpenSettings: () => void;
  chatHistory: Chat[];
  user?: {
    name?: string;
    email?: string;
  };
}

export default function Sidebar({
  visible,
  sidebarAnim,
  onClose,
  onNewChat,
  onSelectChat,
  onOpenSettings,
  chatHistory,
  user,
}: SidebarProps) {
  if (!visible) return null;

  return (
    <>
      <Pressable onPress={onClose}>
        <View style={styles.overlay} />
      </Pressable>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
        <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={onNewChat} style={styles.newChatButton}>
              <Plus size={18} color="#fff" />
              <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>
          </View>

          {/* Chat History */}
          <View style={styles.chatHistoryContainer}>
            <Text style={styles.sidebarTitle}>Recent</Text>

            {chatHistory.length === 0 ? (
              <View style={styles.noChatContainer}>
                <MessageCircle size={40} color="#666" />
                <Text style={styles.noChat}>No conversations yet</Text>
                <Text style={styles.noChatSubtitle}>Start a new chat to get going</Text>
              </View>
            ) : (
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={chatHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.chatHistoryItem}
                    onPress={() => onSelectChat(item)}
                  >
                    <Text style={styles.chatTitle}>{item.title}</Text>
                    {item.lastMessage && (
                      <Text style={styles.chatPreview}>{item.lastMessage}</Text>
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Footer */}
          <View style={styles.sidebarFooter}>
            <TouchableOpacity onPress={onOpenSettings} style={styles.profileButton}>
              <View style={styles.initialsAvatar}>
                <Text style={styles.initialsText}>
                  {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <ChevronRight size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth * 0.85,
    height: '100%',
    backgroundColor: '#111',
    zIndex: 1001,
    paddingTop: 0,
  },
  sidebarHeader: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#111',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  newChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  chatHistoryContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sidebarTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chatHistoryItem: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  chatTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  chatPreview: {
    color: '#888',
    fontSize: 12,
    lineHeight: 16,
  },
  noChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noChat: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  noChatSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  sidebarFooter: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  initialsAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10a37f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  initialsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
});
