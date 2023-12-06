import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

import React, { useContext, useEffect } from 'react';
import Button from '../components/Button';

import Styles from '../styles/Styles';
import { AuthContext } from '../components/AuthProvider';
import { LOG } from '../logConfig';

export default function ScoutPageGame({ gameState, setGameState, appVariables }) {
    const { userInfo } = useContext(AuthContext);

    const { game } = appVariables;
    const { counterDefs } = game;
    const phaseCounterDefs = phase => counterDefs.filter(def => def.gamePhases.includes(phase.key));
    const counterCondition = (def, conditionType) => {
        const matches = def.conditions.filter(cond => cond.type === conditionType);
        return matches.length > 0 ? matches[0] : null;
    };

    const displayOption = option => {
        LOG({option});
        return (
            <View style={styles.optionRow} key={option.id}>
                <Text>{option.name}</Text>
            </View>
        );
    };

    const displayCondition = cond => {
        return (
            <View style={styles.conditionCol}>
                {cond && <Text>{cond.name}</Text>}
                {cond && cond.options.map(option => displayOption(option))}
            </View>
        );
    };

    const displayCounterDef = def => {
        return (
            <View style={styles.counterRow} key={def.id}>
                {displayCondition(counterCondition(def, "Condition 1"))}
                {displayCondition(counterCondition(def, "Condition 2"))}
                {displayCondition(counterCondition(def, "Condition 3"))}
                {displayCondition(counterCondition(def, "Trigger"))}
            </View>
        )
    };

    return (
        <View style={styles.scoutMain}>
            {phaseCounterDefs(gameState.phase).map(def => displayCounterDef(def))}
        </View>
    );
}

const styles = StyleSheet.create({
    scoutMain: {
        flexDirection: 'column',
        flex: 1,
        minWidth: "100%",
    },
    counterRow: {
        flexDirection: 'row',
        flex: 1,
        minHeight: 100,
        maxHeight: 200,
        backgroundColor: '#fe7265',
        color: 'black',
    },
    conditionCol: {
        flexDirection: 'column',
        flex: 1,
        margin: 5,
        color: 'black',
        backgroundColor: 'white',
    },
    optionRow: {
        borderWidth: 1,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 35,
        minHeight: 35,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'blue',
        color: 'black',
    }
});