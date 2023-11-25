import { StyleSheet, Text, View, TextInput, Image, Linking, AsyncStorage } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';

import { AuthContext } from '../components/AuthProvider';
import Styles from '../styles/Styles';
import Button from '../components/Button';


export default function LoginPage() {

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const { login } = useContext(AuthContext);

  // const onPress = () => alert(`the login button was pressed with ${email} ${password}`);
  const onPress = () => login(email, password);

  useEffect(() => {
    // see if already logged in
    AsyncStorage.getItem('currentUser')
      .then(savedUser => {
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          BubbleApi.setToken(user.token);
        }
      });
  });

  return (
    <View style={Styles.column30}>
      <Image style={styles.image} source={require("../assets/loginlogo.jpg")} />
      <View id="loginBlock">
        <View style={Styles.groupLeft}>
          <Text style={[Styles.mediumTitle, styles.loginTitle]}>Log in</Text>
          <Text style={Styles.inputLabel}>Email</Text>
          <View style={Styles.inputView}>
            <TextInput
              id="email"
              style={Styles.textInput}
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          <Text style={Styles.inputLabel}>Password</Text>
          <View style={Styles.inputView}>
            <TextInput
              id="password"
              style={Styles.textInput}
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
        </View>
        <View style={Styles.groupCenter}>
          <Button label="Log in" theme="primary" onPress={onPress} />
        </View>
      </View>
      <View style={styles.bottomNotes} id="bottomNotes">
        <Text style={Styles.bodyText}>
          To sign up for a new account, or to reset your password, visit
          <Text style={{ color: 'blue' }}
            onPress={() => Linking.openURL('http://cookiescout2.bubbleapps.io')}>
            {' CookieScout on the web'}
          </Text>.
        </Text>
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