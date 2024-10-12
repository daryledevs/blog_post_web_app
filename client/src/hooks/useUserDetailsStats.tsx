import {
  useFollowUserMutation,
  useGetFollowStatsQuery,
}                                    from "@/redux/api/userApi";
import { useEffect }                 from "react";
import { useGetUserTotalPostsQuery } from "@/redux/api/postApi";

function useUserDetailsStats({ userUuid }: any) {
  const [, followsListsApi] = useFollowUserMutation({
    fixedCacheKey: "follows-api",
  });

  const totalPostsApi = useGetUserTotalPostsQuery(
    { userUuid },
    { skip: !userUuid }
  );
  
  const followStatsDataApi = useGetFollowStatsQuery(
    { userUuid },
    { skip: !userUuid }
  );

  useEffect(() => {
    console.log(followsListsApi.status, followStatsDataApi.data);
    if (followsListsApi?.data?.length) {
      followStatsDataApi.refetch();
    }
  }, [followsListsApi.status, followStatsDataApi.data]);

  return {
    totalPosts: totalPostsApi.data?.totalPost,
    followers: followStatsDataApi.data?.followers,
    following: followStatsDataApi.data?.following,
    isLoading: totalPostsApi.isLoading || followStatsDataApi.isLoading,
    isFetching: totalPostsApi.isFetching || followStatsDataApi.isFetching,
  };
}

export default useUserDetailsStats;
