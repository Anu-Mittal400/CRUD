import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('../(dashboard)');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    // Google login logic
    console.log('Google login');
  };

  const handleAppleLogin = () => {
    // Apple login logic
    console.log('Apple login');
  };

  return (
    <>
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
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.subtitleText}>Sign in to continue to your account</Text>
            </View>

            <View style={styles.shadowWrapper}>
              <BlurView intensity={100} tint="dark" style={styles.card}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.cardGradient}
                >
                  <View style={styles.formContainer}>
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

                    <TouchableOpacity style={styles.forgotPassword}>
                      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.signInBtn, isLoading && styles.signInBtnLoading]} 
                      onPress={handleLogin}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.signInGradient}
                      >
                        {isLoading ? (
                          <View style={styles.loadingContainer}>
                            <Text style={styles.signInText}>Signing In...</Text>
                          </View>
                        ) : (
                          <Text style={styles.signInText}>Sign In</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>or continue with</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialContainer}>
                      <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleLogin}>
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

                      <TouchableOpacity style={styles.socialBtn} onPress={handleAppleLogin}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                          style={styles.socialGradient}
                        >
                          <FontAwesome name="apple" size={20} color="#fff" />
                          <Text style={styles.socialText}>Apple</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.footerLink}>Sign up for free</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
      </SafeAreaView>
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
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '400',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  signInBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  signInBtnLoading: {
    opacity: 0.8,
  },
  signInGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInText: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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


