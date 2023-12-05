import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CLOCKSTATES } from '../config';
import AppColors from '../styles/AppColors';

const Countdown2 = ({ initialTime, clockState }) => {
    const [time, setTime] = useState(initialTime);
    let interval;

    useEffect(() => {
        // Clear any existing interval when unmounting
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (clockstate === CLOCKSTATES.running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            // Clear the interval when isRunning becomes false
            clearInterval(interval);
        }
    }, [clockState]);

    useEffect(() => {
        // Reset the timer when initialTime changes
        if (clockstate !== CLOCKSTATES.running) {
            setTime(initialTime);
        }
    }, [initialTime, clockState]);

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

export default Countdown2;
