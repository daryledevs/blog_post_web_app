import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../assets/data/api";
import { IEChatData } from "../reduxIntface";

const getChatMembers = createAsyncThunk<
  IEChatData,
  { user_id: any },
  {
    rejectValue: {
      message: string;
    };
  }
>(
  "chatMember/getChatMembers",
  async ({ user_id }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get(`/chats/${user_id}`);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export { getChatMembers };
