import { StyleSheet, Text, View, Image, Pressable, Platform } from 'react-native';

import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../components/AuthProvider';
import { LOG } from '../logConfig';
import AppColors from '../styles/AppColors';

export default function ScoutPageGame({ gameState, setGameState }) {
    const { userInfo, appVariables, setAppVariables, colorDict } = useContext(AuthContext);

    const { game, blobDict } = appVariables;
    const { counterDefs } = game;

    const [uriDict, setUriDict] = useState({});

    // selections[condition.id]: option.id
    const [selections, setSelections] = useState({});
    const [counts, setCounts] = useState([]);

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
        const selectedOption = selections[cond.id];

        const onPress = option => {
            let newSelections = { ...selections };
            if (selectedOption === option) newSelections[cond.id] = null;
            else newSelections[cond.id] = option;
            console.log({newSelections});

            if (cond.type === 'Trigger') onTrigger(option);
            else setSelections(newSelections);
        };

        return (
            <View style={styles.conditionCol}>
                {scoutDisplayName && <Text>{cond.name}</Text>}
                {cond.options.map(option => {
                    let buttonState;
                    if (!enabled) buttonState = 'inactive';
                    else if (!selectedOption) buttonState = 'active';
                    else if (selectedOption === option) buttonState = 'selected';
                    else buttonState = 'inactive';

                    return displayOption(option, buttonState, onPress);
                })}
            </View>
        );
    };

    const displayCounterDef = def => {
        const myConditions = def.conditions.filter(cond => cond);
        const mySelections = myConditions.map(cond => selections[cond.id]).filter(sel => sel);
        const enabled = mySelections.length >= myConditions.length - 1;

        console.log({myConditions, mySelections, enabled});

        const onTrigger = (triggerOption) => {

            LOG('trigger', {mySelections, trigger: triggerOption.name});
        }

        return (
            <View style={styles.counterRow} key={def.id}>
                {displayCondition(def, "Condition 1", onTrigger)}
                {displayCondition(def, "Condition 2", onTrigger)}
                {displayCondition(def, "Condition 3", onTrigger)}
                {displayCondition(def, "Trigger", onTrigger, enabled)}
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
        userSelect: 'none',
    },
    buttonImage: {
        alignSelf: 'center',
    },
});