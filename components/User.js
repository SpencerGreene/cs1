
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useContext } from 'react';
import * as URL from '../config';

export default User = () => {
  const [userDetail, setUserDetail] = useContext({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  const { userInfo } = useContext(AuthContext);

  const getUser = (userInfo) => {
    setIsLoading(true);

    axios
      .get(
        `${URL.DATA_URL}/user/${userInfo.response.user_id}`,
        {},
        {
          headers: {Authorization: `Bearer ${userInfo.response.token}`},
        },
      )
      .then(res => {
        let userDetail = res.data;
        console.log(userDetail);
        AsyncStorage.setItem('userDetail', JSON.stringify(userDetail));
        setUserDetail(userDetail);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(`user fetch error ${e}`);
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
