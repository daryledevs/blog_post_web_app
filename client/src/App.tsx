import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks/hooks";
import { getFollowers, getPosts, totalFollow } from "./redux/action/user";
import RouteIndex from "./routes/Index";
import { IEUserState } from "./redux/reduxIntface";
import { getUserData } from "./redux/reducer/user";
import { useGetUserDataQuery } from "./redux/api/UserApi";

function App() {
  const appDispatch = useAppDispatch();
  const routes = RouteIndex();

  const {
    data: userApiData,
    isLoading: userApiLoading,
    isError: isUserApiError,
    error: userApiError,
  } = useGetUserDataQuery();

  useEffect(() => {
    if (!userApiData || userApiLoading) return;
    const users: IEUserState = userApiData?.user;
    totalFollow(appDispatch, users.user_id);
    getFollowers(appDispatch, users.user_id, [], []);
    getPosts(appDispatch, users.user_id);
    appDispatch(getUserData({ ...users }));
  }, [appDispatch, userApiData, userApiLoading])

  if (!routes || userApiLoading) return <></>;
  
  return (
    <Routes>
      {routes}
      <Route path="/404" element={<div>404 Not Found Page</div>}/>
      <Route path="*" element={<div>404 Not Found Page</div>}/> 
    </Routes>
  );
}

export default App;
