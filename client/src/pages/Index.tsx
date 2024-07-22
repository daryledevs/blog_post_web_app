import { Outlet }               from "react-router-dom";
import CreatePost               from "@/shared/modals/CreatePost";
import Sidebar                  from "@/components/sidebar/Sidebar";
import SearchBar                from "@/components/search-bar/SearchBar";
import useUpdateNavigationState from "@/hooks/useUpdateNavigatePage";
import { selectSidebar } from "@/redux/slices/sidebarSlice";
import { useSelector } from "react-redux";

function Index() {
  const { isLoading, error } = useUpdateNavigationState();
  const sidebarState = useSelector(selectSidebar);
  if (isLoading) return null;

  return (
    <div className="index__container">
      <CreatePost />
      <div className="index__sidebar">
        <div
          className={
            sidebarState.current === "Search"
              ? "index__sidebar-search-bar-active"
              : "index__sidebar-container"
          }
        >
          <Sidebar />
          <SearchBar />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Index;
