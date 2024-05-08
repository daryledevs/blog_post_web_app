import React, { useEffect, useState }     from "react";
import { Outlet, useLocation } from "react-router-dom";

import CreatePost              from "@/shared/modals/CreatePost";
import Sidebar                 from "@/components/sidebar/Sidebar";
import SearchBar               from "@/components/search-bar/SearchBar";
import { useGetUserDataQuery } from "@/redux/api/userApi";

export type ClickedLink = {
  previous: string;
  current: string;
};

function Index() {
  const { hash, pathname, search } = useLocation();
  
  const userDataApi = useGetUserDataQuery({ person: "" });

  const [clickedLink, setClickedLink] = useState<ClickedLink>({
    previous: "",
    current: pathname,
  });

  useEffect(() => {
    if (userDataApi.data) {
      const user = userDataApi.data.user;
      const path = `/${user.username}` === pathname ? "/profile" : pathname;
      setClickedLink({ previous: "", current: path });
    }
  }, [userDataApi?.data?.user]);

  if (userDataApi.isLoading || !userDataApi.data) return null;

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
