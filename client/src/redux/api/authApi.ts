import baseApi from "./baseApi";

export interface IPostLogin {
  userCredentials: string;
  password: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, any>({
      query: (body: IPostLogin) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

