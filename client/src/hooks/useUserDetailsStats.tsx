import {
  useFollowUserMutation,
  useGetFollowStatsQuery,
}                                    from "@/redux/api/userApi";
import { useEffect }                 from "react";
import { useGetUserTotalPostsQuery } from "@/redux/api/postApi";

function useUserDetailsStats({ user_id }: any) {
  const [, followsListsApi] = useFollowUserMutation({
    fixedCacheKey: "follows-api",
  });

  const totalPostsApi = useGetUserTotalPostsQuery(
    { user_id },
    { skip: !user_id }
  );
  
  const followStatsDataApi = useGetFollowStatsQuery(
    { user_id },
    { skip: !user_id }
  );

  useEffect(() => {
    followStatsDataApi.refetch();
  }, [followsListsApi.data]);

  return {
    totalPosts: totalPostsApi.data?.totalPost,
    followers: followStatsDataApi.data?.followers,
    following: followStatsDataApi.data?.following,
    isLoading: totalPostsApi.isLoading || followStatsDataApi.isLoading,
    isFetching: totalPostsApi.isFetching || followStatsDataApi.isFetching,
  };
}

export default useUserDetailsStats;
