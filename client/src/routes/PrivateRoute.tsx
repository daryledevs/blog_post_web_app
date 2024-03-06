import { Navigate, Route, Routes } from 'react-router-dom';
import Profile from '../pages/Profile';
import Feed from '../pages/Feed';
import Index from '../pages/Index';
import Message from '../pages/Message';
import Explore from '../pages/Explore';
import SocketService from '../services/SocketServices';
import FollowModal from 'shared/modals/FollowModal';
import React, { useEffect, useRef, useState } from 'react';
import useFetchFeed from 'hooks/useFetchFeed';
import { useGetTotalFeedQuery, useGetUserFeedMutation } from 'redux/api/feedApi';
import { useGetUserDataQuery } from 'redux/api/userApi';

type PrivateRouteProps = {
  socketService: SocketService;
  feedRef: React.MutableRefObject<HTMLDivElement | null>;
  feeds: { feed: any[] };
  userTotalFeedApi: any;
  setAddFeedTrigger: any;
};

function PrivateRoute() {
  const Redirect = () => <Navigate to="/" replace />;
  const PUBLIC_PATH: any[] = ["/login", "/register", "/reset"];

  const socketService = new SocketService("ws://localhost:8900");
  const userDataApi = useGetUserDataQuery({ person: "" });
  const [feeds, setFeeds] = useState<any>({ feed: [] });
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [addFeedTrigger, setAddFeedTrigger] = useState<string>("not triggered yet");

  // SERVICES
  const userTotalFeedApi = useGetTotalFeedQuery({});
  const [fetchUserFeed, userFeedApi] = useGetUserFeedMutation({ fixedCacheKey: "feed-api", });

  useFetchFeed({
    addFeedTrigger,
    userFeedApi,
    fetchUserFeed,
    setFeeds,
    setAddFeedTrigger,
  });

  useEffect(() => {
    if (userDataApi.data) {
      socketService.addUserId(userDataApi.data.user.user_id);
      socketService.onConnection();
    }
    return () => {
      socketService.onDisconnect();
    };
  }, [userDataApi.data])

  return (
    <Routes>
      <Route key={1} path="/" element={<Index />} >
        <Route
          index
          element={
            <Feed
              ref={feedRef}
              feeds={feeds}
              userTotalFeedApi={userTotalFeedApi}
              setAddFeedTrigger={setAddFeedTrigger}
            />
          }
        />
        <Route path="/:username/" element={<Profile />}>
          <Route path="followers" element={<FollowModal />} />
          <Route path="following" element={<FollowModal />} />
        </Route>
        <Route path="/message" element={<Message socketService={socketService} />} />
        <Route path="/explore" element={<Explore />} /> 
        {PUBLIC_PATH.map((path: any, index:number) => (
          <Route
            key={index}
            path={path}
            element={<Redirect />}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default PrivateRoute
