import { createSlice } from "@reduxjs/toolkit";
import { IEUserState } from "../reduxIntface";
import { userDataThunk } from "../action/user";

const initialState: IEUserState = {
  user_id: null as any,
  avatar_url: "",
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  roles: "",
  age: null as any,
  birthday: "",
  fetch_status: null as any,
};


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers:{
    getUserData: (state, action) => {
      return { ...action.payload, fetch_status: "Get the user's data successfully" };
    }, 
    isRejected: (state, action) => {
      return { ...state, fetch_status : action.payload?.message };
    }
  },
  // extraReducers(builder) {
  //     builder.addCase(userDataThunk.fulfilled, (state, action) =>{
  //       return { ...action.payload, fetch_status: "Get the user's data successfully" };
  //     })
      
  //     builder.addCase(userDataThunk.rejected, (state, action) => {
  //       state.fetch_status = "Get the user's data failed";
  //     });
  // },
});

export const { getUserData, isRejected } = userSlice.actions;
export default userSlice.reducer;