import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent
} from 'expo-speech-recognition';
import { ArrowLeft, CircleUserIcon, LogOut, Menu, MessageCircle, Mic, Send, Settings, SquarePen } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList, Keyboard, KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from './sidebar';

const { width: screenWidth } = Dimensions.get('window');

// ✅ Types
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

export default function Dashboard() {
  const [input, setInput] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sidebarAnim = useRef(new Animated.Value(-screenWidth * 0.85)).current;
  const settingsAnim = useRef(new Animated.Value(screenWidth)).current;
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null); 
  const isSendDisabled = input.trim().length === 0;
  // const headerHeight = useHeaderHeight();
  const [keyboardKey, setKeyboardKey] = useState(0);
  const [recognizing, setRecognizing] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const [micActive, setMicActive] = useState(false);

  useSpeechRecognitionEvent('start', () => setRecognizing(true));
  useSpeechRecognitionEvent('end', () => setRecognizing(false));
  useSpeechRecognitionEvent('result', event => {
    const transcript = event.results[0]?.transcript;
    setRecordingText(transcript);
  });
  useSpeechRecognitionEvent('error', event => console.error(event.error, event.message));
  
  // const handleMicPress = async () => {
  //   if (recognizing) {
  //     ExpoSpeechRecognitionModule.stop();
  //     handleSend(recordingText); // send final transcript
  //     setRecordingText('');
  //   } else {
  //     const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  //     if (!perm.granted) return alert('Mic permission denied');
  //     ExpoSpeechRecognitionModule.start({
  //       lang: 'en-US',
  //       interimResults: true,
  //       continuous: false,
  //     });
  //   }
  // };

  const handleMicPress = async () => {
    if (recognizing) {
      ExpoSpeechRecognitionModule.stop();
      setTimeout(() => {
        setMicActive(false);  // remove mic effect
        handleSend(recordingText); // send final transcript
        setRecordingText('');
      }, 2000);
    } else {
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) return alert('Mic permission denied');

      setMicActive(true); // show mic effect

      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        continuous: false,
      });
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardKey(prev => prev + 1); // forces rerender to reset layout
      });

      return () => {
          hideSubscription.remove();
      };
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone was denied');
      }
    };

    requestPermissions();
  }, []);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();

      console.log('Starting recording..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri,
        name: 'recording.m4a', // or .mp3
        type: 'audio/m4a',     // match correct type
      } as any);

      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer YOUR_OPENAI_API_KEY', // 🔐 Replace this
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Transcription result:', result.text);

      return result.text;
    } catch (error) {
      console.error('Error during transcription:', error);
      return '';
    }
  };

// const stopRecording = async () => {



//   if (!recording) return;

//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();

//       setRecording(null);

//       if (uri) {
//         const text = await transcribeAudio(uri);
//         handleSend(text); // 
//       }

// };


  const openSettings = () => {
    setShowSettings(true);
    Animated.timing(settingsAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSettings = () => {
    Animated.timing(settingsAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowSettings(false));
  };

  const handleSignOut = () => {
    router.replace('/login');
  };

  const openSidebar = () => {
    setShowSidebar(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -screenWidth * 0.85,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowSidebar(false));
  };

  const handleSend = (text?: string) => {
    const messageText = text ?? input.trim();
    
    if (!messageText) return;

    // if (!input.trim()) return;
    
    if (showWelcome) setShowWelcome(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    Keyboard.dismiss();

    // Simulate bot typing
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'This is a smart AI response. I can help you with various tasks including answering questions, writing content, coding, analysis, and much more!',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      setChatHistory((prev) => {
        const firstMessageText = messages[0]?.text || `Chat ${prev.length + 1}`;
        const chatTitle =
          firstMessageText.length > 30
            ? firstMessageText.slice(0, 30) + '...'
            : firstMessageText;

        const newChat: Chat = {
          id: Date.now().toString(),
          title: chatTitle,
          messages: [...messages],
          lastMessage: messages[messages.length - 1]?.text.slice(0, 50) + '...',
          timestamp: new Date(),
        };

        return [newChat, ...prev];
      });
    }
    setMessages([]);
    setShowWelcome(true);
    closeSidebar();
  };

  const handleChatSelect = (chat: Chat) => {
    setMessages(chat.messages);
    setShowWelcome(false);
    closeSidebar();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
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
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    </View>
  );

  const welcomePrompts = [
    "Write a creative story",
    "Explain quantum physics",
    "Plan a weekend trip",
    "Help with coding"
  ];


  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          key =  {keyboardKey}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={0}
        >
          {/* Overlay */}
          {(showSidebar || showSettings) && (
            <TouchableWithoutFeedback onPress={showSidebar ? closeSidebar : closeSettings}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          )}

          {/* Sidebar */}
          {/* <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
            <View style={styles.sidebarHeader}>
              <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
                <Plus size={18} color="#fff" />
                <Text style={styles.newChatText}>New Chat</Text>
              </TouchableOpacity>
            </View>

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
                  keyboardShouldPersistTaps="handled" // ✅ Add this!

                  data={chatHistory}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.chatHistoryItem}
                      onPress={() => handleChatSelect(item)}
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

            <View style={styles.sidebarFooter}>
              <TouchableOpacity onPress={openSettings} style={styles.profileButton}>
                <CircleUserIcon size={20} color="#fff" />
                <Text style={styles.profileName}>ABC</Text>
                <ChevronDown size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View> */}
          
          <Sidebar
              chatHistory={chatHistory}
              sidebarAnim={sidebarAnim}
              onNewChat={handleNewChat}
              onSelectChat={handleChatSelect}
              onOpenSettings={openSettings}
            />

          {/* Settings Screen */}
          {showSettings && (
            <Animated.View style={[styles.settingsScreen, { transform: [{ translateX: settingsAnim }] }]}>
              <View style={styles.settingsHeader}>
                <TouchableOpacity onPress={closeSettings} style={styles.settingsBackButton}>
                  <ArrowLeft size={24} color="#fff"/>
                </TouchableOpacity>
                <Text style={styles.settingsTitle}>Settings</Text>
              </View>

              <View style={styles.settingsContent}>
                <View style={styles.profileSection}>
                  <View style={styles.profileAvatar}>
                    <CircleUserIcon size={40} color="#10a37f" />
                  </View>
                  <Text style={styles.profileDisplayName}>ABC</Text>
                  <Text style={styles.profileEmail}>abc@example.com</Text>
                </View>

                <View style={styles.settingsSection}>
                  <View style={styles.settingsItem}>
                    <Settings size={20} color="#10a37f" />
                    <Text style={styles.settingsLabel}>General</Text>
                  </View>
                  <View style={styles.settingsItem}>
                    <Text style={styles.settingsLabel}>Phone Number</Text>
                    <Text style={styles.settingsValue}>+91 98765 43210</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                  <LogOut size={20} color="#ff4444" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
              <Menu size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>ChatGPT</Text>
            <TouchableOpacity onPress={handleNewChat} style={styles.newChatHeaderButton}>
              <SquarePen color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          {showWelcome ? (
            <ScrollView contentContainerStyle={styles.welcomeContainer}
                   keyboardShouldPersistTaps="handled">
              <View style={styles.welcomeHeader}>
                <Text style={styles.welcomeTitle}>Hello, aaABC!</Text>
                <Text style={styles.welcomeSubtitle}>How can I help you today?</Text>
              </View>
              
              <View style={styles.promptsContainer}>
                {welcomePrompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.promptButton}
                    onPress={() => handleSend(prompt)}
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
              contentContainerStyle={styles.messageList}
              ListFooterComponent={isTyping ? renderTypingIndicator : null}
              // onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled" // ✅ Add this!

            />
          )}

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Message ChatGPT..."
                placeholderTextColor="#666"
                multiline
                maxLength={2000}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
              />
              <TouchableOpacity
                  onPress={handleMicPress}
                  style={[styles.micButton, micActive && styles.micActive]}
                >
                  <Mic size={22} color="#fff" />
                </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleSend()} 
                disabled={isSendDisabled} 
                style={[
                  styles.sendButton,
                  { opacity: isSendDisabled ? 0.4 : 1 }
                ]}
              >
                <Send size={18} color="#fff" />
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </TouchableWithoutFeedback>

    </>
  );
}

// ✅ Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  menuButton: {
    padding: 8,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  newChatHeaderButton: {
    padding: 8,
  },
  messageList: {
    flexGrow:1,
    paddingBottom: 20,
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
    padding: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 2,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    flexDirection: 'row',
    alignItems: 'center', // changed from 'flex-end' to 'center'
      // backgroundColor: '#1a1a1a',
      // borderRadius: 25,
      // paddingHorizontal: 12,
      // paddingVertical: 8,
      // minHeight: 50,
      // maxHeight: 120,
      // borderWidth: 1,
      // borderColor: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10a37f',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  // sidebar: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   width: screenWidth * 0.85,
  //   height: '100%',
  //   backgroundColor: '#111',
  //   zIndex: 1001,
  //   paddingTop: 60,
  // },
  // sidebarHeader: {
  //   paddingHorizontal: 16,
  //   paddingBottom: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#333',
  // },
  // newChatButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#1a1a1a',
  //   padding: 12,
  //   borderRadius: 12,
  //   borderWidth: 1,
  //   borderColor: '#333',
  // },
  // newChatText: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: '500',
  //   marginLeft: 8,
  // },
  // chatHistoryContainer: {
  //   flex: 1,
  //   paddingHorizontal: 16,
  //   paddingTop: 16,
  // },
  // sidebarTitle: {
  //   color: '#888',
  //   fontSize: 14,
  //   fontWeight: '600',
  //   marginBottom: 12,
  //   textTransform: 'uppercase',
  //   letterSpacing: 0.5,
  // },
  // chatHistoryItem: {
  //   backgroundColor: '#1a1a1a',
  //   padding: 12,
  //   marginBottom: 8,
  //   borderRadius: 12,
  //   borderWidth: 1,
  //   borderColor: '#333',
  // },
  // chatTitle: {
  //   color: '#fff',
  //   fontSize: 14,
  //   fontWeight: '500',
  //   marginBottom: 4,
  // },
  // chatPreview: {
  //   color: '#888',
  //   fontSize: 12,
  //   lineHeight: 16,
  // },
  // noChatContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingHorizontal: 20,
  // },
  // noChat: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: '500',
  //   marginTop: 16,
  //   textAlign: 'center',
  // },
  // noChatSubtitle: {
  //   color: '#888',
  //   fontSize: 14,
  //   marginTop: 4,
  //   textAlign: 'center',
  // },
  // sidebarFooter: {
  //   paddingHorizontal: 16,
  //   paddingVertical: 16,
  //   borderTopWidth: 1,
  //   borderTopColor: '#333',
  // },
  // profileButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 12,
  //   borderRadius: 12,
  //   backgroundColor: '#1a1a1a',
  // },
  // profileName: {
  //   color: '#fff',
  //   fontSize: 14,
  //   fontWeight: '500',
  //   marginLeft: 8,
  //   flex: 1,
  // },

  micButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 18,
    backgroundColor: '#1a1a1a', // default
  },
  micActive: {
    backgroundColor: '#10a37f', // glow effect when active
    shadowColor: '#10a37f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  welcomeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  promptsContainer: {
    gap: 12,
  },
  promptButton: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  promptText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  settingsScreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
    zIndex: 2000,
    paddingTop: 60,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingsBackButton: {
    padding: 8,
  },
  settingsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileDisplayName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#888',
    fontSize: 14,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingsLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  settingsValue: {
    color: '#888',
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
    marginTop: 40,
  },
  signOutText: {
    color: '#ff4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  micButton: {
  // paddingHorizontal: 8,
  // justifyContent: 'center',
  // alignItems: 'center',
  width: 36,
  height: 36,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 8,
},
});

