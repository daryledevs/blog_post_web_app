import React, { useState, useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { getMessage } from "./redux/reducer/chat";
import { getFollowers, getPosts, totalFollow, userDataThunk } from "./redux/action/user";
import RouteIndex from "./routes/Index";
import api from "./config/api";
import { setAccessStatus } from "./redux/reducer/auth";
import { checkAccess } from "./redux/action/auth";
import { useFetchUserData } from "./redux/hooks/userApiHook";
import { getChatMembers } from "./redux/action/chatMember";
import { IEUserState } from "./redux/reduxIntface";
import { getChatThunk } from "./redux/action/chat";
import { getUserData, isRejected } from "./redux/reducer/user";


function App() {
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();
  const isLoading = useAppSelector(state => state.auth.isLoading);
  const socket = useRef<Socket | null>(null);
  const { access_status } = useAppSelector((state) => state.auth);
  const token_status = useAppSelector((state) => state.auth.token_status);
  const userData = useAppSelector((state) => state.user);
  const [comingMessage, setComingMessage] = useState<any>();
  const routes = RouteIndex();
  const appTest = useFetchUserData();

  useEffect(() => {
    if(appTest.isLoading) return;
    if (appTest.error && "status" in appTest.error) {
      const error = appTest.error.data;
      console.log("TEST: ", error);
      appDispatch(isRejected(error));
      return
    }
    const users: IEUserState = appTest.data.user;
    appDispatch(getChatMembers(users.user_id as any));
    appDispatch(getChatThunk({ user_id: users.user_id as any, length: 0 }));
    totalFollow(appDispatch, users.user_id);
    getFollowers(appDispatch, users.user_id, [], []);
    getPosts(appDispatch, users.user_id);
    appDispatch(getUserData({ ...users }));
  }, [appDispatch, appTest.data, appTest.error, appTest.isLoading])
 
  // socket handler
  useEffect(() => {
    try {
      if (userData.user_id && socket) {
        socket.current = io("ws://localhost:8900");
        socket.current.emit("addUser", userData.user_id);
        socket.current.on("getMessage", (data: any) => {
          setComingMessage({
            conversation_id: data.conversation_id,
            sender_id: data.senderId,
            text_message: data.text,
          });
        });
      }
    } catch (error) {
      
    }
  }, [socket, userData]);

  useEffect(() => {
    if(comingMessage) dispatch(getMessage(comingMessage));
  }, [comingMessage, dispatch]);  

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
