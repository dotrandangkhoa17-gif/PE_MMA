import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { MovieProvider } from './src/context/MovieContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// Tắt các cảnh báo dạng popup trên màn hình để chụp ảnh báo cáo sạch đẹp
LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MovieProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </MovieProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
