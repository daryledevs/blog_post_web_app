import { IEPost } from "../../interfaces/interface";
import baseApi from "./BaseApi";

interface IEUserFeed {
  post_ids: number[];
}

const feedApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserFeed: build.mutation<
      { feed: Array<IEPost> },
      { post_ids: Array<number> }
    >({
      query: ({ post_ids }: IEUserFeed) => ({
        url: "/feeds/user/",
        method: "POST",
        body: { post_ids },
      }),
    }),
    getTotalFeed: build.query<any, any>({
      query: () => ({
        url: "/feeds/count/",
        method: "GET",
      }),
    }),
    getExploreFeed: build.query<any, void>({
      query: (user_id: any) => ({
        url: `/feeds/explore/${user_id}`,
        method: "GET",
      }),
    }),
    
  }),
});

export const { useGetUserFeedMutation, useGetTotalFeedQuery, useGetExploreFeedQuery } = feedApi;

export { feedApi };
