import baseApi from "./baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get user post
    getUserPost: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/posts/by-user/${user_id}`,
        method: "GET",
      }),
    }),
    // get user total posts
    getUserTotalPosts: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/posts/by-user/${user_id}/stats`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserPostQuery, useGetUserTotalPostsQuery } = postApi;
export { postApi }