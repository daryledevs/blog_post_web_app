import { Route, Routes } from "react-router-dom";
import { PRIVATE_PATH }  from "shared/constants/routes";
import RedirectRoute     from "./RedirectRoute";
import Login             from '../pages/Login';

function PublicRoute() {
  const restrictPrivateRoutes = RedirectRoute({ 
    defaultPath: "/login", routePath: PRIVATE_PATH 
  });

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/reset" element={<div>Reset Password Page</div>} />
      {restrictPrivateRoutes}
    </Routes>
  );
};

export default PublicRoute;