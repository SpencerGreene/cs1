import React from 'react';
import { StatusBar } from 'expo-status-bar';

import MainPage from './pages/MainPage';
import { AuthProvider } from './components/AuthProvider';
import { AppRegistry } from 'react-native';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" barStyle="dark-content" />
      <MainPage />
    </AuthProvider>
  );
}

AppRegistry.registerComponent('main', () => App);
