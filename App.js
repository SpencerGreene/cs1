import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from './styles/AppColors';
import Styles from './styles/Styles';

import Button from './components/Button';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={Styles.column30}>
        <View style={Styles.groupLeft}>
          <Text style={[Styles.mediumTitle, styles.loginTitle]}>Log in</Text>
          <Text style={[Styles.inputLabel]}>Email</Text>
          <Text style={[Styles.inputLabel]}>Password</Text>
        </View>
        <View style={Styles.groupCenter}>
          <Button label="Log in" theme="primary" />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    alignItems: 'left',
    justifyContent: 'center',
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
  loginTitle: {
    marginTop: 30,
    marginBottom: 12,
  }
});
