import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Styles from './styles/Styles';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <View style={Styles.container}>
      <LoginPage />
      <StatusBar style="auto" />
    </View>
  );
}


