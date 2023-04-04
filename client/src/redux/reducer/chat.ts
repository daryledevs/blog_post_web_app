import { createSlice } from "@reduxjs/toolkit";
import { getChatThunk } from "../action/chat";
import { IEChatState } from "../reduxIntface";

const initialState: IEChatState = {
  conversation_id: null as any,
  sender_id: null as any,
  receiver_id: null as any,
  time_conversation: null as any,
};


const chatSlice = createSlice({
  name: "name",
  initialState,
  reducers:{
  
  },
  extraReducers(builder) {
    builder.addCase(getChatThunk.rejected, (state, action) => {
      console.log("CHAT: ", action?.payload?.message);
    });

    builder.addCase(getChatThunk.fulfilled, (state, action) => {
      console.log("CHAT: ", action.payload);
      return { ...action.payload };
    });
  },
});

export const {  } = chatSlice.actions;
export default chatSlice.reducer;