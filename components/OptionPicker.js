// OptionPicker.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const OptionPicker = ({ column, choices, onOptionSelect, resetSelectedOption }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (choice) => {
        if (selectedOption === null) {
            setSelectedOption(choice);
            onOptionSelect(column, choice);
        } else if (selectedOption === choice) {
            setSelectedOption(null);
            onOptionSelect(column, null);
        }
    };

    useEffect(() => {
        setSelectedOption(null);
    }, [resetSelectedOption]);

    return (
        <View style={styles.optionContainer}>
            {choices.map((choice, index) => (
                <Pressable
                    key={index}
                    style={({ pressed }) => [
                        styles.optionButton,
                        selectedOption === choice ? styles.selectedButton : null,
                        pressed && selectedOption === null ? styles.pressedButton : null,
                    ]}
                    onPress={() => handleOptionClick(choice)}
                    disabled={selectedOption !== null && selectedOption !== choice}
                >
                    <Text style={styles.buttonText}>{choice.name}</Text>
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    optionContainer: {
        marginVertical: 5,
    },
    optionButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    selectedButton: {
        backgroundColor: 'green',
    },
    pressedButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
    },
});

export default OptionPicker;
