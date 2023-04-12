import { createSlice } from "@reduxjs/toolkit";
import { IEChatMemberState } from "../reduxIntface";
import { getChatMembers } from "../action/chatMember";
const initialState: Array<IEChatMemberState> = [
  {
    conversation_id: null as any,
    members: {
      user_one: null as any,
      user_two: null as any,
    },
    username: "",
    name: {
      first_name: "",
      last_name: "",
    },
  },
];

const chatMemberSlice = createSlice({
  name: "chatMember",
  initialState,
  reducers:{
    addMember: (state, action) => {
      // will add logic here in the future
    },

    removeMember: (state, action) => {
      // will add logic here in the future
    }
  },
  extraReducers(builder){
    builder.addCase(getChatMembers.rejected, (state, action) => {
      console.log("MEMBER REJECT: ", action?.payload?.message);
    });

    builder.addCase(getChatMembers.fulfilled, (state, action) => {
      const data = action.payload.list;
      let organizedState = [];

      for (let i = 0; i < data.length; i++) {

        const members = {
          user_one: data[i].user_one,
          user_two: data[i].user_two,
        };

        const name = {
          first_name: data[i].first_name,
          last_name: data[i].last_name,
        };

        organizedState.push({
          conversation_id: data[i].conversation_id,
          members,
          username: data[i].username,
          name,
        });
      }
      
      return [...organizedState];
    });
  }
});

export const { addMember } = chatMemberSlice.actions;
export default chatMemberSlice.reducer;