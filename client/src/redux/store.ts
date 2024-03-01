import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./api/BaseApi";
import messageSlice from "./slices/messageSlice";

const store = configureStore({
  reducer: {
    messages: messageSlice,
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