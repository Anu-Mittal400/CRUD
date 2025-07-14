
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast, { BaseToastProps } from 'react-native-toast-message';

export const toastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toast, styles.successToast]}>
      <Ionicons name="checkmark-circle" size={22} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1 || 'Success!'}</Text>
        {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
      </View>
    </View>
  ),
  
  error: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toast, styles.errorToast]}>
      <Ionicons name="close-circle" size={22} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1 || 'Error!'}</Text>
        {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
      </View>
    </View>
  ),
  
  info: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toast, styles.infoToast]}>
      <Ionicons name="information-circle" size={22} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1 || 'Info!'}</Text>
        {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
      </View>
    </View>
  ),
  
  warning: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toast, styles.warningToast]}>
      <Ionicons name="warning" size={22} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1 || 'Warning!'}</Text>
        {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
      </View>
    </View>
  ),
};

export function ToastProvider() {
  return <Toast config={toastConfig} />;
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  icon: {
    marginRight: 12,
  },
  
  textContainer: {
    flex: 1,
  },
  
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
  },
  
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    marginTop: 2,
  },
  
  successToast: {
    backgroundColor: '#10B981', // Clean green
  },
  
  errorToast: {
    backgroundColor: '#EF4444', // Clean red
  },
  
  infoToast: {
    backgroundColor: '#3B82F6', // Clean blue
  },
  
  warningToast: {
    backgroundColor: '#F59E0B', // Clean orange
  },
});
