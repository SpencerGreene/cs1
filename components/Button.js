import { StyleSheet, View, Pressable, Text } from 'react-native';
import AppColors from '../styles/AppColors';

export default function Button({ label, theme }) {
    return (
        theme === 'primary' ? buttonPrimary(label) : buttonDefault(label)
    );
}

function buttonDefault(label) {
    return (
        <View style={StyleSheet.buttonContainer}>
            <Pressable 
                style={StyleSheet.button}
                onPress={() => alert('you pressed the button')}
            >
                <Text style={StyleSheet.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

function buttonPrimary(label) {
    return (
        <View style={[styles.buttonContainer]}>
            <Pressable
                style={[styles.button]}
                onPress={() => alert('You pressed a button.')}
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
        fontWeight: 600,
    }
})