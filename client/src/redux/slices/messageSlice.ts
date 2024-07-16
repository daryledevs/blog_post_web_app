import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import {
  IEConversation,
  IEReduxState,
  IEUserState,
} from "@/interfaces/interface";

export interface IEConversationState {
  openConversation: IEConversation[];
  recipients: IEUserState[];
  search: string;
  newMessageTrigger: boolean;
  switchAccountTrigger: boolean;
}

const initialState: IEConversationState | null = {
  openConversation: [],
  recipients: [],
  search: "",
  newMessageTrigger: false,
  switchAccountTrigger: false,
};

const messageSlice: Slice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setOpenConversation: (
      state,
      action: PayloadAction<IEConversation | IEConversation[]>
    ) => {
      const { payload } = action;
      const isArray = Array.isArray(payload);
      return {
        ...state,
        // if payload is an array, spread the array, else spread the payload
        openConversation: [...(isArray ? payload : [payload])],
      };
    },
    setRecipients: (
      state,
      action: PayloadAction<IEConversation[] | IEUserState>
    ) => {
      return {
        ...state,
        recipients: [...state.recipients, action.payload],
      };
    },
    removeRecipient: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        recipients: state.recipients.filter(
          (recipient: any) => recipient.user_id !== action.payload
        ),
      };
    },
    resetRecipients: (state) => {
      return {
        ...state,
        recipients: [],
      };
    },
    setSearch: (state, action: PayloadAction<string>) => {
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
  resetRecipients,
  setSearch,
  setSwitchAccountTrigger,
} = messageSlice.actions;

export default messageSlice.reducer;
