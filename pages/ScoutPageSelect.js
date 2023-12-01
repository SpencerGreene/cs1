import { StyleSheet, Text, View, TextInput } from 'react-native';

import React, { useContext, useEffect } from 'react';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';
import TeamPicker36 from '../components/TeamPicker6';
import MatchPicker from '../components/MatchPicker';

const label = (text, spacing) => (
    <Text style={[Styles.metadataLabel, { marginTop: spacing, marginBottom: 2 },]}>
        {text}
    </Text>
);

export default function ScoutPageSelect({ gameState, setGameState, appVariables }) {
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
        setGameState({ ...gameState, scoutTeamNumT: null, allianceColor: null,
            matchType, matchNumber, scoutSelectionValid 
        });
    };

    useEffect(() => {
        setSelectedTeam(null, null);
    }, [gameState.phase]);

    const eventBlock = () => (
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
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
            {label("Match", 55)}
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
            <View>
                {alliances && label("Team", 40)}
                <TeamPicker36
                    choicesRed ={alliances ? alliances.red.team_keys  : []}
                    choicesBlue={alliances ? alliances.blue.team_keys : []}
                    onOptionSelect={setSelectedTeam}
                    scoutTeamNumT={gameState.scoutTeamNumT}
                />
            </View>
        )
    };

    return (
        <View id="selectPage">
            <View style={Styles.groupLeft}>
                {eventBlock()}
                {matchBlock()}
                {matches && gameState.matchType === 'Qual' && teamBlock()}
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