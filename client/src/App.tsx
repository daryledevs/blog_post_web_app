import React, { useState, ReactNode } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavigationBar from "./shared/base/NavigationBar";
import Feed from "./pages/Feed";
import Login from "./pages/Login";

interface ProtectedProps{
  children?: ReactNode
}

function App() {
  const [token, setToken] = useState(true); // mock data


  const ProtectedRoute = () => {
    return token ? <Outlet/>  : <Navigate to='/login' replace/>;
  };

  const AuthenticationRoute = () =>{
    return !token ? <Outlet/> : <Navigate to='/' replace />;
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
