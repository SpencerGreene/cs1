import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

import React, { useContext, useEffect } from 'react';

import { AuthContext } from '../components/AuthProvider';
import { LOG } from '../logConfig';
import AppColors from '../styles/AppColors';

export default function ScoutPageGame({ gameState, setGameState, appVariables, colorDict }) {
    const { userInfo } = useContext(AuthContext);

    const { game } = appVariables;
    const { counterDefs } = game;
    const phaseCounterDefs = phase => counterDefs.filter(def => def.gamePhases.includes(phase.key));
    const counterCondition = (def, conditionType) => {
        const matches = def.conditions.filter(cond => cond.type === conditionType);
        return matches.length > 0 ? matches[0] : null;
    };
    const optionColors = (option, buttonState) => {
        const bgColorID = option.colorIDs[buttonState] || appVariables.defaultColorIDs[buttonState];
        const bgColor = colorDict[bgColorID];
        const fgHexColor = bgColor.contrastColor === 'Light' ? AppColors.contrastLight : AppColors.contrastDark;
        const bgHexColor = bgColor.hexColor;
        return [bgHexColor, fgHexColor];
    };
    const optionContainerHeight = option => {
        const height1x = 35;
        if (option.height === '3x') return 3 * height1x;
        if (option.height === '2x') return 2 * height1x;
        return height1x;
    };
    const imageHeight = option => {
        const height1x = 35;
        if (option.height === '3x') return 2 * height1x;
        if (option.height === '2x') return 2 * height1x - 20;
        return height1x - 10;
    }

    const displayOption = option => {
        const [bgHexColor, fgHexColor] = optionColors(option, 'active');
        const text = (<Text style={[styles.optionText, {color: fgHexColor}]}>{option.name}</Text>);

        const image = (
            option.imagePointer 
            && <Image 
                style={[styles.buttonImage, {width: imageHeight(option), height: imageHeight(option)}]} 
                source={{uri: 'http:' + option.imagePointer}} 
            />
        ); 

        return (
            <View style={[styles.optionContainer, {minHeight: optionContainerHeight(option)}]} key={option.id}>
                <Pressable style={[styles.optionButton, {backgroundColor: bgHexColor}]}>
                    {image || text}
                </Pressable>
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
        color: 'black',
    },
    conditionCol: {
        flexDirection: 'column',
        flex: 1,
        margin: 5,
    },
    optionContainer: {
        maxHeight: 35,
        minHeight: 35,
    },
    optionButton: {
        flex: 1, 
        minWidth: '100%',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 13,
        alignSelf: 'center',
    },
    buttonImage: {
        alignSelf: 'center',
    },
});