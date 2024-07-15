import baseApi         from "./baseApi";
import { IEUserState } from "@/interfaces/interface";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get user data
    getUserData: build.query<{ user: IEUserState }, { person?: string }>({
      query: ({ person }) => ({
        url: `/users?person=${person}`,
        method: "GET",
      }),
    }),
    // search users
    searchUsers: build.query<any, { searcher_id: string; searched_id: string }>(
      {
        query: ({ searcher_id, searched_id }) => ({
          url: `/users/${searcher_id}/searches/${searched_id}`,
          method: "GET",
        }),
      }
    ),
    // get recent search user
    getSearchesUser: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/users/${user_id}/searches`,
        method: "GET",
      }),
    }),
    // save recent search user
    saveUsersSearch: build.mutation<
      any,
      { user_id: number; searched_id: number }
    >({
      query: ({ user_id, searched_id }) => ({
        url: `/users/${user_id}/recent-searches/${searched_id}`,
        method: "POST",
      }),
    }),
    // delete recent search user
    delUsersSearch: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/searches`,
        method: "DELETE",
      }),
    }),
    // get follow stats
    getFollowStats: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/users/${user_id}/follow-stats`,
        method: "GET",
      }),
    }),
    // get followers and following lists
    getFollowersAndFollowingLists: build.mutation<
      any,
      {
        user_id: number;
        fetch: string;
        listsId: Array<number> | number;
      }
    >({
      query: ({ user_id, fetch, listsId }) => ({
        url: `/users/${user_id}/follow-lists?fetch=${fetch}`,
        method: "POST",
        body: { listsId },
      }),
    }),
    // follow user
    followUser: build.mutation<
      any,
      { follower_id: number; followed_id: number }
    >({
      query: ({ follower_id, followed_id }) => ({
        url: `/users/${follower_id}/follow/${followed_id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useSearchUsersQuery,
  useGetFollowersAndFollowingListsMutation,
  useGetFollowStatsQuery,
  useFollowUserMutation,
  useGetSearchesUserQuery,
  useSaveUsersSearchMutation,
  useDelUsersSearchMutation,
} = userApi;