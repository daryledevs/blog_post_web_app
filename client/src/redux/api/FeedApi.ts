import { createApi } from "@reduxjs/toolkit/query/react"
import customBaseQuery from "../../config/customBaseQuery";
import { RootState } from "../store";

const feedApi = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "feedApi",
  endpoints: (build) => ({
    getExploreFeed: build.query<any, void>({
      query: (user_id: any) => `/feeds/explore/${user_id}`,
    }),
  }),
});

const userApi = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "userApi",
  endpoints: (build) => ({
    getUserData: build.query<any, void>({
      query: () => `/users`,
    }),
  }),
});

const selectUserData = (state:RootState) => userApi.endpoints.getUserData.select()(state).data;

export const { useGetUserDataQuery } = userApi;
export const { useGetExploreFeedQuery } = feedApi;

export { userApi, feedApi, selectUserData };
