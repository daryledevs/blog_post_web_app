import React, { useState, useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { checkAccess } from "./redux/action/auth";
import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { getMessage } from "./redux/reducer/chat";
import { userDataThunk } from "./redux/action/user";
import RouteIndex from "./routes/Index";


function App() {
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();
  const isLoading = useAppSelector(state => state.auth.isLoading);
  const socket = useRef(io("ws://localhost:8900"));
  const access_status = useAppSelector((state) => state.auth.access_status);
  const token_status = useAppSelector((state) => state.auth.token_status);
  const userData = useAppSelector((state) => state.user);
  const [comingMessage, setComingMessage] = useState<any>();
  const routes = RouteIndex();
  
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
  
  

  if(isLoading || !routes) return <></>;

  return (
    <Routes>
      {routes}
      <Route path="/404" element={<div>404 Not Found Page</div>}/>
      <Route path="*" element={<div>404 Not Found Page</div>}/> 
    </Routes>
  );
}

export default App;
