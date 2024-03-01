import { createSlice } from "@reduxjs/toolkit";
import { IEOpenConversation } from "../../interfaces/interface";

type MessageStateType = {
  openConversation: IEOpenConversation;
  newMessageTrigger: boolean;
  switchAccountTrigger: boolean;
};

const initialState: MessageStateType | null = {
  openConversation: {
    conversation_id: null as any,
    user_one: null as any,
    user_two: null as any,
    user_id: "",
    username: "",
    avatar_url: "",
    first_name: "",
    last_name: "",
  },
  newMessageTrigger: false,
  switchAccountTrigger: false,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setOpenConversation: (state, action) => {
      state.openConversation = action.payload;
    },
    setNewMessageTrigger: (state) => {
      state.newMessageTrigger = !state.newMessageTrigger;
    },
    setSwitchAccountTrigger: (state) => {
      state.switchAccountTrigger = !state.switchAccountTrigger;
    },
  },
});

export const selectMessage = (state: { messages: MessageStateType }) => state.messages;

export const {
  setOpenConversation,
  setNewMessageTrigger,
  setSwitchAccountTrigger,
} = messageSlice.actions;

export default messageSlice.reducer;
