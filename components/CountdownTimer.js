import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AppColors from '../styles/AppColors';
import { CLOCKSTATES } from '../config';

const CountdownTimer = React.forwardRef(({ initialTime, clockState, onReset, onStart }, ref) => {
    const [time, setTime] = useState(initialTime);
    const timerRef = useRef(null);

    const startTimer = () => {
        if (!timerRef.current) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timerRef.current);
                        // Handle timer expiration, e.g., show a message or trigger an action
                        return 0;
                    }
                });
            }, 1000);
        }
    };

    const resetTimer = () => {
        clearInterval(timerRef.current);
        setTime(initialTime);
        onReset && onReset();
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        onStart && onStart(startTimer);
    }, [onStart]);

    useEffect(() => {
        ref.current = {
            startTimer,
            resetTimer,
        };
    }, [ref, startTimer, resetTimer]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;


    return (
        <View>
            {clockState !== CLOCKSTATES.hidden &&
                <Text style={styles.clockLabel}>
                    {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
                </Text>
            }
        </View>
    );
});

export default CountdownTimer;

const styles = StyleSheet.create({
    clockLabel: {
        fontSize: 19,
        color: AppColors.bodyText,
        fontWeight: '500',
        alignSelf: 'flex-end',
    },
});