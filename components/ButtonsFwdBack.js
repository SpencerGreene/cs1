import { StyleSheet, View } from 'react-native';
import Button from './Button';

export default function ButtonsFwdBack({ gameState, setPhase }) {
    const { phase, scoutSelectionValid: clickable } = gameState;

    return (
        <View style={styles.fwdBackContainer}>
            {phase.backLabel && 
                <Button 
                    theme="back" 
                    label={phase.backLabel} 
                    onPress={() => setPhase(phase.back, phase.backActions)} 
                    clickable={clickable} 
                />
            }
            {phase.forwardLabel && 
                <Button 
                    theme="forward" 
                    label={phase.forwardLabel} 
                    onPress={() => setPhase(phase.forward, phase.forwardActions)} 
                    clickable={clickable} 
                />
            }
        </View>
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
        flexDirection: 'row',
    },
})