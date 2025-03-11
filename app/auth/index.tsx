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
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { signIn } from '../../lib/auth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { translations: t } = useLanguageStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
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
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        } else {
          Alert.alert('Login Failed', error.message);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
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
              {t.loginAccount}
            </Text>

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
                placeholder={t.password}
                placeholderTextColor={isDark ? '#999999' : '#999999'}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!showPassword}
                autoComplete="password"
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

            <TouchableOpacity 
              style={styles.forgotPasswordLink}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={[styles.forgotPasswordText, { color: isDark ? '#7CFC00' : '#006400' }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: isDark ? '#7CFC00' : '#006400' }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.submitButtonText}>{t.login}</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: isDark ? '#444444' : '#EEEEEE' }]} />
              <Text style={[styles.dividerText, { color: isDark ? '#BBBBBB' : '#666666' }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: isDark ? '#444444' : '#EEEEEE' }]} />
            </View>

            <TouchableOpacity 
              style={[styles.signupButton, { borderColor: isDark ? '#7CFC00' : '#006400' }]}
              onPress={() => router.push('/auth/signup')}
            >
              <Text style={[styles.signupButtonText, { color: isDark ? '#7CFC00' : '#006400' }]}>
                {t.createAccount}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.languageSelector}>
            <Text style={[styles.languageText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              {t.availableIn}
              <Text style={{ color: isDark ? '#7CFC00' : '#006400' }}> {t.languages}</Text>
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
    textAlign: 'center',
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
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
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
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  signupButton: {
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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