import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ModalScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen 
        options={{
          title: 'Information',
          headerStyle: {
            backgroundColor: '#38B000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome5 name="times" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.content}>
        <FontAwesome5 name="info-circle" size={60} color="#38B000" style={styles.icon} />
        
        <Text style={styles.title}>Modal Info Screen</Text>
        
        <Text style={styles.description}>
          This is a modal screen that you can use to display important information
          or show temporary content without navigating away from the current screen.
        </Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Close Modal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#38B000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 