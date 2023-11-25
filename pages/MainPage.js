import React, { useContext } from 'react';

import ScoutPage from './ScoutPage';
import LoginPage from './LoginPage';
import { AuthContext } from '../components/AuthProvider';

export default function MainPage() {
  const { userInfo } = useContext(AuthContext);
  return (
    <div>
      { userInfo?.firstName ? <ScoutPage /> : <LoginPage /> }
    </div>
  );
}
