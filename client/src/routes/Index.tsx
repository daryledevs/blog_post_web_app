import { useEffect, useState, useRef } from "react";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import useSocket from '../hooks/useSocketIO';
import useFetchFeed from '../hooks/useFetchFeed';
import useFetchFeedOnScroll from '../hooks/useFetchFeedOnScroll';

import { useLoginMutation } from '../redux/api/AuthApi';
import { useGetUserDataQuery } from "../redux/api/UserApi";
import { useGetTotalFeedQuery, useGetUserFeedMutation } from '../redux/api/FeedApi';

function RouteIndex() {
  const [route, setRoute] = useState<any>(null);
  const socket = useSocket("ws://localhost:8900");
  const { onConnection, onDisconnect } = socket;
  
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [feeds, setFeeds] = useState<any>({ feed: [] });

  // SERVICES
  const userApiData = useGetUserDataQuery();
  const userTotalFeedApi = useGetTotalFeedQuery({});
  const [getUserFeed, getUserFeedApi] = useGetUserFeedMutation();
  const [, loginApiData] = useLoginMutation({ fixedCacheKey: "shared-update-post" });

  const { addFeedTrigger } = useFetchFeedOnScroll({
    feedRef,
    feeds,
    getUserFeed,
    getTotalFeed: userTotalFeedApi.refetch,
    totalFeedApiData: userTotalFeedApi.data,
  });
  
  useFetchFeed({
    addFeedTrigger,
    getUserFeedApi,
    getUserFeed,
    setFeeds,
  });

  useEffect(() => {
    onConnection();
    return () => {
      onDisconnect();
    };
  }, []);

  useEffect(() => {
    if(
        userApiData.isLoading || 
        loginApiData.isLoading || 
        getUserFeedApi.isLoading
      ) return;
      
    const LOGIN_STATUS = "Login successfully";
    const sessionToken = sessionStorage.getItem("token");

    if (loginApiData.isError || userApiData.isError) {
      console.log("LOGIN ERROR: ", loginApiData.error);
      console.log("USER API ERROR: ", userApiData.error);
      setRoute(PublicRoute());
      return;
    }

    const ARGUMENT = {
      socket,
      feedRef,
      feeds,
      isFeedApiLoading: getUserFeedApi.isLoading,
      isFeedTotalApiLoading: userTotalFeedApi.isLoading,
    };

    if (loginApiData.data?.message === LOGIN_STATUS) {
      sessionStorage.setItem("token", loginApiData.data.token);
      setRoute(PrivateRoute(ARGUMENT));
      return;
    }

    if (sessionToken) setRoute(PrivateRoute(ARGUMENT));
    else setRoute(PublicRoute());

    // added feeds.feed as an dependency to update its value for the PrivateRoute
  }, [loginApiData, userApiData, getUserFeedApi, feeds.feed]);

  return { route };
};

export default RouteIndex;