import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CreatePost from "../shared/modals/CreatePost";
import Sidebar from "../shared/base/Sidebar";

function Index() {
  const { hash, pathname, search } = useLocation();
  const [clickedLink, setClickedLink] = useState(pathname);

  return (
    <div className="index__container">
      {clickedLink === "Create" && (
        <CreatePost setClickedLink={setClickedLink} />
      )}
      <Sidebar
        clickedLink={clickedLink}
        setClickedLink={setClickedLink}
      />
      <Outlet />
    </div>
  );
}

export default Index;
