import baseApi from "./baseApi";
import { IEUserState } from "../../interfaces/interface";

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
    getFollowersAndFollowingLists: build.mutation<
      any,
      {
        user_id: number;
        fetch: string;
        listsId: Array<number> | number;
      }
    >({
      query: ({ user_id, fetch, listsId }) => ({
        url: `/users/${user_id}/lists?fetch=${fetch}`,
        method: "POST",
        body: { listsId },
      }),
    }),
  }),
});

export const { useGetUserDataQuery, useGetFollowersAndFollowingListsMutation,useGetFollowStatsQuery } = userApi;