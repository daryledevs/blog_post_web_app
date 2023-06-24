

import React, { useEffect, useState } from 'react'
import { Route, Navigate } from "react-router-dom";
import Profile from "../pages/Profile";
import Message from "../pages/Message";
import Index from "../pages/Index";
import Feed from "../pages/Feed";
import Login from "../pages/Login";
import { useAppSelector } from '../redux/hooks/hooks';

function routeElement(isToken:boolean) {
  const Redirect = () => <Navigate to="/" replace />;
  const publicRoute: any[] = ["/login", "/register", "/reset"];
  const privateRout:any[] = ["/home", "/profile", "/message"];
  
  if (isToken) {
    return (
      <Route key={1} path="/" element={<Index />} >
        <Route index element={<Feed />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/message" element={<Message />} />
        {publicRoute.map((path: any, index:number) => (
          <Route
            key={index}
            path={path}
            element={<Redirect />}
          />
        ))}
      </Route>
    );
  } else {
    return (
      <Route key={1} path="/" element={<Login />}>
        <Route path="/login" index element={<Login />} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/reset" element={<div>Reset Password Page</div>} />
        {privateRout.map((path: any, index) => (
          <Route
            key={index}
            path={path}
            element={<Redirect />}
          />
        ))}
      </Route>
    );
  }
};

function RouteIndex() {
  const access_status = useAppSelector((state) => state.auth.access_status);
  const userData = useAppSelector((state) => state.user);
  const { fetch_status } = userData;
  const [route, setRoute] = useState<any>(null);

  useEffect(() => {
    switch (access_status || fetch_status) {
      case "Token is valid":
      case "Login successfully":
      case "Get the user's data successfully":
        setRoute(routeElement(true));
        break;

      case "Token is not valid":
      case "Password is incorrect":
      case "User not found":
      case "Forbidden":
      case "Get the user's data failed":
      case "Unauthorized":
        setRoute(routeElement(false));
        break;
    }
  }, [access_status, fetch_status]);

  return route;
};

export default RouteIndex;