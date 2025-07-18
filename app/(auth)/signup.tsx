import { supabase } from '@/lib/supabase';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import PublicRoute from '../routes/publicroute';

const { width, height } = Dimensions.get('window');

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSignup = async () => {
    Keyboard.dismiss(); 
    

    if (!email || !password || !name) {
      Toast.show({
        type: 'error',
        text1: 'Please fill out all fields.',
        position: 'top',
      });
      return;
    }

    setIsLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, 
        }
      }
    });

    setIsLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed.',
        text2: 'Invalid Credentials',
        position: 'top', 
      });
    } 
    else if (session) {
      router.replace('../(dashboard)'); 
    }
    else {
      Toast.show({
        type: 'success',
        text1: 'Signup successful!, Check your email to confirm.',
        position: 'top', 
      });
      router.replace('/login');
    }
  };

  const handleGoogleSignup = () => {
    // Google signup logic
    console.log('Google signup');
  };

  const handleAppleSignup = () => {
    // Apple signup logic
    console.log('Apple signup');
  };

  return (
    <>
    <PublicRoute>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e', '#16213e']}
          style={styles.background}
        >
          <KeyboardAwareScrollView 
            contentContainerStyle={styles.outerContainer}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={20}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>Create Account</Text>
            </View>

            <View style={styles.shadowWrapper}>
              <BlurView intensity={100} tint="dark" style={styles.card}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.cardGradient}
                >
                  <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <View style={[
                        styles.inputWrapper,
                        focusedInput === 'name' && styles.inputWrapperFocused
                      ]}>
                        <FontAwesome name="user" size={16} color="#667eea" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your full name"
                          placeholderTextColor="#6b7280"
                          autoCapitalize="words"
                          value={name}
                          onChangeText={setName}
                          // onFocus={() => setFocusedInput('name')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Email Address</Text>
                      <View style={[
                        styles.inputWrapper,
                        focusedInput === 'email' && styles.inputWrapperFocused
                      ]}>
                        <FontAwesome name="envelope" size={16} color="#667eea" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your email"
                          placeholderTextColor="#6b7280"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={email}
                          onChangeText={setEmail}
                          // onFocus={() => setFocusedInput('email')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View style={[
                        styles.inputWrapper,
                        focusedInput === 'password' && styles.inputWrapperFocused
                      ]}>
                        <FontAwesome name="lock" size={16} color="#667eea" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your password"
                          placeholderTextColor="#6b7280"
                          secureTextEntry
                          autoCapitalize="none"
                          value={password}
                          onChangeText={setPassword}
                          // onFocus={() => setFocusedInput('password')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={[styles.signUpBtn, isLoading && styles.signUpBtnLoading]} 
                      onPress={handleSignup}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.signUpGradient}
                      >
                        {isLoading ? (
                          <View style={styles.loadingContainer}>
                            <Text style={styles.signUpText}>Creating Account...</Text>
                          </View>
                        ) : (
                          <Text style={styles.signUpText}>Create Account</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>or sign up with</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialContainer}>
                      <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleSignup}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                          style={styles.socialGradient}
                        >
                          <Image
                            source={{ uri: 'https://www.svgrepo.com/show/355037/google.svg' }}
                            style={styles.socialIcon}
                          />
                          <Text style={styles.socialText}>Google</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.socialBtn} onPress={handleAppleSignup}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                          style={styles.socialGradient}
                        >
                          <FontAwesome name="apple" size={20} color="#fff" />
                          <Text style={styles.socialText}>Apple</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.termsContainer}>
                      <Text style={styles.termsText}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text>{' '}
                        and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
      </SafeAreaView>
      </PublicRoute>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  outerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 25,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardGradient: {
    padding: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapperFocused: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 14,
    fontWeight: '500',
  },
  signUpBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  signUpBtnLoading: {
    opacity: 0.8,
  },
  signUpGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: '#6b7280',
    fontSize: 14,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  socialBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  socialGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 4,
  },
  termsText: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '400',
  },
  termsLink: {
    color: '#667eea',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 15,
    fontWeight: '400',
  },
  footerLink: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '700',
  },
});