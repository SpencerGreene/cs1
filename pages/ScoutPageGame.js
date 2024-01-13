import { StyleSheet, Text, View, Image, Pressable, Platform } from 'react-native';

import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../components/AuthProvider';
import { INFO, LOG } from '../logConfig';
import AppColors from '../styles/AppColors';
import { FLASH_MSEC } from '../config';

export default function ScoutPageGame({ gameState, setGameState, maxGameTime }) {
    const { appVariables, colorDict } = useContext(AuthContext);

    const { game, blobDict } = appVariables;
    const { counterDefs } = game;

    const [uriDict, setUriDict] = useState({});

    // selections[condition.id]: option.id
    const [selections, setSelections] = useState({});
    const [flashing, setFlashing] = useState([]);

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
                    else if (flashing.includes(option.id)) buttonState = 'flash';
                    else if (!selectedOptionID) buttonState = 'active';
                    else if (selectedOptionID === option.id) buttonState = 'selected';
                    else buttonState = 'inactive';

                    return displayOption(option, buttonState, onPress);
                })}
            </View>
        );
    };

    const flash = (conditions, msec) => {
        setFlashing([...flashing, ...conditions]);
        setTimeout(() => {
            setFlashing(flashing.filter(cond => !conditions.includes(cond)));
            // TODO - narrow to only this condition

            const newSelections = Object.fromEntries(
                Object.entries(selections)
                .filter(([conditionID, selection]) => !conditions.includes(selection.optionID))
            )
            INFO({selections, newSelections, conditions});

            setSelections(newSelections);
        }, msec);
    }

    const displayCounterDef = (def, columns = 4) => {
        const myConditions = def.conditions.filter(cond => cond);
        const mySelections = myConditions.map(cond => selections[cond.id]).filter(sel => sel);
        const mySelectionsDict = mySelections.reduce((dict, sel) => {
            dict[sel.type] = sel.optionID;
            return dict;
        }, {});
        const enabled = mySelections.length >= myConditions.length - 1;

        const onTrigger = (triggerOption) => {
            // the 'conditions' are actually selection option IDs.
            // using the name 'condition' here to match the Bubble data model for Count.
            const count = {
                condition1: mySelectionsDict['Condition 1'],
                condition2: mySelectionsDict['Condition 2'],
                condition3: mySelectionsDict['Condition 3'],
                trigger: triggerOption.id,
                game_phase: gameState.phase.display,
                counter: def.id,
                match_time: gameState.startTime ? maxGameTime - ((new Date() - gameState.startTime) / 1000) : 300,
            };
            count.conditions = 
                [ count.condition1, count.condition2, count.condition3, count.trigger ]
                .filter(cond => cond);

            const newGameState = { ...gameState, counts: [...gameState.counts, count] }
            setGameState(newGameState);
            flash(count.conditions, FLASH_MSEC);
            
            // TODO narrow this to only the current condition

            INFO('trigger', { counts: newGameState.counts, flash: count.conditions });
        };

        return (
            <View style={styles.counterRow} key={def.id}>
                {columns === 4 && displayCondition(def, "Condition 1", onTrigger)}
                {columns === 4 && displayCondition(def, "Condition 2", onTrigger)}
                {columns === 4 && displayCondition(def, "Condition 3", onTrigger)}
                {displayCondition(def, "Trigger", onTrigger, enabled)}
            </View>
        );

    };

    const displayUndo = () => {
        const { counts } = gameState;
        const { objDict } = appVariables;
        const counts3 = counts.slice(-3);
        return counts3.map((count, index) => (
            <Text key={index}>{objDict[count.trigger].option.name}</Text>
        ));
    }

    return (
        <View style={styles.scoutMain}>
            <View style={styles.scoutMain4}>
                {phaseDefs4(gameState.phase).map(def => displayCounterDef(def))}
            </View>
            <View style={styles.scoutMain1}>
                {phaseDefs1(gameState.phase).map(def => displayCounterDef(def, 1))}
            </View>
            <View style={styles.scoutUndo}>
                {displayUndo()}
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    scoutMain: {
        flex: 1,
        flexDirection: 'column',
        minWidth: "100%",
    },
    scoutMain4: {
        flex: 2,
        flexDirection: 'column',
        minWidth: "100%",
        borderWidth: 2,
    },
    scoutMain1: {
        flex: 2,
        flexDirection: 'row',
        minWidth: "100%",
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    scoutUndo: {
        flex: 1,
        flexDirection: 'column',
        minWidth: "100%",
        borderWidth: 2,
    },
    counterRow: {
        flexDirection: 'row',
        color: AppColors.bodyText,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: AppColors.medGray,
    },
    counterCol: {
        flexDirection: 'column',
        color: AppColors.bodyText,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: AppColors.frcRed,
        maxHeight: 50,
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