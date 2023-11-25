import React, { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../components/AuthProvider';

import ScoutPage from './ScoutPage';
import LoginPage from './LoginPage';

const Stack = createStackNavigator();

export default function MainPage() {
  const { userInfo } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo?.detail?.first_text ? (
          <Stack.Screen name="ScoutPage" component={ScoutPage} />
        ) : (
          <Stack.Screen name="Login" component={LoginPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
