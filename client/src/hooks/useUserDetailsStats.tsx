import { useGetUserTotalPostsQuery } from 'redux/api/postApi';
import { useGetFollowStatsQuery } from 'redux/api/userApi';

function useUserDetailsStats({ user_id }:any) {
  const totalPostsApi = useGetUserTotalPostsQuery({ user_id }, { skip: !user_id, });
  const followStatsDataApi = useGetFollowStatsQuery({ user_id }, { skip: !user_id });

  return {
    totalPosts: totalPostsApi.data?.totalPost,
    followers: followStatsDataApi.data?.followers,
    following: followStatsDataApi.data?.following,
    isLoading: totalPostsApi.isLoading || followStatsDataApi.isLoading,
    isFetching: totalPostsApi.isFetching || followStatsDataApi.isFetching,
  };
}

export default useUserDetailsStats
