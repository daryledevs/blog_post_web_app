import { useEffect }                    from "react";
import { Outlet, useLocation }          from "react-router-dom";
import { useDispatch, useSelector }     from "react-redux";

import { useGetUserDataQuery }          from "@/redux/api/userApi";
import { navigatedPage, selectSidebar } from "@/redux/slices/sidebarSlice";

import CreatePost                       from "@/shared/modals/CreatePost";
import Sidebar                          from "@/components/sidebar/Sidebar";
import SearchBar                        from "@/components/search-bar/SearchBar";

function Index() {
  const { hash, pathname, search } = useLocation();
  const sidebarState = useSelector(selectSidebar);
  const dispatch = useDispatch();
  
  const userDataApi = useGetUserDataQuery({ person: "" });

  useEffect(() => {
    if (userDataApi.data) {
      const { username } = userDataApi.data.user;
      const path = `/${username}` === pathname ? "/profile" : pathname;

      dispatch(
        navigatedPage({
          previous: sidebarState.current,
          current: path,
        })
      );
      return;
    } 
    
    if(!userDataApi.isLoading) {
      dispatch(
        navigatedPage({ 
          previous: sidebarState.current, 
          current: pathname 
        })
      );
    };
  }, [userDataApi?.data?.user]);

  if (userDataApi.isLoading || !userDataApi.data) return null;

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
