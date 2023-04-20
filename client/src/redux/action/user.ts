import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../assets/data/api";
import { IEUserState } from "../reduxIntface";
import { getChatMembers } from "./chatMember";
import { getChatThunk } from "./chat";
import { setAccessStatus } from "../reducer/auth";
import { getFollow } from "../reducer/follower";

async function getFollowers(dispatch:any, user_id:any, token: any){
  try {
    const response = await api.get(`/users/followers/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    dispatch(getFollow(response.data));
    
  } catch (error) {
    console.log("follower: ", error)
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
  async (token, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get(`/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const user = response.data.user;

      dispatch(getChatThunk({ user_id: user.user_id, length: 0 }));
      dispatch(getChatMembers(user));
      getFollowers(dispatch, user.user_id, token);

      return fulfillWithValue(user);
    } catch (error) {
      console.log(error);
      dispatch(setAccessStatus(error.response.data));
      return rejectWithValue({ message: error.response.data.message });
    }
  }
);

export { userDataThunk };

