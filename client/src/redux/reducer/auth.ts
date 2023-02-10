import { createSlice } from "@reduxjs/toolkit";
import { checkAccess, login } from "../action/auth";

export interface IAuthState {
  access_status: string;
}

const initialState: IAuthState = {
  access_status: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // checkAccess
    builder.addCase(checkAccess.fulfilled, (state, action) => {
      state.access_status = action.payload.message;
    });

    builder.addCase(checkAccess.rejected, (state, action) => {
      if (action.payload) {
        state.access_status = action.payload.errorMessage;
      }
    });

    // login

    builder.addCase(login.fulfilled, (state, action) => {
      state.access_status = action.payload.message;
    });

    builder.addCase(login.rejected, (state, action) => {
      if (action.payload) {
        state.access_status = action.payload.message;
      }
    });
  },
});

export default authSlice.reducer;
