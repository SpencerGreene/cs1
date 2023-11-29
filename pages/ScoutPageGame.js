import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

import React, { useContext, useEffect } from 'react';
import Button from '../components/Button';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';

export default function ScoutPageGame() {
    const {
        userInfo, 
    } = useContext(AuthContext);

    return (
        <View style={Styles.column30}>
            <View id="textBlock">
                <View style={Styles.groupLeft}>
                    <Text style={[Styles.mediumTitle, styles.loginTitle]}>Scouting!{userInfo.name}</Text>
                    <Button label="Back" theme="primary" onPress={phaseBack} />
                    <Button label="Forward" theme="primary" onPress={phaseForward} />
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