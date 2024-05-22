import { IEChatMessage, IEConversation } from "@/interfaces/interface";
import baseApi from "./baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserConversations: build.mutation<
      { chats: IEConversation[] },
      { user_id: any; conversations: number[] }
    >({
      query: ({ user_id, conversations }) => ({
        url: `/chats/lists?user_id=${user_id}`,
        method: "POST",
        body: { conversations },
      }),
    }),
    getUserConversationsByUsersId: build.mutation<
      { conversation: IEConversation },
      { user_one_id: number; user_two_id: number }
    >({
      query: ({ user_one_id, user_two_id }) => ({
        url: `/chats/users/${user_one_id}/${user_two_id}`,
        method: "GET",
      }),
    }),
    getChatMessages: build.query<
      { messages: IEChatMessage[] },
      { conversation_id?: number; messages?: number[] }
    >({
      query: ({ conversation_id, messages }) => ({
        url: `/chats/${conversation_id}/messages`,
        method: "POST",
        body: { messages },
      }),
    }),
    sendNewMessages: build.mutation<
      any,
      {
        sender_id: any;
        receiver_id: number;
        text_message: string;
        conversation_id: any;
      }
    >({
      query: ({ sender_id, receiver_id, text_message, conversation_id }) => ({
        url: `/chats`,
        method: "POST",
        body: { sender_id, receiver_id, text_message, conversation_id },
      }),
    }),
  }),
});

export const {
  useLazyGetChatMessagesQuery,
  useGetUserConversationsMutation,
  useSendNewMessagesMutation,
  useGetUserConversationsByUsersIdMutation,
} = chatApi;
