import baseApi from "./BaseApi";
import { IEUserState } from "../reduxIntface";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserData: build.query<IEUserState, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),
    getFollowers: build.query<any, void>({
      query: (user_id) => ({
        url: `/follow/${user_id}`,
        method: "GET",
      }),
    }),
    getFollowCount: build.query<any, void>({
      query: (user_id) => ({
        url: `/follow/count/${user_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserDataQuery, useGetFollowersQuery, useGetFollowCountQuery } = userApi;