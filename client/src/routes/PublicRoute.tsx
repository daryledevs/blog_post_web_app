import { Navigate, Route, Routes } from "react-router-dom";
import Login from '../pages/Login';

function PublicRoute(){
  const PRIVATE_PATH: any[] = ["/home", "/profile", "/message"];
  const Redirect = () => <Navigate to="/" replace />;

  return (
    <Routes>
      <Route path="/" element={<Login />}>
        <Route path="/login" index element={<Login />} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/reset" element={<div>Reset Password Page</div>} />
        {PRIVATE_PATH.map((path: any, index) => (
          <Route key={index} path={path} element={<Redirect />} />
        ))}
      </Route>
    </Routes>
  );
};

export default PublicRoute;
