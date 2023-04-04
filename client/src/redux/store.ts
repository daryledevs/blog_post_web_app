import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import userReducer from "./reducer/user";
import chatReducer from "./reducer/chat";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;