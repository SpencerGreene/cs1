import { StyleSheet, Text, View, TextInput } from 'react-native';

import React, { useContext } from 'react';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';
import TeamPicker3 from '../components/TeamPicker3';

export default function ScoutPageSelect({ gameState, setGameState }) {
    const { eventInfo } = useContext(AuthContext);
    const { matches } = eventInfo;

    const setSelectedTeam = teamNumT => {
        setGameState({ ...gameState, scoutTeamNumT: teamNumT });
    }

    return (
        <View id="textBlock">
            <View style={Styles.groupLeft}>
                <Text style={[Styles.bodyText]}>Event: {eventInfo?.eventKey} {eventInfo?.event?.name}</Text>
                <Text style={[Styles.bodyText]}>Match: {gameState?.matchType} {gameState?.matchNumber}</Text>
                <Text style={[Styles.bodyText]}>Team: {gameState?.scoutTeamNumT}</Text>
                <Text style={[Styles.bodyText]}>
                    Match 1 blue:{' '}
                    {matches && matches[gameState.matchNumber]?.alliances?.blue?.team_keys?.join(', ')}
                </Text>
                <Text style={[Styles.bodyText]}>
                    Match 1 red:{' '}
                    {matches && matches[gameState.matchNumber]?.alliances?.red?.team_keys?.join(', ')}
                </Text>
                <TeamPicker3
                    alliance='red'
                    choices={ matches[gameState.matchNumber].alliances.red.team_keys }
                    onOptionSelect={setSelectedTeam}
                />
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