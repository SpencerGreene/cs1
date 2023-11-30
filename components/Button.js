import { StyleSheet, View, Pressable, Text } from 'react-native';
import AppColors from '../styles/AppColors';

export default function Button({ label, theme, onPress, clickable = true }) {
    const themeStyle = styles[theme];
    return (
        <View style={[styles.buttonContainer, themeStyle.buttonContainer] }>
            <Pressable 
                style={[ styles.all.button, themeStyle?.button, !clickable && styles.inactive.button ]}
                onPress={() => clickable && onPress()}
            >
                <Text style={[ styles.all.buttonLabel, themeStyle?.buttonLabel, !clickable && styles.inactive.buttonLabel ] }>{label}</Text>
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        fontSize: 15,
        fontWeight: '700',
    }
});

const stylesForward = StyleSheet.create({
    buttonContainer: {
        flex: 5,
    },
    button: {
        backgroundColor: AppColors.primary,
    },
    buttonLabel: {
        color: AppColors.surface,
    }
});

const stylesBack = StyleSheet.create({
    buttonContainer: {
        flex: 1,
    },
    button: {
        backgroundColor: AppColors.background,
        borderWidth: 1,
        borderColor: AppColors.primary,
    },
    buttonLabel: {
        color: AppColors.primary,
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

const stylesInactive = StyleSheet.create({
    button: {
        backgroundColor: AppColors.buttonInactiveBackground,
    },


});

const styles = {
    all: stylesAll,
    forward: stylesForward,
    back: stylesBack,
    primary: stylesPrimary,
    inactive: StyleSheet.create({
        button: { backgroundColor: AppColors.buttonInactiveBackground },
        buttonLabel: { color: AppColors.bodyText },
    }),
}
