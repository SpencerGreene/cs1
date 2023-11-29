import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

import React, { useContext, useEffect } from 'react';
import Button from '../components/Button';
import BubbleApi from '../api/BubbleApi';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';
import BlueAllianceApi from '../api/BlueAllianceApi';

export default function ScoutPageSelect() {
    const {
        userInfo, 
        logout,
        appVariables,
        eventInfo,
    } = useContext(AuthContext);

    return (
        <View style={Styles.column30}>
            <Image style={styles.image} source={require("../assets/loginlogo.jpg")} />
            <View id="textBlock">
                <View style={Styles.groupLeft}>
                    <Text style={[Styles.mediumTitle, styles.loginTitle]}>Welcome {userInfo.name}</Text>
                    <Text style={[Styles.bodyText]}>Event: {appVariables.eventKey}</Text>
                    <Text style={[Styles.bodyText]}>
                        Match 1 blue: {eventInfo[1]?.alliances?.blue?.team_keys?.join(', ')}
                    </Text>
                    <Text style={[Styles.bodyText]}>
                        Match 1 red: {eventInfo[1]?.alliances?.red?.team_keys?.join(', ')}
                    </Text>
                    <Button label="Log out" theme="primary" onPress={logout} />
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