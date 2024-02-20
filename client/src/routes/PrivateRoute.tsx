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
  isFeedApiLoading: boolean;
  isFeedTotalApiLoading: boolean;
};

function PrivateRoute({
  socket,
  feedRef,
  feeds,
  isFeedApiLoading,
  isFeedTotalApiLoading,
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
            feedRef={feedRef}
            isFeedApiLoading={isFeedApiLoading}
            isFeedTotalApiLoading={isFeedTotalApiLoading}
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
