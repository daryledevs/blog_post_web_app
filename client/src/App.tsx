import React, { useState, useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { getMessage } from "./redux/reducer/chat";
import { userDataThunk } from "./redux/action/user";
import RouteIndex from "./routes/Index";
import api from "./assets/data/api";


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
    //  const currentTime = new Date();
    //  const lastTime = new Date(sessionTime);
    //  const milliseconds = Math.abs(currentTime.valueOf() - lastTime.valueOf());
    //  const hour = milliseconds / 36e5;
    async function performRequest() {
      try {
        const token: any = sessionStorage.getItem("token");
        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // if access token is expired
        if (response.data.accessToken) {
          sessionStorage.setItem("token", response.data.accessToken);
          await performRequest();
        }

        // else proceed to API call for user's information
        if (token && token_status === "") appDispatch(userDataThunk(token));
      } catch (error) {
        console.log(error);
      }
    }

    performRequest();
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
