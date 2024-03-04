import baseApi from "./baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserPost: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/posts?user_id=${user_id}`,
        method: "GET",
      }),
    }),
    getUserTotalPosts: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/posts/stats?user_id=${user_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserPostQuery, useGetUserTotalPostsQuery } = postApi;
export { postApi }