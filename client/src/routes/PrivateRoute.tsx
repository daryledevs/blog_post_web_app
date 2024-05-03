import {
  useGetTotalFeedQuery,
  useGetUserFeedMutation,
}                                             from "redux/api/feedApi";
import { Route, Routes }                      from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import Feed                                   from "../pages/Feed";
import Index                                  from "../pages/Index";
import Message                                from "../pages/Message";
import Explore                                from "../pages/Explore";
import Profile                                from "../pages/Profile";
import FollowModal                            from "shared/modals/FollowModal";
import RedirectRoute                          from "./RedirectRoute";
import { PUBLIC_PATH }                        from "../shared/constants/routes";

import useFetchFeed                           from "hooks/useFetchFeed";
import SocketService                          from "../services/SocketServices";
import { useGetUserDataQuery }                from "redux/api/userApi";

type PrivateRouteProps = {
  socketService: SocketService;
  feedRef: React.MutableRefObject<HTMLDivElement | null>;
  feeds: { feed: any[] };
  userTotalFeedApi: any;
  setAddFeedTrigger: any;
};

function PrivateRoute() {
  const restrictPublicRoutes = RedirectRoute({ 
    defaultPath: "/", routePath: PUBLIC_PATH 
  });
  
  const socketService = new SocketService("ws://localhost:3000");
  const feedRef = useRef<HTMLDivElement | null>(null);
  const userDataApi = useGetUserDataQuery({ person: "" });
  const user = userDataApi.data?.user;
  const [feeds, setFeeds] = useState<any>({ feed: [] });
  const [addFeedTrigger, setAddFeedTrigger] = useState<string>("not triggered yet");

  // SERVICES
  const userTotalFeedApi = useGetTotalFeedQuery({});
  const [fetchUserFeed, userFeedApi] = useGetUserFeedMutation({
    fixedCacheKey: "feed-api",
  });

  useFetchFeed({
    user_id: user?.user_id,
    addFeedTrigger,
    userFeedApi,
    fetchUserFeed,
    setFeeds,
    setAddFeedTrigger,
  });

  useEffect(() => {
    if (user) {
      socketService.addUserId(user.user_id);
      socketService.onConnection();
    }
    return () => {
      socketService.onDisconnect();
    };
  }, [user]);

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
        <Route
          path="/message"
          element={<Message socketService={socketService} />}
        />
        <Route path="/explore" element={<Explore />} /> 
        {restrictPublicRoutes}
      </Route>
    </Routes>
  );
};

export default PrivateRoute
