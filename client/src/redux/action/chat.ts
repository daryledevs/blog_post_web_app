import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../assets/data/api";
import { IEChatData } from "../reduxIntface";

const getChatThunk = createAsyncThunk<
  IEChatData,
  { user_id: any },
  {
    rejectValue: {
      message: string;
    };
  }
>(
  "chat/getChatThunk",
  async (user_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/${user_id}`);
      return fulfillWithValue(response.data.hist);
    } catch (error) {
      return rejectWithValue({ message: error.response.data.message });
    }
  }
);


export { getChatThunk };