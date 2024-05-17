import { Outlet }               from "react-router-dom";
import CreatePost               from "@/shared/modals/CreatePost";
import Sidebar                  from "@/components/sidebar/Sidebar";
import SearchBar                from "@/components/search-bar/SearchBar";
import useUpdateNavigationState from "@/hooks/useUpdateNavigatePage";

function Index() {
  const { isLoading, error } = useUpdateNavigationState();
  if (isLoading) return null;

  return (
    <div className="index__container">
      <CreatePost />
      <div className="index__sidebar">
        <Sidebar />
        <SearchBar />
      </div>
      <Outlet />
    </div>
  );
}

export default Index;
