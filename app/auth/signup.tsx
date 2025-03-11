import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  useColorScheme, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Check } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { signUp } from '../../lib/auth';
import { router } from 'expo-router';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { translations: t } = useLanguageStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else {
      newErrors.name = '';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    } else {
      newErrors.email = '';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await signUp(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('already registered')) {
          Alert.alert('Signup Failed', 'This email is already registered. Please use a different email or try logging in.');
        } else {
          Alert.alert('Signup Failed', error.message);
        }
      } else {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully. Please sign in with your credentials.',
          [
            { 
              text: 'OK', 
              onPress: () => router.replace('/auth') 
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Create Account
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              Join KisanAI and revolutionize your farming
            </Text>
          </View>

          <View style={[styles.formContainer, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
            <View style={styles.inputContainer}>
              <User size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: isDark ? '#FFFFFF' : '#000000', 
                    borderColor: errors.name ? '#FF6B6B' : isDark ? '#444444' : '#DDDDDD' 
                  }
                ]}
                placeholder="Full Name"
                placeholderTextColor={isDark ? '#999999' : '#999999'}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <View style={styles.inputContainer}>
              <Mail size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: isDark ? '#FFFFFF' : '#000000', 
                    borderColor: errors.email ? '#FF6B6B' : isDark ? '#444444' : '#DDDDDD' 
                  }
                ]}
                placeholder="Email"
                placeholderTextColor={isDark ? '#999999' : '#999999'}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <View style={styles.inputContainer}>
              <Lock size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: isDark ? '#FFFFFF' : '#000000', 
                    borderColor: errors.password ? '#FF6B6B' : isDark ? '#444444' : '#DDDDDD' 
                  }
                ]}
                placeholder="Password"
                placeholderTextColor={isDark ? '#999999' : '#999999'}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
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
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <View style={styles.inputContainer}>
              <Lock size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: isDark ? '#FFFFFF' : '#000000', 
                    borderColor: errors.confirmPassword ? '#FF6B6B' : isDark ? '#444444' : '#DDDDDD' 
                  }
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={isDark ? '#999999' : '#999999'}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                ) : (
                  <Eye size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <View style={styles.termsContainer}>
              <Check size={16} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.termsText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                By signing up, you agree to our{' '}
                <Text style={{ color: isDark ? '#7CFC00' : '#006400', fontWeight: '500' }}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={{ color: isDark ? '#7CFC00' : '#006400', fontWeight: '500' }}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: isDark ? '#7CFC00' : '#006400' }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>{t.signUp}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginLinkContainer}>
            <Text style={[styles.loginLinkText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              {t.haveAccount}
              <Text 
                style={{ color: isDark ? '#7CFC00' : '#006400', fontWeight: 'bold' }}
                onPress={() => router.replace('/auth')}
              >
                {' '}{t.login}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 45,
    fontSize: 16,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  termsText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  submitButton: {
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
  },
});