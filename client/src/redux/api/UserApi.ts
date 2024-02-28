import baseApi from "./BaseApi";
import { IEUserState } from "../reduxIntface";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserData: build.query<IEUserState, { person?: string }>({
      query: ({ person }) => ({
        url: `/users?person=${person}`,
        method: "GET",
      }),
    }),
    getFollowStats: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/users/${user_id}/follows/stats`,
        method: "GET",
      }),
    }),
    getFollowLists: build.mutation<
      {
        user_id: number;
        follower_ids: Array<number>;
        following_ids: Array<number>;
      },
      any
    >({
      query: ({ user_id, follower_ids, following_ids }) => ({
        url: `/users/${user_id}/follows/lists`,
        method: "POST",
        body: { follower_ids, following_ids },
      }),
    }),
  }),
});

export const { useGetUserDataQuery, useGetFollowListsMutation, useGetFollowStatsQuery } = userApi;