import { StyleSheet, Text, View, TextInput } from 'react-native';

import React, { useContext } from 'react';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';
import TeamPicker36 from '../components/TeamPicker6';
import MatchPicker from '../components/MatchPicker';

const label = (text, spacing) => (
    <Text style={[Styles.metadataLabel, { marginTop: spacing, marginBottom: 2 },]}>
        {text}
    </Text>
);

export default function ScoutPageSelect({ gameState, setGameState }) {
    const { eventInfo } = useContext(AuthContext);
    const { eventKey, matches } = eventInfo;

    const season = eventKey && eventKey.substring(0, 4);

    const setSelectedTeam = (teamNumT, color) => {
        setGameState({ ...gameState, scoutTeamNumT: teamNumT, allianceColor: color });
    };

    const eventBlock = () => (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                {label("Season", 0)}
                <Text style={[Styles.bodyText]}> {season} </Text >
            </View >
            <View style={{ flex: 2 }}>
                {label("Event", 0)}
                <Text style={[Styles.bodyText]}>{eventInfo?.event?.name}</Text >
            </View >
        </View >
    );

    const matchBlock = () => (
        <View>
            {label("Match", 30)}
            {/* <Text style={[Styles.bodyText]}>{gameState?.matchType} {gameState?.matchNumber}</Text> */}
            <MatchPicker onOptionSelect={() => alert('optionselect')} />
        </View>
    );

    const teamBlock = () => (
        <View>
            {label("Team", 30)}
            <TeamPicker36
                choicesRed={matches[gameState.matchNumber].alliances.red.team_keys}
                choicesBlue={matches[gameState.matchNumber].alliances.blue.team_keys}
                onOptionSelect={setSelectedTeam}
            />
        </View>
    );

    return (
        <View id="textBlock">
            <View style={Styles.groupLeft}>
                {eventBlock()}
                {matchBlock()}
                {matches && teamBlock()}
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