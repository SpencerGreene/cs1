import { StyleSheet, Text, View } from 'react-native';

import React, { useContext, useEffect } from 'react';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';
import TeamPicker6 from '../components/TeamPicker6';
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

    const isValid = (matchType, matchNumber, teamNumT) =>
        matchType === 'Practice'
        || (matchType === 'Qual' && matchNumber > 0 && teamNumT > 0);

    const setSelectedTeam = (teamNumT, color) => {
        const scoutSelectionValid = isValid(gameState.matchType, gameState.matchNumber, teamNumT);
        setGameState({ ...gameState, scoutTeamNumT: teamNumT, allianceColor: color, scoutSelectionValid });
    };

    const setSelectedMatch = (matchType, matchNumber) => {
        const scoutSelectionValid = isValid(matchType, matchNumber, null);
        setGameState({
            ...gameState, scoutTeamNumT: null, allianceColor: null,
            matchType, matchNumber, scoutSelectionValid
        });
    };

    useEffect(() => {
        setSelectedTeam(null, null);
    }, [gameState.phase]);

    const eventBlock = () => (
        <View style={styles.eventBlock}>
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
        <View style={styles.matchBlock}>
            {label("Match", 0)}
            <MatchPicker
                eventInfo={eventInfo}
                onMatchSelect={setSelectedMatch}
                matchType={gameState.matchType}
                matchNumber={gameState.matchNumber}
            />
        </View>
    );

    const teamBlock = () => {
        const alliances = matches && gameState.matchNumber && matches[gameState.matchNumber]?.alliances;
        return (
            <View style={styles.teamBlock}>
                {alliances && label("Team", 0)}
                <TeamPicker6
                    choicesRed={alliances ? alliances.red.team_keys : []}
                    choicesBlue={alliances ? alliances.blue.team_keys : []}
                    onOptionSelect={setSelectedTeam}
                    scoutTeamNumT={gameState.scoutTeamNumT}
                />
            </View>
        )
    };

    return (
        <View id="selectPage" style={styles.container}>
            <View style={styles.eventBlock}>
                {eventBlock()}
            </View>

            <View style={styles.matchBlock}>
                {matchBlock()}
            </View>
            <View style={styles.teamBlock}>
                {matches && gameState.matchType === 'Qual' && teamBlock()}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        // justifyContent: 'space-between',
    },
    eventBlock: {
        flex: 2,
        flexDirection: 'row',
        marginTop: 10,
    },
    matchBlock: {
        flex: 2,
        // backgroundColor: 'red',
    },
    teamBlock: {
        flex: 4,
        justifyContent: 'center',
    },

});