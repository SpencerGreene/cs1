import { StyleSheet, View } from 'react-native';
import Button from './Button';

export default function ButtonsFwdBack({ gameState, setGameState }) {
    const { phase, scoutSelectionValid: clickable } = gameState;
    const setPhase = newPhase => setGameState({...gameState, phase: newPhase});
    return (
        <View style={styles.fwdBackContainer}>
            {phase.backLabel && showButton(phase.backLabel, phase.back, "back", clickable, setPhase)}
            {phase.forwardLabel && showButton(phase.forwardLabel, phase.forward, "forward", clickable, setPhase)}
        </View>
    );
}

function showButton(label, newPhase, theme, clickable, setPhase) {
    const onPress = () => setPhase(newPhase);

    return (
        <Button theme={theme} label={label} onPress={onPress} clickable={clickable} />
    );
}

const styles = StyleSheet.create({
    fwdBackContainer: {
        minWidth: '100%',
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20,
        justifyContent: 'center',   // vertical center
        flexDirection: 'row',       // place buttons in a row
    },
})