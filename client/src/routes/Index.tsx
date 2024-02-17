

import { useEffect, useState } from 'react'
import { useLoginMutation } from '../redux/api/AuthApi';
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { useAppSelector } from '../redux/hooks/hooks';
import useSocket from '../hooks/useSocketIO';

function RouteIndex() {
  const [route, setRoute] = useState<any>(null);
  const authToken = useAppSelector((state) => state.auth.authToken);
   const socket = useSocket("ws://localhost:8900");
  const { onConnection, onDisconnect } = socket;

  useEffect(() => {
    onConnection();
    return () => {
      onDisconnect();
    }
  }, [])

  const [
    login,
    {
      data: loginApiData,
      isLoading: isLoginLoading,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginMutation({ fixedCacheKey: "shared-update-post" }); 

  useEffect(() => {
    const LOGIN_STATUS = "Login successfully";
    const sessionToken = sessionStorage.getItem("token");

    if (isLoginLoading) return;

    if (isLoginError) {
      console.log("LOGIN ERROR: ", loginError);
      setRoute(PublicRoute());
      return;
    }

    if (loginApiData?.message === LOGIN_STATUS) {
      sessionStorage.setItem("token", loginApiData.token);
      setRoute(PrivateRoute({ socket }));
      return;
    }

    // Check for existing tokens
    const result = [authToken, sessionToken].some(
      (item) => item !== null && item !== undefined && item !== ""
    );

    if (result) {
      setRoute(PrivateRoute({ socket }));
    } else {
      setRoute(PublicRoute());
    };

  }, [loginApiData, authToken, isLoginLoading, isLoginError, loginError]);
  
  return route;
};

export default RouteIndex;