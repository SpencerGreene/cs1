import { StyleSheet, View, Pressable, Text } from 'react-native';
import AppColors from '../styles/AppColors';

export default function Button({ label, theme, onPress }) {
    const themeStyle = styles[theme];
    console.log(theme, {themeStyle});
    return (
        <View style={[styles.buttonContainer, themeStyle.buttonContainer] }>
            <Pressable 
                style={[ styles.all.button, themeStyle?.button ]}
                onPress={onPress}
            >
                <Text style={[ styles.all.buttonLabel, themeStyle?.buttonLabel] }>{label}</Text>
            </Pressable>
        </View>
    );
}

const stylesAll = StyleSheet.create({
    buttonContainer: {
        minHeight: 40,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 5,
        minHeight: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        fontSize: 15,
        fontWeight: '600',
    }
});

const stylesForward = StyleSheet.create({
    buttonContainer: {
        flex: 7,
    },
    button: {
        backgroundColor: AppColors.primary
    },
    buttonLabel: {
        color: AppColors.surface,
    }
});

const stylesBack = StyleSheet.create({
    buttonContainer: {
        flex: 2,
        borderWidth: 1,
        borderColor: AppColors.textGray,
    },
    button: {
        backgroundColor: AppColors.background,
    },
    buttonLabel: {
        color: AppColors.textGray,
    },
});

const stylesPrimary = StyleSheet.create({
    buttonContainer: {
        minWidth: '100%',
        minHeight: 40,
    },
    button: {
        backgroundColor: AppColors.primary
    },
    buttonLabel: {
        color: AppColors.surface,
    }
});

const styles = {
    all: stylesAll,
    forward: stylesForward,
    back: stylesBack,
    primary: stylesPrimary,
}

// console.log({styles});
// console.log("all: ", styles['all']);
// console.log("primary.button: ", styles['primary'].button);