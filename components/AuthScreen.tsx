import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react-native';
import { useLanguageStore } from '../store/languageStore';
import { signIn, signUp } from '../lib/auth';

export default function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { translations: t } = useLanguageStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [useEmail, setUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (useEmail && !formData.email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (!useEmail && !formData.phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    if (!formData.password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        // In a real app, we would sign in
        // const { data, error } = await signIn(formData.email, formData.password);
        // if (error) throw error;
        onLogin();
      } else {
        // In a real app, we would sign up
        // const { data, error } = await signUp(formData.email, formData.password);
        // if (error) throw error;
        // Alert.alert('Success', 'Account created successfully. Please sign in.');
        // setIsLogin(true);
        onLogin();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const toggleAuthMethod = () => {
    setUseEmail(!useEmail);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' }} 
          style={styles.logoImage}
        />
        <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#000000' }]}>KisanAI</Text>
        <Text style={[styles.tagline, { color: isDark ? '#BBBBBB' : '#666666' }]}>
          {t.tagline}
        </Text>
      </View>

      <View style={[styles.formContainer, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
        <Text style={[styles.formTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {isLogin ? t.loginAccount : t.createAccount}
        </Text>

        <TouchableOpacity 
          style={styles.authToggle}
          onPress={toggleAuthMethod}
        >
          <Text style={[styles.authToggleText, { color: isDark ? '#7CFC00' : '#006400' }]}>
            {useEmail ? t.usePhone : t.useEmail}
          </Text>
        </TouchableOpacity>

        {useEmail ? (
          <View style={styles.inputContainer}>
            <Mail size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
              placeholder="Email"
              placeholderTextColor={isDark ? '#999999' : '#999999'}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Phone size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
              placeholder="Phone Number"
              placeholderTextColor={isDark ? '#999999' : '#999999'}
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Lock size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
            placeholder={t.password}
            placeholderTextColor={isDark ? '#999999' : '#999999'}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            ) : (
              <Eye size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            )}
          </TouchableOpacity>
        </View>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Lock size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: isDark ? '#FFFFFF' : '#000000', borderColor: isDark ? '#444444' : '#DDDDDD' }]}
              placeholder={t.confirmPassword}
              placeholderTextColor={isDark ? '#999999' : '#999999'}
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry={!showPassword}
            />
          </View>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: isDark ? '#7CFC00' : '#006400' }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {isLogin ? t.login : t.signUp}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchModeButton}
          onPress={toggleAuthMode}
        >
          <Text style={[styles.switchModeText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
            {isLogin ? t.noAccount : t.haveAccount}
            <Text style={{ color: isDark ? '#7CFC00' : '#006400', fontWeight: 'bold' }}>
              {isLogin ? t.signUp : t.login}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.languageSelector}>
        <Text style={[styles.languageText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
          {t.availableIn}
          <Text style={{ color: isDark ? '#7CFC00' : '#006400' }}> {t.languages}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  authToggle: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  authToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 40,
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 14,
  },
  languageSelector: {
    marginTop: 30,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    textAlign: 'center',
  },
});