import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  useColorScheme, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, Send } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { resetPassword } from '../../lib/auth';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { translations: t } = useLanguageStore();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Reset password error:', error);
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
              Reset Password
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>

          {success ? (
            <View style={[styles.successContainer, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
              <Send size={50} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.successTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                Email Sent!
              </Text>
              <Text style={[styles.successText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                We've sent password reset instructions to {email}. Please check your email.
              </Text>
              <TouchableOpacity 
                style={[styles.returnButton, { backgroundColor: isDark ? '#7CFC00' : '#006400' }]}
                onPress={() => router.replace('/auth')}
              >
                <Text style={styles.returnButtonText}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.formContainer, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
              <View style={styles.inputContainer}>
                <Mail size={20} color={isDark ? '#7CFC00' : '#006400'} style={styles.inputIcon} />
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      color: isDark ? '#FFFFFF' : '#000000', 
                      borderColor: error ? '#FF6B6B' : isDark ? '#444444' : '#DDDDDD' 
                    }
                  ]}
                  placeholder="Email"
                  placeholderTextColor={isDark ? '#999999' : '#999999'}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: isDark ? '#7CFC00' : '#006400' }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {!success && (
            <TouchableOpacity 
              style={styles.loginLinkContainer}
              onPress={() => router.replace('/auth')}
            >
              <Text style={[styles.loginLinkText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                Remember your password?{' '}
                <Text style={{ color: isDark ? '#7CFC00' : '#006400', fontWeight: 'bold' }}>
                  Login
                </Text>
              </Text>
            </TouchableOpacity>
          )}
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
    lineHeight: 22,
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
  },
  submitButton: {
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  successContainer: {
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  returnButton: {
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});