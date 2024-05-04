import { createApi }   from "@reduxjs/toolkit/query/react";
import customBaseQuery from "@/config/customBaseQuery";

const baseApi = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  endpoints: () => ({}),
});

export default baseApi;
