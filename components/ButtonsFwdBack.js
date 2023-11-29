import { StyleSheet, View } from 'react-native';
import Button from './Button';

export default function ButtonsFwdBack({ phase }) {
    return (
        <View style={styles.fwdBackContainer}>
            {phase.backLabel && showButton(phase.backLabel, phase.backPhase, "default")}
            {phase.forwardLabel && showButton(phase.forwardLabel, phase.forwardPhase, "primary")}
        </View>
    );
}

function showButton(label, newPhase, theme) {
    const onPress = () => { 
        alert(`${newPhase.display} pressed`); 
    }
    return (
        <Button theme={theme} label={label} onPress={onPress} />
    );
}

const styles = StyleSheet.create({
    fwdBackContainer: {
        width: '100%',
        height: 40,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})