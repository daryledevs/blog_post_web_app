import { fetchBaseQuery, BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import axiosApi, { ErrorHandler } from "../config/api";

// reference for RTK query's custom base query
const customBaseQuery: BaseQueryFn<string, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: axiosApi.defaults.baseURL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
    },
    credentials: "include",
  })(args, api, extraOptions);

  const { data, error } = result;
  console.log("DATA: ", data)
  const status = error?.status as number;

  if (status >= 400 && status < 500) return ErrorHandler.handle(error);
  if (data && typeof data === 'object' && 'accessToken' in data) {
    sessionStorage.setItem("token", data.accessToken as string);
    await customBaseQuery(args, api, extraOptions);
  };

  return result;
};

export default customBaseQuery;