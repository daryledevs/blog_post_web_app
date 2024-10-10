import baseApi from "./baseApi";
import { IChat, IConversation } from "@/interfaces/interface";

// delete this comment when you get back to code, all of these are updated
// just change the custom effects and integrate it with the new api
const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // useGetUserConversationsMutation
    getUserConversations: build.mutation<
      { conversations: IConversation[] },
      { userUuid: string; conversationUuids: string[] }
    >({
      query: ({ userUuid, conversationUuids }) => ({
        url: `/chats/${userUuid}/conversations`,
        method: "POST",
        body: { conversationUuids },
      }),
    }),
    // useLazyGetChatMessagesQuery
    getChatMessages: build.query<
      { messages: IChat[] },
      { conversationUuid?: string; messageIds?: string[] }
    >({
      query: ({ conversationUuid, messageIds }) => ({
        url: `/chats/${conversationUuid}/messages`,
        method: "POST",
        body: { messageIds },
      }),
    }),
    // useSendNewMessagesMutation
    sendNewMessages: build.mutation<
      any,
      {
        conversationUuid: string;
        receiverUuid: string;
        textMessage: any;
      }
    >({
      query: ({ receiverUuid, textMessage, conversationUuid }) => ({
        url: `/chats/${conversationUuid}/conversation/${receiverUuid}/user`,
        method: "POST",
        body: { conversationUuid, receiverUuid, textMessage },
      }),
    }),
  }),
});

export const {
  useGetUserConversationsMutation,
  useLazyGetChatMessagesQuery,
  useSendNewMessagesMutation,
} = chatApi;
