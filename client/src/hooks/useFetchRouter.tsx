import { useEffect, useState, useRef } from 'react'
import PublicRoute from "../routes/PublicRoute";
import PrivateRoute from "../routes/PrivateRoute";
import { useGetUserDataQuery } from '../redux/api/UserApi';
import { useGetTotalFeedQuery, useGetUserFeedMutation } from '../redux/api/FeedApi';
import { useLoginMutation } from '../redux/api/AuthApi';
import useFetchFeed from './useFetchFeed';
import SocketService from '../services/SocketServices';

type useFetchRouterProps = {
  socketService: SocketService;
  setRoute: any;
};

function useFetchRouter({
  socketService,
  setRoute,
}: useFetchRouterProps) {
  const [feeds, setFeeds] = useState<any>({ feed: [] });
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [addFeedTrigger, setAddFeedTrigger] = useState<string>("not triggered yet");

  // SERVICES
  const userApiData = useGetUserDataQuery();
  const userTotalFeedApi = useGetTotalFeedQuery({});
  const [fetchUserFeed, userFeedApi] = useGetUserFeedMutation();
  const [, loginApiData] = useLoginMutation({ fixedCacheKey: "shared-update-post" });

  useFetchFeed({
    addFeedTrigger,
    userFeedApi,
    fetchUserFeed,
    setFeeds,
  });

  useEffect(() => {
    const LOGIN_STATUS = "Login successfully";
    const sessionToken = sessionStorage.getItem("token");

    if (loginApiData.isError || userApiData.isError) {
      console.log("LOGIN ERROR: ", loginApiData.error);
      console.log("USER API ERROR: ", userApiData.error);
      setRoute(PublicRoute());
      return;
    }

    const ARGUMENT = {
      socketService,
      feedRef,
      feeds,
      userFeedApi,
      userTotalFeedApi,
      fetchUserFeed,
      setAddFeedTrigger,
    };

    if (loginApiData.data?.message === LOGIN_STATUS) {
      sessionStorage.setItem("token", loginApiData.data.token);
      setRoute(PrivateRoute(ARGUMENT));
      return;
    }

    if (sessionToken) setRoute(PrivateRoute(ARGUMENT));
    else setRoute(PublicRoute());

    // added feeds.feed as an dependency to update its value for the PrivateRoute
  }, [feeds.feed, loginApiData]);
}

export default useFetchRouter
