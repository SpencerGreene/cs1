import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../components/AuthProvider';
import { LOG } from '../logConfig';
import AppColors from '../styles/AppColors';

export default function ScoutPageGame({ gameState, setGameState }) {
    const { userInfo, appVariables, setAppVariables, colorDict } = useContext(AuthContext);
    const { blobDict } = appVariables;

    const { game } = appVariables;
    const { counterDefs } = game;

    const [uriDict, setUriDict] = useState({});

    // create URIs from blobs when component mounts
    useEffect(() => {
        const createURIs = async () => {
            const uris = {};

            for (const id in blobDict) {
                const blob = blobDict[id].blob;
                const uri = blob ? URL.createObjectURL(blob) : null;
                uris[id] = uri;
            }

            setUriDict(uris);
            console.log({uris});
        };

        createURIs();

        // Clean up object URLs when the component unmounts
        return () => {
            for (const id in imageURIs) {
                const uri = imageURIs[id];
                if (uri) {
                    URL.revokeObjectURL(uri);
                }
            }
        };
    }, []); // Run this effect only once when the component mounts

    // local helper functions
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
    };

    const displayOption = option => {
        const [bgHexColor, fgHexColor] = optionColors(option, 'active');
        const text = (<Text style={[styles.optionText, { color: fgHexColor }]}>{option.name}</Text>);

        const imageUri = uriDict[option.id];
        const image = (
            imageUri
            && <Image
                style={[styles.buttonImage, { width: imageHeight(option), height: imageHeight(option) }]}
                source={{ uri: imageUri }}
            />
        );

        return (
            <View style={[styles.optionContainer, { minHeight: optionContainerHeight(option) }]} key={option.id}>
                <Pressable style={[styles.optionButton, { backgroundColor: bgHexColor }]}>
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