import { useSelector }         from "react-redux";
import { useGetUserDataQuery } from "@/redux/api/userApi";
import { selectSidebar }       from "@/redux/slices/sidebarSlice";

import SidebarLogo             from "./SidebarLogo";
import SidebarBurger           from "./SidebarBurger";
import SidebarTabLists         from "./SidebarTabLists";

function Sidebar() {
  const sidebarState = useSelector(selectSidebar);

  const userDataApi = useGetUserDataQuery({ person: "" });
  const user = userDataApi?.data?.user;

  if (userDataApi.isLoading || !user) return null;

  return (
    <div
      className={`sidebar__container ${
        sidebarState.current === "Search" && 
        "sidebar__show-search-tab"
      }`}
    >
      <SidebarLogo />
      <div className="sidebar-tab-lists">
        <SidebarTabLists
          avatar={user?.avatar_url}
          username={user?.username}
        />
      </div>
      <SidebarBurger />
    </div>
  );
}

export default Sidebar;
