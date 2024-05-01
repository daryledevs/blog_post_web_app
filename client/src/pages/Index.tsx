import React, { useState }     from "react";
import { Outlet, useLocation } from "react-router-dom";
import CreatePost              from "../shared/modals/CreatePost";
import Sidebar                 from "../components/sidebar/Sidebar";
import SearchBar               from "../components/search/SearchBar";

export type ClickedLink = {
  previous: string;
  current: string;
};

function Index() {
  const { hash, pathname, search } = useLocation();
  
  const [clickedLink, setClickedLink] = useState<ClickedLink>({
    previous: "",
    current: pathname,
  });

  return (
    <div className="index__container">
      <CreatePost
        clickedLink={clickedLink}
        setClickedLink={setClickedLink}
      />
      <div className="index__sidebar">
        <Sidebar
          clickedLink={clickedLink}
          setClickedLink={setClickedLink}
        />
        <SearchBar
          clickedLink={clickedLink}
          setClickedLink={setClickedLink}
        />
      </div>
      <Outlet />
    </div>
  );
}

export default Index;
