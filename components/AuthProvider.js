
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import React, { createContext, useEffect, useState } from 'react';
// import * as URL from '../config';

// export const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//   const [userInfo, setUserInfo] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [splashLoading, setSplashLoading] = useState(false);

//   const login = async (email, password) => {
//     setIsLoading(true);

//     try {
//         const 

//         const loginResponse = await axios.post(
//             `${URL.WORKFLOW_URL}/login`, 
//             { email, password }
//         ); // should return: {data: {response: {user_id, token}}}

//         let user = loginResponse.data.response; // {user_id, token}
//         setUserInfo(user);
//         AsyncStorage.setItem('user', JSON.stringify(user));


//           .then(user_id => {
//             console.log('received user id', user_id);
//             return axios.get(
//                 `${URL.DATA_URL}/user/${user_id}`,
//                 {},
//                 {
//                   headers: {Authorization: `Bearer ${fetchedUser.token}`},
//                 },
//             )
//           })
//           .then(res => {
//             console.log('user res is', res);
//             fetchedUser.detail = res.data.response;
//             console.log('detail is', fetchedUser.detail);
//             setUserInfo(fetchedUser);
//             AsyncStorage.setItem('userInfo', JSON.stringify(fetchedUser));
//             setIsLoading(false);
//           })
//     } catch(err) {
//         console.log(`login error ${err}`);
//         alert(`login failed`);
//         setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setIsLoading(true);

//     axios
//       .post(
//         `${URL.WORKFLOW_URL}/logout`,
//         {},
//         {
//           headers: {Authorization: `Bearer ${userInfo.token}`},
//         },
//       )
//       .then(res => {
//         console.log(res.data);
//         AsyncStorage.removeItem('userInfo');
//         setUserInfo({});
//         setIsLoading(false);
//       })
//       .catch(e => {
//         console.log(`logout error ${e}`);
//         setIsLoading(false);
//       });
//   };

//   const isLoggedIn = async () => {
//     try {
//       setSplashLoading(true);

//       let userInfo = await AsyncStorage.getItem('userInfo');
//       userInfo = JSON.parse(userInfo);

//       if (userInfo) {
//         setUserInfo(userInfo);
//       }

//       setSplashLoading(false);
//     } catch (e) {
//       setSplashLoading(false);
//       console.log(`is logged in error ${e}`);
//     }
//   };

//   useEffect(() => {
//     isLoggedIn();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoading,
//         userInfo,
//         splashLoading,
//         login,
//         logout,
//       }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { useState, useEffect } from 'react';
import { View, Text, Button, AsyncStorage } from 'react-native';
import BubbleApi from '../api/BubbleApi';
import axios from 'axios';

export default function AuthProvider({children}) {

  const [currentUser, setCurrentUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const bubbleClient = new BubbleApi();

  async function login(email, password) {
    try {
    //   const savedUser = await AsyncStorage.getItem('currentUser');

    //   if (savedUser) {
    //     // Use stored data if available
    //     const user = JSON.parse(savedUser);
    //     setCurrentUser(JSON.parse(savedUser));
    //     BubbleApi.setToken(user.token);
    //   }

    //   // Fetch data from the API if refresh is true or if stored data is not present
    //   if (refresh || !savedUser) {
        let loginUser = await BubbleApi.apiLogin(email, password);

        // Store fetched data locally
        await AsyncStorage.setItem('currentUser', JSON.stringify(loginUser));
        setCurrentUser(loginUser);
      }
    catch (error) {
      console.error('Error fetching or storing data:', error);
    }
  };



  const handleRefresh = () => {
    // Set refresh flag to true when the refresh button is pressed
    setRefresh(true);
  };

  return (
    <View>
      <Text>Your Component</Text>
      {data && (
        <View>
          {/* Display your data */}
          <Text>{JSON.stringify(data)}</Text>
        </View>
      )}
      <Button title="Refresh" onPress={handleRefresh} />
    </View>
  );
};
