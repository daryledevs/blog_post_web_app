import { createSlice } from "@reduxjs/toolkit";
import { IEUserState } from "../reduxIntface";

const initialState: IEUserState = {
  user_id: null as any,
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  roles: "",
  age: null as any,
  birthday: "",
};


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers:{
    getUserData: (state, action) =>{
     return { ...action.payload };
    }
  }
});

export const { getUserData } = userSlice.actions;
export default userSlice.reducer;