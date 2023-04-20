import { createSlice } from "@reduxjs/toolkit";
import { IEFollowState } from "../reduxIntface";

const initialState: IEFollowState = {
  followers: [
    {
      followed_id: null as any,
      follower_id: null as any,
      user_id: null as any,
      username: "",
      first_name: "",
      last_name: "",
    },
  ],

  following: [
    {
      followed_id: null as any,
      follower_id: null as any,
      user_id: null as any,
      username: "",
      first_name: "",
      last_name: "",
    },
  ],
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    getFollow: (state, action) => {
      return { followers: action.payload.followers, following: action.payload.following };
    }
  }
});

export const { getFollow } = followSlice.actions;
export default followSlice.reducer;