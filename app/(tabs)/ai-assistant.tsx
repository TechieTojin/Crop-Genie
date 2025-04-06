import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import AIAssistant from "../../components/AIAssistant";
import { useThemeStore } from '../../store/themeStore';

export default function AIAssistantScreen() {
  const { isDark } = useThemeStore();

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#121212' : '#f5f5f5' }
      ]}
      edges={['right', 'left']}
    >
      <View>
        <Text>AI Assistant Feature Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 