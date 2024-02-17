import baseApi from "./BaseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllChats: build.query<any, { user_id: any; conversation_id: string }>({
      query: ({ user_id, conversation_id }) => ({
        url: `/chats/get-all-chats/${user_id}/?conversation_id={${conversation_id}}`,
        method: "GET",
      }),
    }),
    getChatMembers: build.query<any, void>({
      query: (user_id) => ({
        url: `/chats/${user_id}`,
        method: "GET",
      }),
    }),
    getChatMessages: build.query<any, { conversation_id: number }>({
      query: ({ conversation_id }) => ({
        url: `/chats/message/${conversation_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllChatsQuery, useGetChatMembersQuery, useLazyGetChatMessagesQuery } = chatApi;
