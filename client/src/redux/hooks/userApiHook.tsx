import { useEffect } from "react";
import { useGetUserDataQuery } from "../api/UserApi";

// Custom hook to fetch and cache user data
export function useFetchUserData() {
  const data = useGetUserDataQuery();

  useEffect(() => {
    // Fetch user data when the component mounts and store it in the cache
    data.refetch();
  }, [data, data.refetch]);

  return data;
}
