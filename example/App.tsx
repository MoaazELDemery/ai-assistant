import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatScreen } from './src/views/ChatScreen';
import { LocaleProvider } from './src/contexts/LocaleContext';
import { LogBox } from 'react-native';

// Suppress deprecation warning for Expo AV as we are on the transition period
LogBox.ignoreLogs(['Expo AV has been deprecated']);

export default function App() {
  return (
    <LocaleProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <ChatScreen />
        </View>
      </SafeAreaProvider>
    </LocaleProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
