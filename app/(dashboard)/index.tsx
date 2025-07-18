import { useAuth } from '@/authcontext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowUp, Menu, MessageCircle, Mic, SquarePen } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtectedRoute from '../routes/protectedroute';
import Sidebar from './sidebar';

const { width: screenWidth } = Dimensions.get('window');

// Types
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: string;
  timestamp: Date;
};

type UserType = { 
  name?: string; 
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
} | null;

export default function Dashboard() {
  const router = useRouter();
  const { session, sessionLoading } = useAuth();

  // State
  const [user, setUser] = useState<UserType>(null);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatStarted, isChatStarted] = useState(false)
  const [keyboardKey, setKeyboardKey] = useState(0);
  const sidebarAnim = useRef(new Animated.Value(-300)).current;
  const flatListRef = useRef<FlatList>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  
  // Constants
  const welcomePrompts = [
    "Write a creative story",
    "Explain quantum physics", 
    "Plan a weekend trip",
    "Help with coding"
  ];

  // Session and Auth Effects
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace('/(auth)/login');
    }
  }, [sessionLoading, session]);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session || !session.expires_in) return;

    const expiresInMs = session.expires_in * 1000;
    const timeout = setTimeout(async () => {
      await supabase.auth.signOut();
      router.replace('/(auth)/login');
    }, expiresInMs);

    return () => clearTimeout(timeout);
  }, [session]);

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     setTimeout(() => {
  //       flatListRef.current?.scrollToEnd({ animated: true });
  //     }, 100);
  //   }
  // }, [messages]);
  useEffect(() => {
  if (messages.length > 0 && !isUserScrolling) {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }
}, [messages, isUserScrolling]);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardKey(prev => prev + 1);
    });
    return () => hideSubscription.remove();
  }, []);

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: showSidebar ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSidebar]);

  // Handlers
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
    setShowSidebar(false);
  };

  const handleNewChat = () => {
    // Save current chat to history if it has messages

    if (messages.length > 0) {
      const firstMessageText = messages[0]?.text || `Chat ${chatHistory.length + 1}`;
      const chatTitle = firstMessageText.length > 30 
        ? firstMessageText.slice(0, 30) + '...' 
        : firstMessageText;

      const newChat: Chat = {
        id: Date.now().toString(),
        title: chatTitle,
        messages: [...messages],
        lastMessage: messages[messages.length - 1]?.text.slice(0, 50) + '...',
        timestamp: new Date(),
      };

      setChatHistory(prev => [newChat, ...prev]);
    }
    
    setSelectedChat(null);
    setMessages([]);
    setShowSidebar(false);
  };

  const handleOpenSettings = () => {
    setShowSidebar(false);
    // setShowSettings(true);
    router.push('/settings')
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!chatStarted) isChatStarted(true);

    if (!messageText) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    };
    
    if (!chatStarted) isChatStarted(true);

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
    Keyboard.dismiss();

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'This is a mock response from AI. I can help you with various tasks including answering questions, writing content, coding, analysis, and much more!',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 0);
  };

  // Utility Functions
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Render Functions
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}>
        {item.sender === 'bot' && (
          <View style={styles.botAvatar}>
            <MessageCircle size={16} color="#10a37f" />
          </View>
        )}
        <View style={styles.messageContent}>
          <Text style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.botText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            item.sender === 'user' ? styles.userTimestamp : styles.botTimestamp
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.messageContainer}>
      <View style={[styles.messageBubble, styles.botBubble]}>
        <View style={styles.botAvatar}>
          <MessageCircle size={16} color="#10a37f" />
        </View>
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>AI is typing...</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
    <ProtectedRoute>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
     
        <SafeAreaView style={styles.safeAreaWrapper}>
          <KeyboardAvoidingView
            key={keyboardKey}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
          >
            <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={() => setShowSidebar(true)}
                style={styles.menuButton}
              >
                <Menu size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>DocsBot</Text>
              
              {messages.length > 0 ? (
              <TouchableOpacity onPress={handleNewChat}>
                  <SquarePen color="white" size={24} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 24 }} />
              )}
            </View>

            {/* Main Chat Area */}
            {!chatStarted && messages.length === 0 ? (
             <ScrollView contentContainerStyle={styles.welcomeContainer}
                   keyboardShouldPersistTaps="handled">
                <View style={styles.welcomeHeader}>
                  <Text style={styles.welcomeTitle}>
                    Hello{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
                  </Text>
                  <Text style={styles.welcomeSubtitle}>How can I help you today?</Text>
                  </View>
                  <View style={styles.promptsContainer}>
                    {welcomePrompts.map((prompt, i) => (
                      <TouchableOpacity 
                        key={i} 
                        onPress={() => handleSend(prompt)} 
                        style={styles.promptButton}
                      >
                        <Text style={styles.promptText}>{prompt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
              </ScrollView>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  renderItem={renderMessage}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={[styles.messageList, { flexGrow: 1 }]}
                  ListFooterComponent={isTyping ? renderTypingIndicator : null}
                  onScrollBeginDrag={() => setIsUserScrolling(true)}
                  // onScrollEndDrag={() => setTimeout(() => setIsUserScrolling(false), 1000)}
                  onLayout={() => {
                    if (!isUserScrolling) {
                      setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                      }, 100);
                    }
                  }}
                  // onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                  // onContentSizeChange={() => {
                  //   // Improved auto-scroll
                  //   setTimeout(() => {
                  //     flatListRef.current?.scrollToEnd({ animated: true });
                  //   }, 100);
                  // }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag" // Add this
                  maintainVisibleContentPosition={{ // Add this for better scroll behavior
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 10,
                  }}
                />
              )}
            {/* </View> */}

            {/* Input Bar */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
              <TextInput
                value={input}
                onChangeText={setInput}
                style={styles.input}
                placeholder="Ask Anything..."
                placeholderTextColor="#888"
                multiline
                maxLength={2000}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
              />
              <View style={styles.buttonContainer}>

              <TouchableOpacity style={styles.iconButton}>
                <Mic size={22} color="#fff" />
              </TouchableOpacity>
              </View>
              <TouchableOpacity 
                onPress={() => handleSend()} 
                style={[
                  styles.iconButton,
                  { opacity: input.trim().length === 0 ? 0.4 : 1 }
                ]}
                disabled={input.trim().length === 0}
              >
                <ArrowUp size={24} color="#fff" />
              </TouchableOpacity>
              </View>
            </View>

            {/* Sidebar Component */}
            <Sidebar
              visible={showSidebar}
              sidebarAnim={sidebarAnim}
              onClose={() => setShowSidebar(false)}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onOpenSettings={handleOpenSettings}
              chatHistory={chatHistory}
              user={{
                name: user?.user_metadata?.full_name || user?.name,
                email: user?.email,
              }}
            />
           </Pressable>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ProtectedRoute>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    justifyContent: 'space-between',
    height: 60,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 16,
  },
  welcomeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 24,
    // maxHeight: '100%',
  },
  welcomeHeader:{
    alignItems: 'center',
    marginBottom: 40,

  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  promptsContainer: {
    gap: 10,
    width: '100%',
  },
  promptButton: {
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
  },
  promptText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  messageList: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  userBubble: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botBubble: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10a37f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContent: {
    maxWidth: screenWidth * 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userText: {
    color: '#fff',
    backgroundColor: '#10a37f',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  botText: {
    color: '#fff',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  userTimestamp: {
    color: '#888',
    textAlign: 'right',
  },
  botTimestamp: {
    color: '#888',
    textAlign: 'left',
  },
  typingContainer: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  typingText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 50,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    minHeight: 20,
    paddingVertical: 8,
    paddingRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginLeft: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});
