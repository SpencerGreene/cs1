import { StyleSheet, Text, View, TextInput } from 'react-native';

import React, { useContext } from 'react';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';

export default function ScoutPageSelect() {
    const {
        eventInfo,
    } = useContext(AuthContext);

    return (
        <View id="textBlock">
            <View style={Styles.groupLeft}>
                <Text style={[Styles.bodyText]}>Event: {eventInfo?.eventKey} {eventInfo?.event?.name}</Text>
                <Text style={[Styles.bodyText]}>
                    Match 1 blue:{' '}
                    {eventInfo.matches && eventInfo.matches[1]?.alliances?.blue?.team_keys?.join(', ')}
                </Text>
                <Text style={[Styles.bodyText]}>
                    Match 1 red:{' '}
                    {eventInfo.matches && eventInfo.matches[1]?.alliances?.red?.team_keys?.join(', ')}
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