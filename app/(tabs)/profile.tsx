import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Phone, Mail, LogOut, CreditCard as Edit2, Save, Languages, GanttChart, Droplet } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { supabase, getFarmerProfile, updateFarmerProfile, Farmer } from '../../lib/supabase';
import { signOut } from '../../lib/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language, setLanguage, translations: t } = useLanguageStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  
  const [profile, setProfile] = useState<Farmer>({
    id: '',
    user_id: '',
    name: 'Loading...',
    phone: 'Loading...',
    email: 'Loading...',
    location: 'Loading...',
    farm_size: 'Loading...',
    crops: ['Loading...'],
    soil_type: 'Loading...',
    water_source: 'Loading...',
    preferred_language: language,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const [editedProfile, setEditedProfile] = useState<Farmer>({...profile});

  // Fetch the user's profile from Supabase
  useEffect(() => {
    async function fetchProfile() {
      setFetchingProfile(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Try to get the farmer profile
          const { data, error } = await supabase
            .from('farmer_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (data) {
            // Profile exists
            setProfile({
              ...data,
              id: data.id || '',
              user_id: data.user_id || user.id,
              name: data.name || user.email?.split('@')[0] || 'User',
              phone: data.phone || '+91 9876543210',
              email: data.email || user.email || '',
              location: data.location || 'Unknown',
              farm_size: data.farm_size || '5 acres',
              crops: data.crops || ['Rice', 'Wheat', 'Sugarcane'],
              soil_type: data.soil_type || 'Black soil (Regur)',
              water_source: data.water_source || 'Canal irrigation',
              preferred_language: data.preferred_language || language,
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString()
            });
          } else if (error) {
            // No profile yet, create a default one
            const defaultProfile: Partial<Farmer> = {
              user_id: user.id,
              name: user.email?.split('@')[0] || 'User',
              phone: '+91 9876543210',
              email: user.email || '',
              location: 'Pune, Maharashtra',
              farm_size: '5 acres',
              crops: ['Rice', 'Wheat', 'Sugarcane'],
              soil_type: 'Black soil (Regur)',
              water_source: 'Canal irrigation',
              preferred_language: language,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            const { data: newProfile, error: createError } = await supabase
              .from('farmer_profiles')
              .insert([defaultProfile])
              .select()
              .single();
              
            if (newProfile) {
              setProfile(newProfile as Farmer);
            } else {
              console.error('Error creating profile:', createError);
            }
          }
        } else {
          // No user is logged in, redirect to login
          router.replace("/auth" as any);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    }
    
    fetchProfile();
  }, [language]);

  // Update the edited profile when the profile changes
  useEffect(() => {
    setEditedProfile({...profile});
  }, [profile]);

  const toggleEdit = async () => {
    if (isEditing) {
      // Save changes
      setLoading(true);
      
      try {
        // Update the profile in Supabase
        const { data: updatedProfile, error } = await supabase
          .from('farmer_profiles')
          .update({
            name: editedProfile.name,
            phone: editedProfile.phone,
            email: editedProfile.email,
            location: editedProfile.location,
            farm_size: editedProfile.farm_size,
            soil_type: editedProfile.soil_type,
            water_source: editedProfile.water_source,
            preferred_language: language,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', profile.user_id)
          .select()
          .single();
          
        if (updatedProfile) {
          setProfile(updatedProfile as Farmer);
          Alert.alert('Success', 'Profile updated successfully');
        } else if (error) {
          console.error('Error updating profile:', error);
          Alert.alert('Error', 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (field: keyof Farmer, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        Alert.alert('Error', 'Failed to sign out');
      } else {
        // Redirect to login
        router.replace("/auth" as any);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const ProfileItem = ({ 
    icon, 
    label, 
    value, 
    editable = true, 
    keyboardType = 'default' 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    editable?: boolean; 
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad'; 
  }) => (
    <View style={[styles.profileItem, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={[styles.label, { color: isDark ? '#BBBBBB' : '#666666' }]}>{label}</Text>
      </View>
      {isEditing && editable ? (
        <TextInput
          style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#E0E0E0' }]}
          value={value}
          onChangeText={(text) => handleChange(label.toLowerCase().replace(':', '') as keyof Farmer, text)}
          keyboardType={keyboardType}
          placeholderTextColor={isDark ? '#666666' : '#AAAAAA'}
        />
      ) : (
        <Text style={[styles.value, { color: isDark ? '#FFFFFF' : '#000000' }]}>{value}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#0F3443', '#34E89E'] : ['#56ab2f', '#a8e063']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' }} 
                style={styles.profileImage}
              />
              <View style={styles.textInfo}>
                <Text style={[styles.profileName, { color: '#FFFFFF' }]}>
                  {isEditing ? editedProfile.name : profile.name}
                </Text>
                <Text style={styles.profileRole}>{t.farmer || "Smallholder Farmer"}</Text>
                <Text style={styles.profileLocation}>
                  <MapPin size={14} color="#FFFFFF80" /> {isEditing ? editedProfile.location : profile.location}
                </Text>
              </View>
            </View>
            
            <View style={styles.actions}>
              <LanguageSwitcher buttonStyle={styles.languageToggle} />
              
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: '#FFFFFF20' }]}
                onPress={toggleEdit}
                disabled={loading}
              >
                {isEditing ? (
                  <Save size={22} color="#FFFFFF" />
                ) : (
                  <Edit2 size={22} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.developerBadge}>
            <Text style={styles.developerText}>TOJIN VARKEY SIMSON</Text>
          </View>
        </LinearGradient>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, isEditing ? styles.saveButton : styles.editButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={toggleEdit}
            disabled={loading || fetchingProfile}
          >
            {isEditing ? (
              <Save size={16} color="#FFFFFF" />
            ) : (
              <Edit2 size={16} color="#FFFFFF" />
            )}
            <Text style={styles.actionButtonText}>
              {isEditing ? t.save : t.edit}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogout}
            disabled={loading}
          >
            <LogOut size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{t.logout}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.personalInfo}
          </Text>
          
          <View style={styles.cardShadow}>
            <ProfileItem 
              icon={<User size={20} color={isDark ? '#7CFC00' : '#4CAF50'} />}
              label={t.name}
              value={isEditing ? editedProfile.name : profile.name}
            />
            
            <ProfileItem 
              icon={<Phone size={20} color={isDark ? '#7CFC00' : '#4CAF50'} />}
              label={t.phone}
              value={isEditing ? editedProfile.phone : profile.phone}
              keyboardType="phone-pad"
            />
            
            <ProfileItem 
              icon={<Mail size={20} color={isDark ? '#7CFC00' : '#4CAF50'} />}
              label={t.email}
              value={isEditing ? editedProfile.email : profile.email}
              keyboardType="email-address"
            />
            
            <ProfileItem 
              icon={<MapPin size={20} color={isDark ? '#7CFC00' : '#4CAF50'} />}
              label={t.location}
              value={isEditing ? editedProfile.location : profile.location}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.farmDetails}
          </Text>
          
          <View style={styles.cardShadow}>
            <ProfileItem 
              icon={<GanttChart size={20} color={isDark ? '#7CFC00' : '#4CAF50'} />}
              label={t.farmSize}
              value={isEditing ? editedProfile.farm_size : profile.farm_size}
            />
            
            <ProfileItem 
              icon={<Droplet size={20} color={isDark ? '#7CFC00' : '#4CAF50'} />}
              label={t.soilType}
              value={isEditing ? editedProfile.soil_type : profile.soil_type}
            />
            
            <ProfileItem 
              icon={<Droplet size={20} color={isDark ? '#7CFC00' : '#4CAF50'} />}
              label={t.waterSource}
              value={isEditing ? editedProfile.water_source : profile.water_source}
            />
          </View>
          
          <View style={[styles.cropsContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={[styles.cropsLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.crops}:</Text>
            <View style={styles.cropTags}>
              {profile.crops.map((crop, index) => (
                <View 
                  key={index} 
                  style={[styles.cropTag, { backgroundColor: isDark ? '#2D2D2D' : '#F1F7ED' }]}
                >
                  <Text style={[styles.cropText, { color: isDark ? '#7CFC00' : '#4CAF50' }]}>{crop}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#999999' : '#999999' }]}>
            KisanAI v1.0.0
          </Text>
          <Text style={[styles.footerDeveloper, { color: isDark ? '#7CFC00' : '#4CAF50' }]}>
            Developed by TOJIN VARKEY SIMSON
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileHeader: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  textInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileRole: {
    fontSize: 14,
    color: '#FFFFFF80',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: '#FFFFFF80',
    flexDirection: 'row',
    alignItems: 'center',
  },
  developerBadge: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  developerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  logoutButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cardShadow: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 150,
    textAlign: 'right',
  },
  cropsContainer: {
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropsLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  cropTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cropTag: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  cropText: {
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerDeveloper: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  languageToggle: {
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});