import { StyleSheet, Text, View, Image, Pressable, Platform } from 'react-native';

import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../components/AuthProvider';
import { INFO, LOG } from '../logConfig';
import AppColors from '../styles/AppColors';

export default function ScoutPageGame({ gameState, setGameState, maxGameTime }) {
    const { appVariables, colorDict } = useContext(AuthContext);

    const { game, blobDict } = appVariables;
    const { counterDefs } = game;

    const [uriDict, setUriDict] = useState({});

    // selections[condition.id]: option.id
    const [selections, setSelections] = useState({});

    // create URIs from blobs when component mounts
    useEffect(() => {
        if (Platform.OS === 'android') {
            setUriDict({});
            return;
        }

        const createURIs = async () => {
            const uris = {};

            for (const id in blobDict) {
                const blob = blobDict[id].blob;
                const uri = blob ? URL.createObjectURL(blob) : null;
                uris[id] = uri;
            }

            setUriDict(uris);
        };

        createURIs();

        // Clean up object URLs when the component unmounts
        return () => {
            for (const id in uriDict) {
                const uri = uriDict[id];
                if (uri) {
                    URL.revokeObjectURL(uri);
                }
            }
        };
    }, []); // Run this effect only once when the component mounts

    // local helper functions
    const phaseCounterDefs = phase => counterDefs.filter(def => def.gamePhases.includes(phase.key));
    const phaseDefs4 = phase => phaseCounterDefs(phase).filter(def => def.conditions.length > 1);
    const phaseDefs1 = phase => phaseCounterDefs(phase).filter(def => def.conditions.length === 1);

    const optionColors = (option, buttonState) => {
        const bgColorID = option.colorIDs[buttonState] || appVariables.defaultColorIDs[buttonState];
        const bgColor = colorDict[bgColorID];
        const fgHexColor = bgColor?.contrastColor === 'Light' ? AppColors.contrastLight : AppColors.contrastDark;
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
    };

    const displayOption = (option, buttonState, onPress) => {
        const imageUri = uriDict[option.id];

        const buttonColorState = buttonState === 'active' && imageUri ? 'image' : buttonState;
        const [bgHexColor, fgHexColor] = optionColors(option, buttonColorState);

        const text = (
            <Text
                style={[styles.optionText, { color: fgHexColor }]}
            >
                {option.name}
            </Text>
        );
        const image = (
            imageUri
            && <Image
                style={[styles.buttonImage, { width: imageHeight(option), height: imageHeight(option) }]}
                source={{ uri: imageUri }}
            />
        );

        return (
            <View
                style={[
                    styles.optionContainer,
                    { minHeight: optionContainerHeight(option) },
                ]}
                key={option.id}>
                <Pressable
                    style={[styles.optionButton, { backgroundColor: bgHexColor }]}
                    onPress={() => onPress(option)}
                    disabled={buttonState === 'inactive'}
                >
                    {image || text}
                </Pressable>
            </View>
        );
    };

    const displayCondition = (def, conditionType, onTrigger, enabled = true) => {
        const conditionsThisType = def.conditions.filter(cond => cond.type === conditionType);
        const cond = conditionsThisType.length > 0 ? conditionsThisType[0] : null;

        if (!cond) return (<View style={styles.conditionCol} />);

        const { scoutDisplayName } = def;
        const selectedOptionID = selections[cond.id]?.optionID;

        const onPress = option => {
            let newSelections = { ...selections };
            if (selectedOptionID === option.id) newSelections[cond.id] = null;
            else newSelections[cond.id] = { optionID: option.id, conditionID: cond.id, type: cond.type };

            if (cond.type === 'Trigger') onTrigger(option);
            else setSelections(newSelections);
        };

        return (
            <View style={styles.conditionCol}>
                {scoutDisplayName && <Text>{cond.name}</Text>}
                {cond.options.map(option => {
                    let buttonState;
                    if (!enabled) buttonState = 'inactive';
                    else if (!selectedOptionID) buttonState = 'active';
                    else if (selectedOptionID === option.id) buttonState = 'selected';
                    else buttonState = 'inactive';

                    return displayOption(option, buttonState, onPress);
                })}
            </View>
        );
    };

    const displayCounterDef = (def, columns = 4) => {
        const myConditions = def.conditions.filter(cond => cond);
        const mySelections = myConditions.map(cond => selections[cond.id]).filter(sel => sel);
        const mySelectionsDict = mySelections.reduce((dict, sel) => {
            dict[sel.type] = sel.optionID;
            return dict;
        }, {});
        const enabled = mySelections.length >= myConditions.length - 1;

        const onTrigger = (triggerOption) => {
            const count = {
                condition1: mySelectionsDict['Condition 1'],
                condition2: mySelectionsDict['Condition 2'],
                condition3: mySelectionsDict['Condition 3'],
                trigger: triggerOption.id,
                game_phase: gameState.phase.display,
                counter: def.id,
                match_time: gameState.startTime ? maxGameTime - ((new Date() - gameState.startTime) / 1000) : 300,
            };

            const newGameState = { ...gameState, counts: [...gameState.counts, count] }
            setGameState(newGameState);
            INFO('trigger', { counts: newGameState.counts });
        };

        if (columns === 4) {
            return (
                <View style={styles.counterRow} key={def.id}>
                    {displayCondition(def, "Condition 1", onTrigger)}
                    {displayCondition(def, "Condition 2", onTrigger)}
                    {displayCondition(def, "Condition 3", onTrigger)}
                    {displayCondition(def, "Trigger", onTrigger, enabled)}
                </View>
            )
        } else {
            return (
                <View style={styles.counterCol} key={def.id}>
                    {displayCondition(def, "Trigger", onTrigger)}
                </View>
            )
        }
    };

    return (
        <View style={styles.scoutMain4}>
            {phaseDefs4(gameState.phase).map(def => displayCounterDef(def))}
            <View style={styles.scoutMain1}>
                {phaseDefs1(gameState.phase).map(def => displayCounterDef(def, 1))}
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    scoutMain4: {
        flexDirection: 'column',
        flex: 1,
        minWidth: "100%",
    },
    scoutMain1: {
        flexDirection: 'row',
        justifyContent: 'center',
        // flex: 1,
        minWidth: "100%",
    },
    counterRow: {
        flexDirection: 'row',
        color: AppColors.bodyText,
    },
    counterCol: {
        flexDirection: 'row',
        color: AppColors.bodyText,
    },
    conditionCol: {
        flexDirection: 'column',
        flex: 1,
        margin: 5,
    },
    optionContainer: {
        maxHeight: 35,
        minHeight: 35,
        minWidth: 70,
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
        userSelect: 'none',
    },
    buttonImage: {
        alignSelf: 'center',
    },
});