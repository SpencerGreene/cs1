
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { LOG, INFO } from '../logConfig.js';
import { LOCALKEYS } from '../config';

import BubbleApi from '../api/BubbleApi';
import { savedImageToBlob } from '../helpers/imageHelpers.js';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [appVariables, setAppVariables] = useState({});
    const [eventInfo, setEventInfo] = useState({});
    const [colorDict, setColorDict] = useState({});
    const [lastChanged, setLastChanged] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);

        let loginUser = await BubbleApi.apiLogin(email, password);

        if (loginUser && loginUser.userID) {
            setUserInfo(loginUser);
            await AsyncStorage.setItem('userInfo', JSON.stringify(loginUser));

            const userDetails = await BubbleApi.apiGetUser(loginUser.userID);
            loginUser = { ...loginUser, ...userDetails };

            setUserInfo(loginUser);
            BubbleApi.setApiToken(loginUser.token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(loginUser));

            LOG('fetched user from API');
            INFO(loginUser);
        } else {
            alert('Email / password incorrect');
        }

        setIsLoading(false);
    }

    const logout = async () => {
        setIsLoading(true);

        try {
            const logoutResult = await BubbleApi.apiLogout();
            LOG(logoutResult);
            clearCache();
        } catch (err) {
            LOG(`logout error ${err}`);
        };
        setUserInfo({});
        setIsLoading(false);
    };

    const clearCache = async () => {
        LOG({LOCALKEYS});
        for (const [key, value] of Object.entries(LOCALKEYS)) {
            AsyncStorage.removeItem(value);
        }
        setAppVariables({});
        setColorDict({});
        setUserInfo({});
        setEventInfo({});
    };

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);

            const currentUserJSON = await AsyncStorage.getItem('userInfo');

            if (currentUserJSON && currentUserJSON !== "undefined") {
                const currentUser = JSON.parse(currentUserJSON);
                if (currentUser.profileSaveImage) {
                    currentUser.profileBlob = await savedImageToBlob(currentUser.profileSaveImage);
                }
                if (currentUser && currentUser.expireTime > new Date().getTime()) {
                    setUserInfo(currentUser);
                    BubbleApi.setApiToken(currentUser.token);
                    LOG('user found in cache');
                    INFO(currentUser);
                }
            } else {
                LOG('no cached user found')
            }

            setSplashLoading(false);
        } catch (err) {
            setSplashLoading(false);
            LOG(`isLoggedIn error ${err}`);
        }
    };

    // run isLoggedIn once at startup, to check for cached user
    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                appVariables,
                setAppVariables,
                eventInfo,
                setEventInfo,
                colorDict,
                setColorDict,
                lastChanged,
                setLastChanged,
                splashLoading,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
