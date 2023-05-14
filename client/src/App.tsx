import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import Index from "../src/pages/Index";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import { checkAccess } from "./redux/action/auth";
import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";
import Profile from "./pages/Profile";
import Message from "./pages/Message";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { getMessage } from "./redux/reducer/chat";
import { userDataThunk } from "./redux/action/user";
import { redirect } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();
  const isLoading = useAppSelector(state => state.auth.isLoading);
  const socket = useRef(io("ws://localhost:8900"));
  const access_status = useAppSelector((state) => state.auth.access_status);
  const token_status = useAppSelector((state) => state.auth.token_status);
  const userData = useAppSelector((state) => state.user);
  const { fetch_status } = userData;
  const [route, setRoute] = useState<any>(null);
  const [comingMessage, setComingMessage] = useState<any>();
  
  // socket handler
  useEffect(() => {
    if (userData.user_id) {
      socket.current.emit("addUser", userData.user_id);
      socket.current.on("getMessage", (data: any) => {
        setComingMessage({
          conversation_id: data.conversation_id,
          sender_id: data.senderId,
          text_message: data.text,
        });
      });
    }
  }, [socket, userData]);

  useEffect(() => {
    if(comingMessage) dispatch(getMessage(comingMessage));
  }, [comingMessage]);

  useEffect(() => {
    const token: any = sessionStorage.getItem("token");
    const sessionTime = sessionStorage.getItem("sessionTime");
    
    if (sessionTime && token && token_status === "") {
      const currentTime = new Date();
      const lastTime = new Date(sessionTime);
      const milliseconds = Math.abs(currentTime.valueOf() - lastTime.valueOf());
      const hour = milliseconds / 36e5;

      // If it's been an hour or more, then get a new access token
      if (hour < 0) appDispatch(checkAccess());
      else appDispatch(userDataThunk(token));

    } else {
      appDispatch(checkAccess());
    }

  }, [access_status]);

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
        setRoute(routeElement(false));
        break;
    }
  }, [access_status, fetch_status]);
  
  const routeElement = function (isToken:boolean) {
    const Redirect = () => <Navigate to="/" replace />;
    const publicRoute: any[] = ["/login", "/register", "/reset"];
    const privateRout:any[] = ["/home", "/profile", "/message"];

    if (isToken) {
      return (
        <Route path="/" element={<Index />} >
          <Route index element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/message" element={<Message />} />

          {publicRoute.map((path: any) => (
            <Route
              path={path}
              element={<Redirect />}
            />
          ))}

          <Route path="*" element={<div>404 Not Found Page</div>} />
        </Route>
      );
    } else {
      return (
        <Route path="/" element={<Login />}>
          <Route path="/login" index element={<Login />} />
          <Route path="/register" element={<div>Register Page</div>} />
          <Route path="/reset" element={<div>Reset Password Page</div>} />

           {privateRout.map((path: any) => (
            <Route
              path={path}
              element={<Redirect />}
            />
          ))}

          <Route path="*" element={<div>404 Not Found Page</div>} />
        </Route>
      );
    }
  };

  if(isLoading) return <></>;
  return <Routes>{route}</Routes>;
}

export default App;
