import React, { useState }     from "react";
import SidebarBurger           from "./SidebarBurger";
import SidebarLogo             from "./SidebarLogo";
import SidebarTabLists         from "./SidebarTabLists";
import { ClickedLink }         from "@/pages/Index";
import { useGetUserDataQuery } from "@/redux/api/userApi";

interface IProps {
  clickedLink: ClickedLink;
  setClickedLink: React.Dispatch<React.SetStateAction<ClickedLink>>;
}

function Sidebar({ clickedLink, setClickedLink }: IProps) {
  const userDataApi = useGetUserDataQuery({ person: "" });
  const user = userDataApi?.data?.user;
  if (userDataApi.isLoading || !userDataApi.data) return null;

  return (
    <div
      className={`sidebar__container ${
        clickedLink.current === "Search" && "sidebar__show-search-tab"
      }`}
    >
      <SidebarLogo />
      <ul className="sidebar__links">
        <SidebarTabLists
          avatar={user?.avatar_url}
          username={user?.username}
          clickedLink={clickedLink}
          setClickedLink={setClickedLink}
        />
      </ul>
      <SidebarBurger />
    </div>
  );
}

export default Sidebar;
