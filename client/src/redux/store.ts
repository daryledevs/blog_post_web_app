import { configureStore } from "@reduxjs/toolkit";
import baseApi            from "./api/baseApi";
import messageSlice       from "./slices/messageSlice";
import sidebarSlice       from "./slices/sidebarSlice";

const store = configureStore({
  reducer: {
    messages: messageSlice,
    sidebar: sidebarSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([baseApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;