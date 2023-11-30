import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useContext, useEffect, useState } from 'react';
import BubbleApi from '../api/BubbleApi';

import Styles from '../styles/Styles';
import { LOCALKEYS, PHASES } from '../config';
import { AuthContext } from '../components/AuthProvider';
import BlueAllianceApi from '../api/BlueAllianceApi';
import Header from '../components/Header';
import ScoutPageSelect from './ScoutPageSelect';
import ScoutPageGame from './ScoutPageSelect';
import ButtonsFwdBack from '../components/ButtonsFwdBack';

export default function ScoutPage() {
    const {
        userInfo,
        appVariables, setAppVariables,
        eventInfo, setEventInfo,
        colorDict, setColorDict,
        lastChanged, setLastChanged,
    } = useContext(AuthContext);

    const [gameState, setGameState] = useState({
        phase: PHASES.select,
        startTime: null,
        matchType: null,
        matchNumber: null,
        scoutTeamNumT: null,
        scoutSelectionValid: true,
    });

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
        await AsyncStorage.setItem(LOCALKEYS.EVENT, JSON.stringify(apiEventInfo));
        console.log('eventInfo loaded from api', apiEventInfo);
    };

    // get eventInfo from cache or API - depends on eventKey
    useEffect(() => {
        const validEvent = event => (
            event 
            && event.eventKey === appVariables.eventKey
            && event.matches
            && event.matches[1]
            && event.matches[1].alliances
        );

        const populateEvent = async () => {
            if (!appVariables || !appVariables.eventKey) return;

            // 1 - already in React state
            if (validEvent(eventInfo)) {
                console.log('eventInfo already in memory', eventInfo);
                return;
            }

            // 2 - already in cache
            const parsedEventInfo = JSON.parse(await AsyncStorage.getItem(LOCALKEYS.EVENT));
            if (validEvent(parsedEventInfo)) {
                setEventInfo(parsedEventInfo);
                console.log('eventInfo found in cache', parsedEventInfo);
                return;
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
            <Header gameState={gameState}/>
            <View style={Styles.scoutContainer}>
                {gameState.phase === PHASES.select 
                    ? <ScoutPageSelect gameState={gameState} setGameState={setGameState} />
                    : <ScoutPageGame gameState={gameState} setGameState={setGameState} />
                }
            </View>
            <ButtonsFwdBack gameState={gameState} setGameState={setGameState} />
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