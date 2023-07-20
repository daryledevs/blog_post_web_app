import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { IEChatData } from "../reduxIntface";

const getChatThunk = createAsyncThunk<
  IEChatData,
  { user_id: any; length: any },
  {
    rejectValue: {
      message: string;
    };
  }
>(
  "chat/getChatThunk",
  async ({ user_id, length}, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get(`/chats/${length}/${user_id}`);
      return fulfillWithValue(response.data.data);
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);


export { getChatThunk };