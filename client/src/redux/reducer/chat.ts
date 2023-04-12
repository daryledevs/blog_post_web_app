import { createSlice, current } from "@reduxjs/toolkit";
import { getChatThunk } from "../action/chat";
import { IEChatState } from "../reduxIntface";

const initialState: Array<Array<IEChatState>> = [
  [
    {
      conversation_id: null as any,
      sender_id: null as any,
      members: {
        user_one: null as any,
        user_two: null as any,
      },
      message_id: null as any,
      username: null as any,
      name: {
        first_name: "",
        last_name: "",
      },
      text_message: null as any,
      time_sent: null as any,
    },
  ],
];

const getIndex = (stateInstance:any, action:any) => {
  let findState = stateInstance.find(function (state: any, index: any) {
    if (state[0].conversation_id === action.payload.conversation_id)
      return state;
  });

  let index = stateInstance.findIndex(
    (state: any, index: any) =>
      state[0].conversation_id === findState?.[0].conversation_id
  );

  return index;
};

const chatSlice = createSlice({
  name: "name",
  initialState,
  reducers:{

    addMessage: (state, action) =>{
      let stateInstance = [...current(state)];
      let index = getIndex(stateInstance, action);
      let stateContent = stateInstance[index];
      stateInstance[index] = [...stateContent, { ...action.payload }];
      return [...stateInstance];
    },

    getMessage: (state, action) => {
      let stateInstance = [...current(state)];
      let index = getIndex(stateInstance, action);
      let stateContent = stateInstance[index];
      let { sender_id, text_message, conversation_id, ...rest } = stateContent[0];
      stateInstance[index] = [...stateContent, { ...rest, ...action.payload }];
      return [...stateInstance];
    }
  },

  extraReducers(builder) {
    builder.addCase(getChatThunk.rejected, (state, action) => {
      console.log("CHAT REJECT: ", action?.payload?.message);
    });

    builder.addCase(getChatThunk.fulfilled, (state, action) => {
      const data = action.payload;
      let organizedState: any[][] = [];

      for (let i = 0; i < data.length; i++) {
        organizedState[i] = [];

        for(let j = 0; j < data[i].length; j++){

          const members = {
            user_one: data[i][j].user_one,
            user_two: data[i][j].user_two,
          };

          const name = {
            first_name: data[i][j].first_name,
            last_name: data[i][j].last_name,
          };

          organizedState[i].push({
            conversation_id: data[i][j].conversation_id,
            sender_id: data[i][j].sender_id,
            members,
            message_id: data[i][j].message_id,
            username: data[i][j].username,
            name,
            text_message: data[i][j].text_message,
            time_sent: data[i][j].time_sent,
          });
        }
      }
      
      return [...organizedState];
    });
  },
});

export const { addMessage, getMessage } = chatSlice.actions;
export default chatSlice.reducer;