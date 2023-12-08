import baseApi from "./BaseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllChats: build.query<any, { length: any; user_id: any }>({
      query: ({ length, user_id }) => ({
        url: `/chats/${length}/${user_id}`,
        method: "GET",
      }),
    }),
    getChatMembers: build.query<any, void>({
      query: (user_id) => ({
        url: `/chats/${user_id}`,
        method: "GET"
      }),
    }),
  }),
});

export const { useGetAllChatsQuery, useGetChatMembersQuery } = chatApi;