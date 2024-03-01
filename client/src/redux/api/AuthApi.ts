import baseApi from "./baseApi";

interface PostLogin {
  username?: string;
  password?: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, any>({
      query: (body: PostLogin) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

