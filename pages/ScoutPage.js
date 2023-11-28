import { StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useContext, useEffect } from 'react';
import Button from '../components/Button';
import BubbleApi from '../api/BubbleApi';

import Styles from '../styles/Styles';
import { LOCALKEYS } from '../config';
import { AuthContext } from '../components/AuthProvider';
import BlueAllianceApi from '../api/BlueAllianceApi';
import Header from '../components/Header';

export default function ScoutPage() {
    const {
        userInfo, logout,
        appVariables, setAppVariables,
        eventInfo, setEventInfo,
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

    const loadEventInfoApi = async eventKey => {
        const apiEventInfo = await BlueAllianceApi.fetchEventInfo(eventKey);
        setEventInfo(apiEventInfo);

        // Store it in AsyncStorage for future use
        await AsyncStorage.setItem(LOCALKEYS.EVENTMATCHES, JSON.stringify(apiEventInfo));
        console.log('eventInfo loaded from api', apiEventInfo);
    };

    // get eventMatches from cache or API - depends on eventKey
    useEffect(() => {
        const populateEvent = async () => {
            if (!appVariables || !appVariables.eventKey) return;

            // 1 - already in React state
            if (eventInfo
                    && eventInfo.eventKey === appVariables.eventKey
                    && eventInfo[1]
                    && eventInfo[1].alliances) {
                console.log('eventInfo already in memory', eventInfo);
                return;
            }

            // 2 - already in cache
            const storedEventInfo = await AsyncStorage.getItem(LOCALKEYS.EVENTMATCHES);
            if (storedEventInfo) {
                const parsedEventInfo = JSON.parse(storedEventInfo);
                if (parsedEventInfo.eventKey === appVariables.eventKey
                        && parsedEventInfo[1]
                        && parsedEventInfo[1].alliances) {
                    setEventInfo(parsedEventInfo);
                    console.log('eventInfo in cache', parsedEventInfo);
                    return;
                }
            }

            // not found in cache
            await loadEventInfoApi(appVariables.eventKey);
        };

        populateEvent();
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
        <View>
            <Header />
            <View id="textBlock" style={Styles.scoutContainer}>
                <View style={Styles.groupLeft}>
                    <Text style={[Styles.mediumTitle, styles.loginTitle]}>Welcome {userInfo.name}</Text>
                    <Text style={[Styles.bodyText]}>Event: {appVariables.eventKey}</Text>
                    <Text style={[Styles.bodyText]}>
                        Match 1 blue: {eventInfo[1]?.alliances?.blue?.team_keys?.join(', ')}
                    </Text>
                    <Text style={[Styles.bodyText]}
                    >Match 1 red: {eventInfo[1]?.alliances?.red?.team_keys?.join(', ')}
                    </Text>
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