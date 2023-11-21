import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import React, { useContext } from 'react';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';

export default function ScoutPage() {
  const { user } = useContext(AuthContext);
  return (
    <View style={Styles.column30}>
      <Image style={styles.image} source={require("../assets/loginlogo.jpg")} />
      <View id="textBlock">
        <View style={Styles.groupLeft}>
          <Text style={[Styles.mediumTitle, styles.loginTitle]}>Welcome {user}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNotes: {
    marginTop: 60,
    marginBottom: 100,
  },
  loginTitle: {
    marginTop: 30,
    marginBottom: 12,
  },
  image: {
    width: 192,
    height: 51.5,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 100,
  },
});