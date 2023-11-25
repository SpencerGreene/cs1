
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import BubbleApi from '../api/BubbleApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    // const api = new BubbleApi();

    const login = async (email, password) => {
        setIsLoading(true);

        let loginUser = await BubbleApi.apiLogin(email, password);

        if (loginUser && loginUser.userID) {
            setUserInfo(loginUser);
            await AsyncStorage.setItem('userInfo', JSON.stringify(loginUser));

            const userDetails = await BubbleApi.fetchUser(loginUser.userID);
            loginUser = { ...loginUser, ...userDetails };

            setUserInfo(loginUser);
            BubbleApi.setApiToken(loginUser.token);
            AsyncStorage.setItem('userInfo', JSON.stringify(loginUser));

            console.log('fetched', loginUser);
            BubbleApi.printContents();
        } else {
            alert('Email / password incorrect');
        }

        setIsLoading(false);
    }

    const logout = async () => {
        setIsLoading(true);

        try {
            BubbleApi.printContents();
            const logoutResult = await BubbleApi.apiLogout();

            console.log(logoutResult);
            AsyncStorage.removeItem('userInfo');
            setUserInfo({});
            setIsLoading(false);
        } catch (err) {
            console.log(`logout error ${err}`);
            setIsLoading(false);
        };
    };

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);

            const currentUserJSON = await AsyncStorage.getItem('userInfo');

            if (currentUserJSON && currentUserJSON !== "undefined") {
                console.log(currentUserJSON);
                const currentUser = JSON.parse(currentUserJSON);
                setUserInfo(currentUser);
                console.log('found user', currentUser, 'in local cache');
            } else {
                console.log('no cached user found')
            }

            setSplashLoading(false);
        } catch (err) {
            setSplashLoading(false);
            console.log(`isLoggedIn error ${err}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
