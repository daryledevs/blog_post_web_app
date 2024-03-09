import baseApi from "./baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChatMessages: build.query<any, { conversation_id: number, messages: any[] }>({
      query: ({ conversation_id, messages }) => ({
        url: `/chats/${conversation_id}/messages`,
        method: "POST",
        body: { messages }
      }),
    }),
    getUserConversations: build.mutation<
      any,
      { user_id: any; conversations: number[] }
    >({
      query: ({ user_id, conversations }) => ({
        url: `/chats/lists?user_id=${user_id}`,
        method: "POST",
        body: { conversations },
      }),
    }),
    sendNewMessages: build.query<
      any,
      { sender_id: any; text_message: string; conversation_id: any }
    >({
      query: ({ sender_id, text_message, conversation_id }) => ({
        url: `/chats`,
        method: "POST",
        body: { sender_id, text_message, conversation_id },
      }),
    }),
  }),
});

export const { useLazyGetChatMessagesQuery, useGetUserConversationsMutation, useSendNewMessagesQuery } =
  chatApi;
