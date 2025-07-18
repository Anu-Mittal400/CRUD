import { useAuth } from '@/authcontext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, LogOut, Settings } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtectedRoute from '../routes/protectedroute';

export default function SettingsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const user = session?.user;

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ProtectedRoute>
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)')}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Profile */}
      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarText}>
            {user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.profileDisplayName}>{user?.user_metadata?.full_name || 'Anonymous'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      {/* Settings Item */}
      <View style={styles.settingsItem}>
        <Settings size={20} color="#10a37f" />
        <Text style={styles.settingsLabel}>General Settings</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity onPress={handleLogOut} style={styles.signOutButton}>
        <LogOut size={20} color="#ff4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10a37f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
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
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingsLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
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
    margin: 24,
  },
  signOutText: {
    color: '#ff4444',
    fontWeight: '600',
    marginLeft: 8,
  },
});

