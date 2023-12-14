import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';

import { ERROR, LOG, INFO } from '../logConfig';
import { AuthContext } from '../components/AuthProvider';

import BubbleApi from '../api/BubbleApi';
import BlueAllianceApi from '../api/BlueAllianceApi';
import { ACTIONS, LOCALKEYS, PHASES, CLOCKSTATES } from '../config';

import Header from '../components/Header';
import ScoutPageSelect from './ScoutPageSelect';
import ScoutPageGame from './ScoutPageGame';
import ButtonsFwdBack from '../components/ButtonsFwdBack';
import { savedImageToBlob } from '../helpers/imageHelpers';

export default function ScoutPage() {
    let matchTime = 998;

    const {
        userInfo,
        appVariables, setAppVariables,
        eventInfo, setEventInfo,
        colorDict, setColorDict,
        lastChanged, setLastChanged,
    } = useContext(AuthContext);

    const [gameState, setGameState] = useState({
        // selection screen
        matchType: null,
        matchNumber: null,
        scoutTeamNumT: null,
        allianceColor: null,
        scoutSelectionValid: null,

        // game running
        phase: PHASES.select,
        phaseOverride: false,
        startTime: null,
        clockState: CLOCKSTATES.hidden,
    });

    const maxGameTime = () => 150 + appVariables?.game?.autoTeleSeconds;

    const doAction = action => {
        INFO('action=', action);
        switch (action) {
            case ACTIONS.clearConditions:
                break;
            case ACTIONS.clearMatchTeam:
                return { scoutTeamNumT: null, allianceColor: null };
            case ACTIONS.deleteCounts:
                break;
            case ACTIONS.deleteScout:
                break;
            case ACTIONS.incrementMatchNum:
                const matchNumber = gameState.matchNumber + 1;
                AsyncStorage.setItem(
                    LOCALKEYS.APPVAR,
                    JSON.stringify({ ...appVariables, defaultMatchNum: matchNumber })
                );
                BubbleApi.apiSetDefaultMatchNumber(matchNumber);
                return { matchNumber };
            case ACTIONS.makeScout:
                break;
            case ACTIONS.reloadMaxed:
                break;
            case ACTIONS.startClock:
                return { startTime: new Date(), clockState: CLOCKSTATES.running };
            case ACTIONS.hideClock:
                return { clockState: CLOCKSTATES.hidden };
            case ACTIONS.resetClock:
                // CountdownTimer resets automatically when state is stopped
                return { startTime: null, clockState: CLOCKSTATES.stopped };
            case ACTIONS.submit:
                break;
            case ACTIONS.clearPhaseOverride:
                return { phaseOverride: false };
            case ACTIONS.setPhaseOverride:
                return { phaseOverride: true };
            default:
                ERROR('unknown action', action);
        }
        return {};
    };

    const setPhase = (newPhase, actions) => {
        const phaseUpdate = { phase: newPhase };
        const actionUpdates = actions ? actions.map(action => doAction(action)) : [];
        const updates = Object.assign(phaseUpdate, ...actionUpdates);
        INFO({ actions, actionUpdates, updates });
        setGameState({ ...gameState, ...updates });
    };

    const overridePhase = (newPhase, actions) => {
        const allActions = [ACTIONS.setPhaseOverride, ...actions];
        setPhase(newPhase, allActions);
    }

    // get lastChanged from api - TODO refresh other info if it's stale
    useEffect(() => {
        const populateLastChanged = async () => {
            const apiLastChanged = await BubbleApi.apiGetLastChanged();
            setLastChanged(apiLastChanged);

            LOG('last changed loaded from api', apiLastChanged);
        };

        populateLastChanged();
    }, []); // Empty dependency array to run only on mount

    const hydrateBlobDict = async blobDict => {
        if (!blobDict) return;
        const keys = Object.keys(blobDict);
        const resultsArray = await Promise.all(keys.map(async key => {
            const { saveImage } = blobDict[key];
            const blob = await savedImageToBlob(saveImage);

            return { [key]: { saveImage, blob } };
        }));

        const result = Object.assign({}, ...resultsArray);
        return result;
    };

    // get appVariables from cache or api
    useEffect(() => {
        const setStartingMatch = appVar => {
            setGameState({ ...gameState, matchType: appVar.defaultMatchType, matchNumber: appVar.defaultMatchNum });
        };

        const populateAppVariables = async () => {
            if (appVariables && userInfo && appVariables.teamNumT === userInfo.teamNumT) {
                LOG('app Variables already in memory');
                INFO({appVariables});
                setStartingMatch(appVariables);
                return;
            }
            // Check if appVariables is in AsyncStorage
            const storedAppVariables = await AsyncStorage.getItem(LOCALKEYS.APPVAR);

            if (storedAppVariables) {
                // If it exists, set it in the state
                const parsedAppVariables = JSON.parse(storedAppVariables);
                parsedAppVariables.fetchedDate = new Date(parsedAppVariables.fetchedDate);
                parsedAppVariables.blobDict = await hydrateBlobDict(parsedAppVariables.blobDict);

                setAppVariables(parsedAppVariables);

                LOG('app variables found in cache');
                INFO({appVariables: parsedAppVariables});
                setStartingMatch(parsedAppVariables);
            } else {
                // If not, fetch it from the API
                const apiAppVariables = await BubbleApi.apiGetAppVariables();
                await setAppVariables(apiAppVariables);

                // Store it in AsyncStorage for future use
                await AsyncStorage.setItem(LOCALKEYS.APPVAR, JSON.stringify(apiAppVariables));
                LOG('app variables loaded from api');
                INFO({appVariables: apiAppVariables});
                setStartingMatch(apiAppVariables);
            }
        };

        populateAppVariables();
    }, []); // Empty dependency array to run only on mount

    const loadEventInfoApi = async eventKey => {
        const apiEventInfo = await BlueAllianceApi.fetchEventInfo(eventKey);
        setEventInfo(apiEventInfo);

        // Store it in AsyncStorage for future use
        await AsyncStorage.setItem(LOCALKEYS.EVENT, JSON.stringify(apiEventInfo));
        LOG('eventInfo loaded from api');
        INFO({eventInfo: apiEventInfo});
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
                LOG('eventInfo already in memory');
                INFO(eventInfo);
                return;
            }

            // 2 - already in cache
            const parsedEventInfo = JSON.parse(await AsyncStorage.getItem(LOCALKEYS.EVENT));
            if (validEvent(parsedEventInfo)) {
                setEventInfo(parsedEventInfo);
                LOG('eventInfo found in cache');
                INFO({eventInfo: parsedEventInfo});
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
                    LOG('colordict found in cache');
                    INFO(parsedColorDict);
                    return;
                }
            }

            // If not, fetch it from the API
            const apiColorDict = await BubbleApi.apiGetColorDict(userInfo.teamNumT);
            setColorDict(apiColorDict);

            // Store it in AsyncStorage for future use
            await AsyncStorage.setItem(LOCALKEYS.COLORDICT, JSON.stringify(apiColorDict));
            LOG('color dict loaded from api');

        };

        populateColorDict();
    }, [userInfo.teamNumT]); // Trigger only when appVariables changes

    const onTimeout = () => {
        const { phase } = gameState;
        LOG('timeout', { override: gameState.phaseOverride });
        if (!gameState.phaseOverride) setPhase(phase.forward, phase.forwardActions);
    }

    return (
        <View style={styles.container}>
            <Header
                gameState={gameState}
                maxGameTime={maxGameTime()}
                onTimeout={onTimeout}
            />
            <View style={styles.scoutContainer}>
                {gameState.phase === PHASES.select
                    ? <ScoutPageSelect gameState={gameState} setGameState={setGameState} />
                    : <ScoutPageGame gameState={gameState} setGameState={setGameState} maxGameTime={maxGameTime()} />
                }
            </View>
            <ButtonsFwdBack gameState={gameState} setPhase={overridePhase} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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
    scoutContainer: {
        minWidth: "100%",
        flex: 3,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
        minHeight: 480,
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    coneImage: {
        width: 32,
        height: 32,
        borderWidth: 2,
    },
});