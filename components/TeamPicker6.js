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
        return (
            <Pressable
                key={index}
                style={({ pressed }) => [
                    styles.optionButton,
                    selectedOption === choice ? styles.selectedButton[color] : null,
                    pressed && selectedOption === null ? styles.pressedButton : null,
                ]}
                onPress={() => handleOptionClick(choice, color)}
            >
                <Text style={[
                    styles.buttonText,
                    styles.buttonText[color],
                    selectedOption === choice ? styles.buttonText.selected : null,
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

export default TeamPicker6;
