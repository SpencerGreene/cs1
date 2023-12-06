import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CLOCKSTATES } from '../config';
import AppColors from '../styles/AppColors';

const CountdownTimer = ({ initialTime, clockState }) => {
    const [time, setTime] = useState(initialTime);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Clear any existing interval when unmounting
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (clockState === CLOCKSTATES.running) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            // Clear the interval when isRunning becomes false
            setTime(initialTime);
            clearInterval(intervalRef.current);
        }

        // clear when component unmounts or clockState changes
        return () => clearInterval(intervalRef.current);
    }, [clockState]);

    useEffect(() => {
        // Reset the timer when initialTime changes
        if (clockState !== CLOCKSTATES.running) {
            setTime(initialTime);
        }
    }, [initialTime]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <View>
            {clockState !== CLOCKSTATES.hidden &&
                <Text style={styles.clockLabel}>
                    {formatTime(time)}
                </Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    clockLabel: {
        fontSize: 19,
        color: AppColors.bodyText,
        fontWeight: '500',
        alignSelf: 'flex-end',
    },
});

export default CountdownTimer;
