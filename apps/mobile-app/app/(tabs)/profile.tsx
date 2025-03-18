import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserData {
  name: string;
  email: string;
  role: string;
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "employee"
  });

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info Section */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(userData.name)}</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userData.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{userData.role}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={22} color="#4A4A4A" />
              <Text style={styles.infoText}>{userData.email}</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="lock-closed-outline" size={22} color="#4A4A4A" />
                <Text style={styles.settingText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9E9E9E" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={22} color="#4A4A4A" />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9E9E9E" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield-outline" size={22} color="#4A4A4A" />
                <Text style={styles.settingText}>Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121b2e',
  },
  header: {
    backgroundColor: '#192841',
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#263c5a',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A80F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A80F0',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
  },
  roleBadge: {
    backgroundColor: '#2980b9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 6,
  },
  roleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#253958',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#8a9bae',
    marginLeft: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#8a9bae',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#263c5a',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5252',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});

export default ProfileScreen;
