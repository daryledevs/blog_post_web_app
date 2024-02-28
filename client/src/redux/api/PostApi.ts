import baseApi from "./BaseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserPost: build.query<any, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `/posts/users/${user_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserPostQuery } = postApi;
export { postApi }