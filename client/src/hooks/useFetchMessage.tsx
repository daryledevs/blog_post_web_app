import React, { useState, useEffect } from "react";
import { IChat, MessageType } from "@/interfaces/interface";

import {
  useGetUserConversationsMutation,
  useLazyGetChatMessagesQuery,
} from "@/redux/api/chatApi";
import SocketService from "@/services/SocketServices";
import { selectMessage } from "@/redux/slices/messageSlice";
import { useAppSelector } from "./reduxHooks";
import { useGetUserDataQuery } from "@/redux/api/userApi";

type useFetchMessageProps = {
  inView: boolean;
  chatListRef: React.RefObject<HTMLDivElement> | null;
  socketService: SocketService | null;
};

type useFetchMessageReturn = {
  comingMessage: MessageType[];
  setComingMessage: any;
  isLoading: boolean;
};

function useFetchMessage({
  inView,
  socketService,
}: useFetchMessageProps): useFetchMessageReturn {
  const userDataApi = useGetUserDataQuery();
  const { openConversation, recipients } = useAppSelector(selectMessage);
  const [comingMessage, setComingMessage] = useState<MessageType[]>([]);
  const userUuid = userDataApi?.data?.user.uuid;

  const [
    getChatMessages,
    { data: messagesData, isLoading: chatMessagesLoading },
  ] = useLazyGetChatMessagesQuery();

  const [
    getConversations,
    { data: conversationData, isLoading: conversationLoading },
  ] = useGetUserConversationsMutation({
    fixedCacheKey: "conversation-api",
  });

  // UseEffect to handle real-time messages received via socket
  useEffect(() => {
    if (!socketService) return;

    const handleMessageReceived = (message: MessageType) => {
      setComingMessage((prev: MessageType[]) => [message, ...prev]);
    };

    socketService.onMessageReceived(handleMessageReceived);
  }, [socketService]);

  // UseEffect to reset the chat messages when a new conversation is opened
  // and switch between the conversations
  useEffect(() => {
    if (openConversation.length) {
      setComingMessage([]);
    }
  }, [openConversation, messagesData]);

  // UseEffect to fetch conversation data if from new message modal
    useEffect(() => {
    if (userUuid) {
      getConversations({
        userUuid: userUuid,
        conversationUuids: []
      });
    }
  }, [openConversation, userUuid]);

  // UseEffect to fetch chat messages when the user scrolls to the top
  // and fetch the initial data when the user opens the conversation
  useEffect(() => {
    if (inView && openConversation.length === 1) {
      getChatMessages({
        conversationUuid: openConversation[0].uuid,
        messageIds: comingMessage
          .map((item) => item?.conversationUuid)
          .filter((id) => id !== null) as string[],
      });
    }
    // 'conversationData' as a dependency to perform the fetch request with new id
    // 'inView' as a dependency to trigger the fetch request when the user scrolls
  }, [inView, conversationData?.conversations, openConversation]);

  useEffect(() => {
    if (openConversation.length === 1) {
      const conversation = openConversation[0];
      getChatMessages({
        conversationUuid: conversation.uuid,
        messageIds: [],
      });
    }
  }, [openConversation]);  

  // useEffect to set/update the chat messages data when the user scrolls
  useEffect(() => {
    const data = messagesData?.messages;
    if (data?.length && openConversation?.length) {
      setComingMessage((prev: MessageType[]) => [
        ...prev,
        ...data.map((data, index) => ({
          ...data,
          receiverUuid: openConversation[0].userUuid,
        })),
      ]);
    }
    // 'inView' as a dependency to set//update the fetch response's data
  }, [messagesData?.messages, openConversation, userUuid]);

  return {
    comingMessage,
    setComingMessage,
    isLoading: chatMessagesLoading || conversationLoading,
  };
}

export default useFetchMessage;
