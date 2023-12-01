// MatchPicker.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import AppColors from '../styles/AppColors';
import Styles from '../styles/Styles';

const MatchPicker = ({ onMatchSelect }) => {
    const [selectedMatchType, setSelectedMatchType] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleTypeClick = (matchType) => {
        setSelectedMatchType(matchType);
        onMatchSelect(matchType, selectedMatch);
    };

    const handleMatchText = (text) => {
        const matchNumber = parseInt(text);
        setSelectedMatch(matchNumber);
        onMatchSelect(selectedMatchType, matchNumber);
    };

    // useEffect(() => {
    //     setSelectedOption(null);
    // }, [resetSelectedOptions]);

    const matchTypeButton = (choice, index) => {
        return (
            <Pressable
                key={index}
                style={({ pressed }) => [
                    styles.optionButton,
                    selectedMatchType === choice ? styles.selectedButton['blue'] : null,
                    pressed && selectedMatchType === null ? styles.pressedButton : null,
                ]}
                onPress={() => handleTypeClick(choice)}
            >
                <Text style={[
                    styles.buttonText,
                    styles.buttonText['blue'],
                    selectedMatchType === choice ? styles.buttonText.selected : null,
                ]}>{choice}</Text>
            </Pressable>
        );
    };

    const matchNumberInput = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={Styles.bodyText}>qm_</Text>
                <TextInput
                    id="matchNumber"
                    style={Styles.textInput}
                    onChangeText={handleMatchText}
                />
            </View>
        );
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={styles.optionContainer}>
                {matchTypeButton('Practice', 0)}
                {matchTypeButton('Qual', 1)}
            </View>
            <View style={styles.optionContainer}>
                {selectedMatchType === 'Qual' && matchNumberInput()}
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        paddingLeft: 20,
    },
    optionButton: {
        backgroundColor: AppColors.background,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        minWidth: 60,
        borderWidth: 1,
        borderColor: AppColors.lightGray,
    },
    selectedButton: {
        red: {
            backgroundColor: AppColors.frcRed,
        },
        blue: {
            backgroundColor: AppColors.frcBlue,
        },
    },
    pressedButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        fontWeight: 600,
        red: {
            color: AppColors.frcRed,
        },
        blue: {
            color: AppColors.frcBlue,
        },
        selected: {
            color: AppColors.surface,
        }
    },
});

export default MatchPicker;
