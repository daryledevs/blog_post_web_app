import baseApi from "./baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get user post
    getUserPost: build.query<any, { userUuid: string }>({
      query: ({ userUuid }) => ({
        url: `/posts/by-user/${userUuid}`,
        method: "GET",
      }),
    }),
    // get user total posts
    getUserTotalPosts: build.query<any, { userUuid: string }>({
      query: ({ userUuid }) => ({
        url: `/posts/by-user/${userUuid}/stats`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserPostQuery, useGetUserTotalPostsQuery } = postApi;
export { postApi }