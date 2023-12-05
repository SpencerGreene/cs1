import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AppColors from '../styles/AppColors';
import { CLOCKSTATES } from '../config';

const CountdownTimer = React.forwardRef(({ initialTime, clockState, startTimer, resetTimer }, ref) => {
    const [time, setTime] = useState(initialTime);
    const timerRef = useRef(null);
    const isResetRef = useRef(false);

    const handleStartTimer = () => {
        // Reset the isReset flag when starting the timer
        isResetRef.current = false;

        // Clear any existing interval
        clearInterval(timerRef.current);
        timerRef.current = null;
        console.log('timerRef.current after clearing:', timerRef.current);

        console.log('handleStartTimer called');
        if (!timerRef.current) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                        // Handle timer expiration, e.g., show a message or trigger an action
                        return 0;
                    }
                });
            }, 1000);
        } else {
            console.log('we already got one');
        }
    };

    const handleResetTimer = () => {
        console.log('resetTimer triggered');
        clearInterval(timerRef.current);
        setTime(initialTime);
        isResetRef.current = true;
        resetTimer && resetTimer();
        isResetRef.current = false;
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    // useEffect(() => {
    //     console.log('onStart triggered');

    //     onStart && onStart(startTimer);
    // }, [onStart]);

    useEffect(() => {
        console.log('set ref triggered');

        ref.current = {
            startTimer: handleStartTimer,
            resetTimer: handleResetTimer,
        };
        // }, [ref, handleStartTimer, handleResetTimer]);
    }, []);

    useImperativeHandle(ref, () => ({
        startTimer: handleStartTimer,
        resetTimer: handleResetTimer,
        isReset: () => isResetRef.current,
    }), [handleStartTimer, handleResetTimer]);

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