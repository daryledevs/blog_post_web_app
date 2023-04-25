import { createSlice } from "@reduxjs/toolkit";
import { checkAccess, login } from "../action/auth";

export interface IAuthState {
  access_status: string;
  token_status: any;
  isLoading: boolean;
}

const initialState: IAuthState = {
  access_status: "",
  token_status: "",
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessStatus: (state, action) =>{
      state.access_status = action.payload.message;
      state.token_status = action.payload.error.message
      sessionStorage.setItem("token", "");
    }
  },
  extraReducers(builder) {
    // checkAccess
    builder.addCase(checkAccess.fulfilled, (state, action) => {
      state.token_status = "";
      state.isLoading = false;
      state.access_status = action.payload.message;
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("sessionTime", new Date().toString());
    });

    builder.addCase(checkAccess.rejected, (state, action) => {
      if (action.payload) {
        state.access_status = action.payload.errorMessage;
      }
    });

    // login

    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.access_status = action.payload.message;
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("sessionTime", (new Date()).toString());
    });

    builder.addCase(login.rejected, (state, action) => {
      if (action.payload) {
        state.access_status = action.payload.message;
      }
    });
  },
});

export const { setAccessStatus } = authSlice.actions;
export default authSlice.reducer;
