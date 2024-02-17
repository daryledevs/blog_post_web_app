import { Navigate, Route } from 'react-router-dom';
import Profile from '../pages/Profile';
import Feed from '../pages/Feed';
import Index from '../pages/Index';
import Message from '../pages/Message';
import Explore from '../pages/Explore';

function PrivateRoute({ socket }: { socket: any }) {
  const Redirect = () => <Navigate to="/" replace />;
  const PUBLIC_PATH: any[] = ["/login", "/register", "/reset"];

  return (
    <Route key={1} path="/" element={<Index />} >
      <Route index element={<Feed />} />
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
