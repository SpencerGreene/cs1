// TeamPicker3.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const TeamPicker3 = ({ alliance, choices, onOptionSelect, resetSelectedOptions }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (choice) => {
    if (selectedOption === null) {
      setSelectedOption(choice);
      onOptionSelect(choice);
    } else if (selectedOption === choice) {
      setSelectedOption(null);
      onOptionSelect(null);
    }
  };

  useEffect(() => {
    setSelectedOption(null);
  }, [resetSelectedOptions]);

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
          disabled={selectedOption !== null}
        >
          <Text style={styles.buttonText}>{choice.display}</Text>
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

export default TeamPicker3;
