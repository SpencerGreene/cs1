import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useContext, useEffect } from 'react';
import Button from '../components/Button';
import BubbleApi from '../api/BubbleApi';

import Styles from '../styles/Styles';
import { LOCALKEYS } from '../config';
import { AuthContext } from '../components/AuthProvider';
import BlueAllianceApi from '../api/BlueAllianceApi';

export default function ScoutPage() {
    const {
        userInfo, logout,
        appVariables, setAppVariables,
        eventMatches, setEventMatches,
        colorDict, setColorDict,
        lastChanged, setLastChanged,
    } = useContext(AuthContext);

    // get lastChanged from api - TODO refresh other info if it's stale
    useEffect(() => {
        const populateLastChanged = async () => {
            const apiLastChanged = await BubbleApi.apiGetLastChanged();
            setLastChanged(apiLastChanged);

            console.log('last changed loaded from api', apiLastChanged);
            console.log('current time is', new Date().getTime());
        };

        populateLastChanged();
    }, []); // Empty dependency array to run only on mount

    // get appVariables from cache or api
    useEffect(() => {
        const populateAppVariables = async () => {
            if (appVariables && userInfo && appVariables.teamNumT === userInfo.teamNumT) {
                console.log('app Variables already in memory', appVariables);
                return;
            }
            // Check if appVariables is in AsyncStorage
            const storedAppVariables = await AsyncStorage.getItem(LOCALKEYS.APPVAR);

            if (storedAppVariables) {
                // If it exists, set it in the state
                const parsedAppVariables = JSON.parse(storedAppVariables);
                parsedAppVariables.fetchedDate = new Date(parsedAppVariables.fetchedDate);
                setAppVariables(parsedAppVariables);
                console.log('app variables found in cache', parsedAppVariables);
            } else {
                // If not, fetch it from the API
                const apiAppVariables = await BubbleApi.apiGetAppVariables();
                await setAppVariables(apiAppVariables);

                // Store it in AsyncStorage for future use
                await AsyncStorage.setItem(LOCALKEYS.APPVAR, JSON.stringify(apiAppVariables));
                console.log('app variables loaded from api', apiAppVariables);
            }
        };

        populateAppVariables();
    }, []); // Empty dependency array to run only on mount

    const loadEventMatchesApi = async eventKey => {
        const apiEventMatches = await BlueAllianceApi.fetchMatches(eventKey);
        setEventMatches(apiEventMatches);

        // Store it in AsyncStorage for future use
        await AsyncStorage.setItem(LOCALKEYS.EVENTMATCHES, JSON.stringify(apiEventMatches));
        console.log('event matches loaded from api', apiEventMatches);
    };

    // get eventMatches from cache or API - depends on eventKey
    useEffect(() => {
        const populateMatches = async () => {
            if (!appVariables || !appVariables.eventKey) return;

            // 1 - already in React state
            if (eventMatches
                    && eventMatches.eventKey === appVariables.eventKey
                    && eventMatches[1]
                    && eventMatches[1].alliances) {
                console.log('eventMatches already in memory', eventMatches);
                return;
            }

            // 2 - already in cache
            const storedEventMatches = await AsyncStorage.getItem(LOCALKEYS.EVENTMATCHES);
            if (storedEventMatches) {
                const parsedEventMatches = JSON.parse(storedEventMatches);
                if (parsedEventMatches.eventKey === appVariables.eventKey
                        && parsedEventMatches[1]
                        && parsedEventMatches[1].alliances) {
                    setEventMatches(parsedEventMatches);
                    console.log('eventMatches in cache', parsedEventMatches);
                    return;
                }
            }

            // not found in cache
            await loadEventMatchesApi(appVariables.eventKey);
        };

        populateMatches();
    }, [appVariables.eventKey]); // Trigger only when event changes

    // get colorDict from cache or API - depends on userInfo.teamNumT
    useEffect(() => {
        const populateColorDict = async () => {
            if (!userInfo || !userInfo.teamNumT) return;

            const storedColorDict = await AsyncStorage.getItem(LOCALKEYS.COLORDICT);
            if (storedColorDict) {
                // If it exists, set it in the state
                const parsedColorDict = JSON.parse(storedColorDict);

                if (parsedColorDict.teamNumT === userInfo.teamNumT) {
                    setColorDict(parsedColorDict);
                    console.log('color dict found in cache', parsedColorDict);
                    return;
                }
            }

            // If not, fetch it from the API
            const apiColorDict = await BubbleApi.apiGetColorDict(userInfo.teamNumT);
            setColorDict(apiColorDict);

            // Store it in AsyncStorage for future use
            await AsyncStorage.setItem(LOCALKEYS.COLORDICT, JSON.stringify(apiColorDict));
            console.log('color dict loaded from api');

        };

        populateColorDict();
    }, [userInfo.teamNumT]); // Trigger only when appVariables changes

    return (
        <View style={Styles.column30}>
            <Image style={styles.image} source={require("../assets/loginlogo.jpg")} />
            <View id="textBlock">
                <View style={Styles.groupLeft}>
                    <Text style={[Styles.mediumTitle, styles.loginTitle]}>Welcome {userInfo.name}</Text>
                    <Text style={[Styles.bodyText]}>Event: {appVariables.eventKey}</Text>
                    <Text style={[Styles.bodyText]}>
                        Match 1 blue: {eventMatches[1]?.alliances?.blue?.team_keys?.join(', ')}
                    </Text>
                    <Text style={[Styles.bodyText]}
                    >Match 1 red: {eventMatches[1]?.alliances?.red?.team_keys?.join(', ')}
                    </Text>
                    <Button label="Log out" theme="primary" onPress={logout} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNotes: {
        marginTop: 60,
        marginBottom: 100,
    },
    loginTitle: {
        marginTop: 30,
        marginBottom: 12,
    },
    image: {
        width: 192,
        height: 51.5,
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 100,
    },
});