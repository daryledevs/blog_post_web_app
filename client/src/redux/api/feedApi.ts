import baseApi    from "./baseApi";
import { IPost } from "@/interfaces/interface";

export interface IEUserFeed {
  userUuid: string;
  postUuids: string[];
}

const feedApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserFeed: build.mutation<
      { feed: Array<IPost> },
      { postUuids: Array<string> }
    >({
      query: ({ userUuid, postUuids }: IEUserFeed) => ({
        url: "/feeds/",
        method: "POST",
        body: { userUuid, postUuids },
      }),
    }),
    getTotalFeed: build.query<any, any>({
      query: () => ({
        url: "/feeds/count/",
        method: "GET",
      }),
    }),
    getExploreFeed: build.query<any, { userUuid: string | undefined}>({
      query: ({ userUuid }: { userUuid: string | undefined }) => ({
        url: `/feeds/explore?userUuid=${userUuid}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserFeedMutation, useGetTotalFeedQuery, useGetExploreFeedQuery } = feedApi;

export { feedApi };
