import { createSlice } from "@reduxjs/toolkit";
import { login } from "../action/auth";

export interface IAuthState {
  authToken: string;
}

const initialState: IAuthState = {
  authToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) =>{
      state.authToken = action.payload;
    }
  },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer;
