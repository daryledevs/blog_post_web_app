import { createSlice } from "@reduxjs/toolkit";
import { IEOpenConversation, IEReduxState, IEUserState } from "../../interfaces/interface";

export interface IEMessageState {
  openConversation: IEOpenConversation[];
  recipients: IEUserState[],
  search: string;
  newMessageTrigger: boolean;
  switchAccountTrigger: boolean;
};

const initialState: IEMessageState | null = {
  openConversation: [],
  recipients: [],
  search: "",
  newMessageTrigger: false,
  switchAccountTrigger: false,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setOpenConversation: (state, action) => {
      const { payload } = action;
      const isArray = Array.isArray(payload);
      return {
        ...state,
        // if payload is an array, spread the array, else spread the payload
        openConversation: [...(isArray ? payload : [payload])],
      };
    },
    setRecipients(state, action) {
      return {
        ...state,
        recipients: [...state.recipients, action.payload],
      };
    },
    removeRecipient(state, action) {
      return {
        ...state,
        recipients: state.recipients.filter(
          (recipient: any) => recipient.user_id !== action.payload
        ),
      };
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setNewMessageTrigger: (state) => {
      state.newMessageTrigger = !state.newMessageTrigger;
    },
    setSwitchAccountTrigger: (state) => {
      state.switchAccountTrigger = !state.switchAccountTrigger;
    },
  },
});

export const selectMessage = (state: IEReduxState) => state.messages;

export const {
  setOpenConversation,
  setRecipients,
  removeRecipient,
  setNewMessageTrigger,
  setSearch,
  setSwitchAccountTrigger,
} = messageSlice.actions;

export default messageSlice.reducer;
