import { createSlice } from "@reduxjs/toolkit";
import { IEPostState } from "../reduxIntface";

const initialState: IEPostState = {
  post: [
    {
      post_id: null as any,
      user_id: null as any,
      caption: "",
      image_id: "",
      image_url: "",
      post_date: ""
    },
  ],
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getPost: (state, action) => {
      return { ...state, post: [...action.payload] };
    },
  }
});

export const { getPost } = postSlice.actions;
export default postSlice.reducer; 