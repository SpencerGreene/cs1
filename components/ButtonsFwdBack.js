import { StyleSheet, View } from 'react-native';
import Button from './Button';
import AppColors from '../styles/AppColors';

export default function ButtonsFwdBack({ phase, clickable }) {
    return (
        <View style={styles.fwdBackContainer}>
            {phase.backLabel && showButton(phase.backLabel, phase.back, "back", clickable)}
            {phase.forwardLabel && showButton(phase.forwardLabel, phase.forward, "forward", clickable)}
        </View>
    );
}

function showButton(label, newPhase, theme, clickable) {
    const onPress = () => { 
        console.log('button pressed', {label, newPhase, theme});
        alert(`${newPhase.display} pressed`); 
    }
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