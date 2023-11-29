import { StyleSheet, View } from 'react-native';
import Button from './Button';
import AppColors from '../styles/AppColors';

export default function ButtonsFwdBack({ phase }) {
    return (
        <View style={styles.fwdBackContainer}>
            {phase.backLabel && showButton(phase.backLabel, phase.back, "back")}
            {phase.forwardLabel && showButton(phase.forwardLabel, phase.forward, "forward")}
        </View>
    );
}

function showButton(label, newPhase, theme) {
    const onPress = () => { 
        console.log('button pressed', {label, newPhase, theme});
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
        marginLeft: 0,
        marginRight: 0,
        marginTop: 20,
        justifyContent: 'center',   // vertical center
        flexDirection: 'row',       // place buttons in a row
    },
})