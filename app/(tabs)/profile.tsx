import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Phone, Mail, LogOut, CreditCard as Edit2, Save, Languages } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { supabase, getFarmerProfile, updateFarmerProfile, Farmer } from '../../lib/supabase';
import { signOut } from '../../lib/auth';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language, setLanguage, translations: t } = useLanguageStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState<Farmer>({
    id: '123',
    user_id: 'user123',
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@example.com',
    location: 'Pune, Maharashtra',
    farm_size: '5 acres',
    crops: ['Rice', 'Wheat', 'Sugarcane'],
    soil_type: 'Black soil (Regur)',
    water_source: 'Canal irrigation',
    preferred_language: language,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const [editedProfile, setEditedProfile] = useState<Farmer>({...profile});

  // In a real app, we would fetch the profile from the database
  useEffect(() => {
    // This would be replaced with a real API call
    // const fetchProfile = async () => {
    //   setLoading(true);
    //   const user = await supabase.auth.getUser();
    //   if (user && user.data.user) {
    //     const farmerProfile = await getFarmerProfile(user.data.user.id);
    //     if (farmerProfile) {
    //       setProfile(farmerProfile);
    //       setEditedProfile(farmerProfile);
    //       // Set the language from the profile
    //       setLanguage(farmerProfile.preferred_language);
    //     }
    //   }
    //   setLoading(false);
    // };
    // fetchProfile();
  }, []);

  const toggleEdit = async () => {
    if (isEditing) {
      // Save changes
      setLoading(true);
      
      // Update language preference if changed
      if (editedProfile.preferred_language !== language) {
        editedProfile.preferred_language = language;
      }
      
      // In a real app, we would update the database
      // const updated = await updateFarmerProfile(profile.id, editedProfile);
      // if (updated) {
      //   setProfile(updated);
      // } else {
      //   Alert.alert('Error', 'Failed to update profile');
      // }
      
      setProfile(editedProfile);
      setLoading(false);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'English' ? 'Hindi' : 'English';
    setLanguage(newLanguage);
    
    // Update the profile language preference
    if (isEditing) {
      setEditedProfile({
        ...editedProfile,
        preferred_language: newLanguage
      });
    } else {
      setProfile({
        ...profile,
        preferred_language: newLanguage
      });
    }
  };

  const handleLogout = async () => {
    // In a real app, we would sign out
    // await signOut();
    Alert.alert('Logged out', 'You have been logged out successfully');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' }} 
              style={styles.profileImage}
            />
          </View>
          <Text style={[styles.profileName, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.name}</Text>
          <Text style={[styles.profileLocation, { color: isDark ? '#BBBBBB' : '#666666' }]}>{profile.location}</Text>
          
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: isDark ? '#444444' : '#EEEEEE' }]}
            onPress={toggleEdit}
            disabled={loading}
          >
            {isEditing ? (
              <Save size={16} color={isDark ? '#7CFC00' : '#006400'} />
            ) : (
              <Edit2 size={16} color={isDark ? '#7CFC00' : '#006400'} />
            )}
            <Text style={[styles.editButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              {isEditing ? t.save : t.edit}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.personalInfo}</Text>
          
          <View style={styles.infoItem}>
            <User size={20} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.name}:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
                value={editedProfile.name}
                onChangeText={(text) => handleChange('name', text)}
              />
            ) : (
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.name}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Phone size={20} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.phone}:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
                value={editedProfile.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.phone}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={20} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.email}:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
                value={editedProfile.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
              />
            ) : (
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.email}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <MapPin size={20} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.location}:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
                value={editedProfile.location}
                onChangeText={(text) => handleChange('location', text)}
              />
            ) : (
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.location}</Text>
            )}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.farmDetails}</Text>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.farmSize}:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
                value={editedProfile.farm_size}
                onChangeText={(text) => handleChange('farm_size', text)}
              />
            ) : (
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.farm_size}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.crops}:</Text>
            <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              {profile.crops.join(', ')}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.soilType}:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
                value={editedProfile.soil_type}
                onChangeText={(text) => handleChange('soil_type', text)}
              />
            ) : (
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.soil_type}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.waterSource}:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
                value={editedProfile.water_source}
                onChangeText={(text) => handleChange('water_source', text)}
              />
            ) : (
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{profile.water_source}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.languageButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
          onPress={toggleLanguage}
        >
          <Languages size={20} color={isDark ? '#7CFC00' : '#006400'} />
          <Text style={[styles.languageButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {t.switchLanguage}: {language}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>{t.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileLocation: {
    fontSize: 16,
    marginTop: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 15,
  },
  editButtonText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  section: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 16,
    marginLeft: 10,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginLeft: 5,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
  },
});