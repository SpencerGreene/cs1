// TeamPicker6.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AppColors from '../styles/AppColors';

const TeamPicker6 = ({ choicesRed, choicesBlue, onOptionSelect, scoutTeamNumT }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (choice, color) => {
        setSelectedOption(choice);
        onOptionSelect(choice, color);
    };

    const resetOption = () => {
        setSelectedOption(null);
    }

    useEffect(() => {
        if (scoutTeamNumT === null && selectedOption !== null) {
            setSelectedOption(null);
        }
    }, [scoutTeamNumT]);

    const teamButton = (teamKey, index, color) => {
        const choice = teamKey.substring(3);
        const isSelected = (selectedOption === choice);
        return (
            <Pressable
                key={index}
                style={({ pressed }) => [
                    styles.optionButton,
                    isSelected && color === 'red' ? styles.selectedButtonRed : null,
                    isSelected && color === 'blue' ? styles.selectedButtonBlue : null,
                    pressed && selectedOption === null ? styles.pressedButton : null,
                ]}
                onPress={() => handleOptionClick(choice, color)}
            >
                <Text style={[
                    styles.buttonText,
                    color === 'red' ? styles.buttonTextRed : null,
                    color === 'blue' ? styles.buttonTextBlue : null,
                    isSelected ? styles.buttonTextSelected : null,
                ]}>{choice}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.optionContainer}>
            {choicesRed.map((teamKey, index) => teamButton(teamKey, index, 'red'))}
            {choicesBlue.map((teamKey, index) => teamButton(teamKey, index, 'blue'))}
        </View>
    );
};

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
    selectedButtonRed: {
        backgroundColor: AppColors.frcRed,
    },
    selectedButtonBlue: {
        backgroundColor: AppColors.frcBlue,
    },
    pressedButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        fontWeight: 700,
    },
    buttonTextRed: {
        color: AppColors.frcRed,
    },
    buttonTextBlue: {
        color: AppColors.frcBlue,
    },
    buttonTextSelected: {
        color: AppColors.surface,
    },
});

export default TeamPicker6;
