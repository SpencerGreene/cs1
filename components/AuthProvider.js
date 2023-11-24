
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import * as URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  let fetchedUser = {};

  const login = (email, password) => {
    setIsLoading(true);

    axios
      .post(`${URL.WORKFLOW_URL}/login`, {
        email,
        password,
      })
      .then(res => {
        fetchedUser = res.data.response;
        setUserInfo(fetchedUser);
        AsyncStorage.setItem('userInfo', JSON.stringify(fetchedUser));
        return fetchedUser.user_id;
      })
      .then(user_id => {
        console.log('received user id', user_id);
        return axios.get(
            `${URL.DATA_URL}/user/${user_id}`,
            {},
            {
              headers: {Authorization: `Bearer ${fetchedUser.token}`},
            },
        )
      })
      .then(res => {
        console.log('user res is', res);
        fetchedUser.detail = res.data.response;
        console.log('detail is', fetchedUser.detail);
        setUserInfo(fetchedUser);
        AsyncStorage.setItem('userInfo', JSON.stringify(fetchedUser));
        setIsLoading(false);
      })
      .catch(e => {
        console.log(`login error ${e}`);
        alert(`login failed`);
        setIsLoading(false);
      });
  };

  const logout = () => {
    setIsLoading(true);

    axios
      .post(
        `${URL.WORKFLOW_URL}/logout`,
        {},
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      )
      .then(res => {
        console.log(res.data);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
      })
      .catch(e => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
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
