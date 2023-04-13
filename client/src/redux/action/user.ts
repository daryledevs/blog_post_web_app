import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../assets/data/api";
import { IEUserState } from "../reduxIntface";
import { getChatMembers } from "./chatMember";
import { getChatThunk } from "./chat";
import { setAccessStatus } from "../reducer/auth";

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

      return fulfillWithValue(user);
    } catch (error) {
      console.log(error);
      dispatch(setAccessStatus(error.response.data));
      return rejectWithValue({ message: error.response.data.message });
    }
  }
);

export { userDataThunk };

