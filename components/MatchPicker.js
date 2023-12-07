// MatchPicker.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import AppColors from '../styles/AppColors';
import Styles from '../styles/Styles';

const MatchPicker = ({ eventInfo, onMatchSelect, matchType, matchNumber }) => {
    const [selectedMatchType, setSelectedMatchType] = useState('');
    const [selectedMatch, setSelectedMatch] = useState(0);

    const handleTypeClick = (matchType) => {
        setSelectedMatchType(matchType);
        onMatchSelect(matchType, selectedMatch);
    };

    const handleMatchText = (text) => {
        const isNumber = !isNaN(parseInt(text));
        const matchNumber = isNumber ? parseInt(text) : null;
        setSelectedMatch(matchNumber);
        onMatchSelect(selectedMatchType, matchNumber);
    };

    useEffect(() => {
        if (matchType !== selectedMatchType) setSelectedMatchType(matchType);
        if (matchNumber !== selectedMatch) setSelectedMatch(matchNumber);
    }, [matchType, matchNumber]);

    const matchTypeButton = (choice, index) => {
        return (
            <Pressable
                key={index}
                style={({ pressed }) => [
                    styles.optionButton,
                    selectedMatchType === choice ? styles.selectedButton : null,
                    pressed && selectedMatchType === null ? styles.pressedButton : null,
                ]}
                onPress={() => handleTypeClick(choice)}
            >
                <Text style={[
                    styles.buttonText,
                    selectedMatchType === choice ? styles.buttonTextSelected : null,
                ]}>{choice}</Text>
            </Pressable>
        );
    };

    const matchNumberInput = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={Styles.bodyText}>{eventInfo.eventKey}_</Text>
                <TextInput
                    id="matchNumber"
                    style={styles.matchInput}
                    onChangeText={handleMatchText}
                    value={selectedMatch ? selectedMatch.toString() : ''}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        minWidth: '50%',
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
        backgroundColor: AppColors.frcBlue,
    },
    pressedButton: {
        backgroundColor: AppColors.medGray,
    },
    buttonText: {
        fontWeight: 600,
        color: AppColors.frcBlue,
    },
    buttonTextSelected: {
        color: AppColors.surface,
    },
    matchInput: {
        borderColor: AppColors.lightGray,
        height: 40,
        minWidth: 60,
        maxWidth: 60,
        paddingHorizontal: 10,
        marginLeft: 0,
        borderWidth: 1,
        borderRadius: 5,

    },
});

export default MatchPicker;
