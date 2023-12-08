import baseApi from "./BaseApi";

const feedApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExploreFeed: build.query<any, void>({
      query: (user_id: any) => ({
        url: `/feeds/explore/${user_id}`,
        method: "GET",
      }),
    }),
    getUserPost: build.query<any, void>({
      query: (user_id: any) => ({
        url: `/posts/${user_id}`,
        method: "GET"
      }),
    }),
  }),
});

export const { useGetExploreFeedQuery, useGetUserPostQuery } = feedApi;

export { feedApi };
