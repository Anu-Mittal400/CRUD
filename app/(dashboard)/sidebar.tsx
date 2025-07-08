import {
  ChevronDown,
  CircleUserIcon,
  MessageCircle,
  Plus,
} from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  messages: Message[];
  timestamp: Date;
}

interface SidebarProps {
  chatHistory: Chat[];
  sidebarAnim: Animated.Value;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatHistory,
  sidebarAnim,
  onNewChat,
  onSelectChat,
  onOpenSettings,
}) => {
  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
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
            data={chatHistory}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelectChat(item)}
                style={styles.chatHistoryItem}
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
          <CircleUserIcon size={20} color="#fff" />
          <Text style={styles.profileName}>ABC</Text>
          <ChevronDown size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth * 0.85,
    height: '100%',
    backgroundColor: '#111',
    zIndex: 1001,
    paddingTop: 60,
  },
  sidebarHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  profileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
});
