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
                    <Text style={[Styles.bodyText]}>Event: {eventInfo?.eventKey} {eventInfo?.event?.name}</Text>
                    <Text style={[Styles.bodyText]}>Phase: {gameState?.phase.display}</Text>
                    <Text style={[Styles.bodyText]}>Match: {gameState?.matchType} {gameState?.matchNumber}</Text>
                    <Text style={[Styles.bodyText]}>Team: {gameState?.scoutTeamNumT}</Text>
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