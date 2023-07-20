import { Dispatch, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { IEUserState } from "../reduxIntface";
import { getChatMembers } from "./chatMember";
import { getChatThunk } from "./chat";
import { setAccessStatus } from "../reducer/auth";
import { getFollow, getTotalFollow } from "../reducer/follower";
import { getPost } from "../reducer/post";

async function totalFollow(dispatch:Dispatch, user_id:any){
  try {
    const response = await api.get(`/follow/count/${user_id}`);
    dispatch(getTotalFollow(response.data));
  } catch (error) {
    console.log(error)
  }
};

export async function getFollowers(dispatch:Dispatch, user_id:any, follower:any[], following:any[]){
  try {
    const response = await api.post(`/follow/${user_id}`, {
      follower_ids: follower,
      following_ids: following,
    });
    dispatch(getFollow(response.data));
  } catch (error) {
    console.log(error)
  }
};

async function getPosts(dispatch:Dispatch, user_id:number) {
  try {
    const response = await api.get(`/posts/${user_id}`);
    dispatch(getPost(response.data?.post))
  } catch (error) {
    console.log(error)
  }
}

const userDataThunk = createAsyncThunk<
  IEUserState,
  { token: string },
  {
    rejectValue: {
      message: string;
    };
  }
>(
  "user/userDataThunk",
  async (_, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get(`/users`);
      const user = response.data.user;
      await Promise.all([
        dispatch(getChatThunk({ user_id: user.user_id, length: 0 })),
        dispatch(getChatMembers(user)),
        totalFollow(dispatch, user.user_id),
        getFollowers(dispatch, user.user_id, [], []),
        getPosts(dispatch, user.user_id),
      ]);

      return fulfillWithValue(user);
    } catch (error) {
      console.log(error);
      dispatch(setAccessStatus(error.response.data));
      return rejectWithValue({ message: error.response.data.message });
    }
  }
);

export { userDataThunk };

