import baseApi from "./BaseApi";

interface IEUserFeed {
  post_ids: number[];
}

const feedApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserFeed: build.mutation<any, any>({
      query: (body: IEUserFeed) => ({
        url: "/feeds/user/",
        method: "POST",
        body,
      }),
    }),
    getExploreFeed: build.query<any, void>({
      query: (user_id: any) => ({
        url: `/feeds/explore/${user_id}`,
        method: "GET",
      }),
    }),
    getTotalFeed: build.mutation<any, any>({
      query: () => ({
        url: "/feeds/count/",
        method: "GET",
      }),
    }),
    getUserPost: build.query<any, void>({
      query: (user_id: any) => ({
        url: `/posts/${user_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserFeedMutation, useGetExploreFeedQuery, useGetTotalFeedMutation,useGetUserPostQuery } =
  feedApi;

export { feedApi };
