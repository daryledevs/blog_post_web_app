import { createSlice } from "@reduxjs/toolkit";
import { IEOpenConversation, IEReduxState } from "../../interfaces/interface";

export interface IEMessageState {
  openConversation: IEOpenConversation[];
  newMessageTrigger: boolean;
  switchAccountTrigger: boolean;
};

const initialState: IEMessageState | null = {
  openConversation: [],
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
        openConversation: [...(isArray ? payload : [payload])],
      };
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
  setNewMessageTrigger,
  setSwitchAccountTrigger,
} = messageSlice.actions;

export default messageSlice.reducer;
