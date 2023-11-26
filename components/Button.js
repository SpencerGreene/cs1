import { StyleSheet, View, Pressable, Text } from 'react-native';
import AppColors from '../styles/AppColors';

export default function Button({ label, theme, onPress }) {
    return (
        theme === 'primary' ? buttonPrimary(label, onPress) : buttonDefault(label, onPress)
    );
}

function buttonDefault(label, onPress) {
    return (
        <View style={StyleSheet.buttonContainer}>
            <Pressable 
                style={StyleSheet.button}
                onPress={onPress}
            >
                <Text style={StyleSheet.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

function buttonPrimary(label, onPress) {
    return (
        <View style={[styles.buttonContainer]}>
            <Pressable
                style={[styles.button]}
                onPress={onPress}
            >
                <Text style={[styles.buttonLabel, { color: AppColors.surface }]}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 40,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 5,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: AppColors.primary,
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: AppColors.surface,
        fontSize: 15,
        fontWeight: '600',
    }
})