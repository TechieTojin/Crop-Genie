import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AIAssistant = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Assistant</Text>
      <Text style={styles.description}>This is your AI farming assistant. Ask me anything about farming!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
  },
});

export default AIAssistant; 