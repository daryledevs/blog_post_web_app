import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { navigatedPage, selectSidebar } from "@/redux/slices/sidebarSlice";
import { useGetUserDataQuery } from "@/redux/api/userApi";

interface NavigationStateStatus {
  isLoading: boolean;
  error?: any;
}

function useUpdateNavigatePage(): NavigationStateStatus {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const sidebarState = useAppSelector(selectSidebar);
  const userDataApi = useGetUserDataQuery({ person: "" });

  useEffect(() => {
    // If userData is available, determine the path and dispatch navigation action
    if (userDataApi.data) {
      const { username } = userDataApi.data.user;
      const path = `/${username}` === pathname ? "/profile" : pathname;

      dispatch(
        navigatedPage({
          previous: sidebarState.current,
          current: path,
        })
      );
    } else if (!userDataApi.isLoading && !userDataApi.error) {
      // If loading is complete and no error, dispatch navigation with current pathname
      dispatch(
        navigatedPage({
          previous: sidebarState.current,
          current: pathname,
        })
      );
    }
  }, [userDataApi?.data?.user]);

  // Return loading status and potential error
  return { isLoading: userDataApi.isLoading, error: userDataApi.error };
}

export default useUpdateNavigatePage;
