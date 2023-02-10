import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "./shared/base/NavigationBar";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import { checkAccess } from "./redux/action/auth";
import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";

function App() {
  const [token, setToken] = useState(false); // mock data
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const access_status = useAppSelector((state) => state.auth.access_status);

  useEffect(() => {  dispatch(checkAccess()); }, []);

  useEffect(() => {
    switch (access_status) {
      case "Token is valid":
      case "Login successfully":
        setToken(true);
        navigate("/");
        console.log(access_status);
        break;

      case "Token is not valid":
      case "Password is incorrect":
      case "User not found":
        setToken(false);
        console.log(access_status);
        break;
    }
  }, [access_status]);

  const ProtectedRoute = () => {
    // to prevent them to go to homepage if not authenticated yet
    // '/' in url will not be accessible
    return token ? (
      <Outlet />
    ) : (
      <Navigate
        to="/login"
        replace
      />
    );
  };

  const AuthenticationRoute = () =>{
    // to prevent them to go to login page if already authenticated
    // '/login' in url will not be accessible
    return !token ? (
      <Outlet />
    ) : (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Authenticated */}
        <Route path='/' element={<ProtectedRoute/>}>
          <Route path="/" element={<NavigationBar />}>
            <Route index element={<Feed />}/>
          </Route>
        </Route>

        {/* Not yet Authenticated */}
        <Route path='/' element={<AuthenticationRoute/>}>
          <Route path="/login"  element={<Login />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
