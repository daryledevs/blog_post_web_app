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

function App() {
  const [token, setToken] = useState(false); // mock data
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();
  const socket = useRef(io("ws://localhost:8900"));
  const access_status = useAppSelector((state) => state.auth.access_status);

  const userData = useAppSelector((state) => state.user);
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
    if (comingMessage) dispatch(getMessage(comingMessage));
  }, [comingMessage]);

  useEffect(() => {
    appDispatch(checkAccess());
  }, [access_status]);

  useEffect(() => {
    switch (access_status) {
      case "Token is valid":
      case "Login successfully":
        setToken(true);
        navigate("/");
        console.log(access_status);
        break;

      case "Token is not valid":
      case "Password is incorrect":
      case "User not found":
        setToken(false);
        console.log(access_status);
        break;
    }
  }, [access_status]);

  const ProtectedRoute = () => {
    // to prevent them to go to homepage if not authenticated yet
    // '/' in url will not be accessible
    return token ? (
      <Outlet />
    ) : (
      <Navigate
        to="/login"
        replace
      />
    );
  };

  const AuthenticationRoute = () => {
    // to prevent them to go to login page if already authenticated
    // '/login' in url will not be accessible
    return !token ? (
      <Outlet />
    ) : (
      <Navigate
        to="/"
        replace
      />
    );
  };

  return (
    <div className="App">
      <Routes>
        {/* Authenticated */}
        <Route
          path="/"
          element={<ProtectedRoute />}
        >
          <Route
            path="/"
            element={<Index />}
          >
            <Route
              index
              element={<Feed />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
              path="/message"
              element={<Message />}
            />
          </Route>
        </Route>

        {/* Not yet Authenticated */}
        <Route
          path="/"
          element={<AuthenticationRoute />}
        >
          <Route
            path="/login"
            element={<Login />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
