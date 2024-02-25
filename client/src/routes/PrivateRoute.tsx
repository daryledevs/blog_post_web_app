import { Navigate, Route } from 'react-router-dom';
import Profile from '../pages/Profile';
import Feed from '../pages/Feed';
import Index from '../pages/Index';
import Message from '../pages/Message';
import Explore from '../pages/Explore';

type PrivateRouteProps = {
  socket: any;
  feedRef: React.MutableRefObject<HTMLDivElement | null>;
  feeds: { feed: any[] };
  userTotalFeedApi: any;
  userFeedApi:any;
  fetchUserFeed: any;
  setAddFeedTrigger: any;
};

function PrivateRoute({
  socket,
  feedRef,
  feeds,
  userFeedApi,
  fetchUserFeed,
  userTotalFeedApi,
  setAddFeedTrigger
}: PrivateRouteProps) {
  const Redirect = () => <Navigate to="/" replace />;
  const PUBLIC_PATH: any[] = ["/login", "/register", "/reset"];
  
  return (
    <Route key={1} path="/" element={<Index />} >
      <Route
        index
        element={
          <Feed
            feeds={feeds}
            ref={feedRef}
            userFeedApi={userFeedApi}
            userTotalFeedApi={userTotalFeedApi}
            fetchUserFeed={fetchUserFeed}
            setAddFeedTrigger={setAddFeedTrigger}
          />
        }
      />
      <Route path="/:username" element={<Profile />} />
      <Route path="/message" element={<Message socket={socket} />} />
      <Route path="/explore" element={<Explore />} />
      {PUBLIC_PATH.map((path: any, index:number) => (
        <Route
          key={index}
          path={path}
          element={<Redirect />}
        />
      ))}
    </Route>
  );
};

export default PrivateRoute
