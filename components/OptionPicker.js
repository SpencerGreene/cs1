// OptionPicker.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AuthContext } from './AuthProvider';
import AppColors from '../styles/AppColors';
import { LOG } from '../logConfig';

const OptionPicker = ({ column, options, uriDict, onOptionSelect, resetSelectedOption, flashing }) => {
    const { appVariables, colorDict } = useContext(AuthContext);

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

    const displayOption = (option, buttonState) => {
        const imageUri = uriDict[option.id];

        if (buttonState === 'active' && imageUri) buttonState = 'image';
        const [bgHexColor, fgHexColor] = optionColors(option, buttonState);
        const text = (<Text style={[styles.optionText, { color: fgHexColor }]}>{option.name}</Text>);
        const image = null;
        // const image = (
        //     imageUri
        //     && <Image
        //         style={[styles.buttonImage, { width: imageHeight(option), height: imageHeight(option) }]}
        //         source={{ uri: imageUri }}
        //     />
        // );
        LOG({option: option.name, buttonState});

        return (
            <View
                style={[
                    styles.optionContainer,
                    { minHeight: optionContainerHeight(option) },
                ]}
                key={option.id}>
                <Pressable
                    style={[styles.optionButton, { backgroundColor: bgHexColor }]}
                    onPress={() => handleOptionClick(option)}
                    disabled={buttonState === 'inactive'}
                >
                    {image || text}
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.optionContainer}>
            {options.map((option, index) => {
                let buttonState;

                if (flashing) buttonState = 'flash';
                else if (selectedOption === option) buttonState = 'selected';
                else if (!selectedOption) buttonState = 'active';
                else buttonState = 'inactive';

                return displayOption(option, buttonState);
                // <Pressable
                //     key={index}
                //     style={({ pressed }) => [
                //         styles.optionButton,
                //         selectedOption === choice ? styles.selectedButton : null,
                //         pressed ? styles.pressedButton : null,
                //     ]}
                //     onPress={() => handleOptionClick(choice)}
                //     disabled={selectedOption !== null && selectedOption !== choice}
                // >
                //     <Text style={styles.buttonText}>{choice.name}</Text>
                // </Pressable>
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    pressedButton: {
        backgroundColor: 'gray',
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

export default OptionPicker;
