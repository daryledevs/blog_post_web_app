import { createSlice } from "@reduxjs/toolkit";
import { IEFollowState } from "../reduxIntface";

const initialState: IEFollowState = {
  total:{
    followers: 0,
    following: 0,
  },
  
  followers: [
    {
      followed_id: null as any,
      follower_id: null as any,
      user_id: null as any,
      username: "",
      avatar_url: "",
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
      avatar_url: "",
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
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    },
    getTotalFollow: (state, action) => {
      return {
        ...state,
        total: {
          followers: action.payload.followers,
          following: action.payload.following,
        },
      };
    },
    updateList: (state, action) => {
      return {
        ...state,
        total: {
          ...state.total,
          [action.payload.name]: action.payload.total,
        },
        [action.payload.name]: action.payload.value,
      };
    }
  }
});

export const { getFollow, getTotalFollow, updateList } = followSlice.actions;
export default followSlice.reducer;