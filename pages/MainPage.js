import React, { useContext } from 'react';
import { View, SafeAreaView } from 'react-native';

import Styles from '../styles/Styles';
import ScoutPage from './ScoutPage';
import LoginPage from './LoginPage';
import { AuthContext } from '../components/AuthProvider';

export default function MainPage() {
  const { userInfo } = useContext(AuthContext);
  return (
    <SafeAreaView style={Styles.container}>
      { userInfo?.firstName ? <ScoutPage /> : <LoginPage /> }
    </SafeAreaView>
  );
}
