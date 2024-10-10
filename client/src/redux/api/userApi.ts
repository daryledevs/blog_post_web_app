import baseApi   from "./baseApi";
import { IUser } from "@/interfaces/interface";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get user data
    getUserData: build.query<{ user: IUser }, void>({
      query: () => ({
        url: `/users`,
        method: "GET",
      }),
    }),
    getUserDataByUsername: build.query<{ user: IUser }, { username: string }>({
      query: ({ username }) => ({
        url: `/users?username=${username}`,
        method: "GET",
      }),
    }),
    // search users
    searchUsers: build.query<{ users: IUser[] }, { search: string }>({
      query: ({ search }) => ({
        url: `/users/search?searchQuery=${search}`,
        method: "GET",
      }),
    }),
    // get recent search user
    getSearchesUser: build.query<any, { userUuid: string }>({
      query: ({ userUuid }) => ({
        url: `/users/${userUuid}/searches`,
        method: "GET",
      }),
    }),
    // save search user
    saveUsersSearch: build.mutation<
      any,
      { searcherUuid: string; searchedUuid: string }
    >({
      query: ({ searcherUuid, searchedUuid }) => ({
        url: `/users/${searcherUuid}/searches/${searchedUuid}`,
        method: "POST",
      }),
    }),
    // delete search user
    delUsersSearch: build.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/users/${uuid}/searches`,
        method: "DELETE",
      }),
    }),
    // get follow stats
    getFollowStats: build.query<any, { userUuid: string }>({
      query: ({ userUuid }) => ({
        url: `/users/${userUuid}/follow-stats`,
        method: "GET",
      }),
    }),
    // get followers and following lists
    getFollowersAndFollowingLists: build.mutation<
      any,
      {
        userUuid: string;
        fetchFollowType: string;
        followListIds: Array<string>;
      }
    >({
      query: ({ userUuid, fetchFollowType, followListIds }) => ({
        url: `/users/${userUuid}/follow-lists?fetchFollowType=${fetchFollowType}`,
        method: "POST",
        body: { followListIds },
      }),
    }),
    // follow user
    followUser: build.mutation<
      any,
      { followerUuid: string; followedUuid: string }
    >({
      query: ({ followerUuid, followedUuid }) => ({
        url: `/users/${followerUuid}/follow/${followedUuid}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useLazyGetUserDataByUsernameQuery,
  useSearchUsersQuery,
  useGetFollowersAndFollowingListsMutation,
  useGetFollowStatsQuery,
  useFollowUserMutation,
  useGetSearchesUserQuery,
  useSaveUsersSearchMutation,
  useDelUsersSearchMutation,
} = userApi;