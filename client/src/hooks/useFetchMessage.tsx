import {
  useGetUserConversationsByUsersIdMutation,
  useLazyGetChatMessagesQuery,
}                                     from "@/redux/api/chatApi";
import React, { useState, useEffect } from "react";
import SocketService                  from "@/services/SocketServices";
import { MessageType }                from "@/interfaces/interface";
import { selectMessage }              from "@/redux/slices/messageSlice";
import { useAppSelector }             from "./reduxHooks";
import { useGetUserDataQuery }        from "@/redux/api/userApi";

type useFetchMessageProps = {
  inView: boolean;
  chatListRef: React.RefObject<HTMLDivElement> | null;
  socketService: SocketService | null;
};

type useFetchMessageReturn = {
  comingMessage: MessageType[] | null[];
  setComingMessage: any;
  isLoading: boolean;
};

function useFetchMessage({
  inView,
  chatListRef,
  socketService,
}: useFetchMessageProps): useFetchMessageReturn {
  const { openConversation, recipients } = useAppSelector(selectMessage);
  const conversationId = openConversation?.[0]?.conversation_id;
  const [comingMessage, setComingMessage] = useState<MessageType[]>([]);

  const userDataApi = useGetUserDataQuery(
    { person: "" },
    { skip: !!conversationId }
  );

  const [
    getChatMessages,
    {
      data: allChatMessages,
      error: chatMessagesError,
      isLoading: chatMessagesLoading,
    },
  ] = useLazyGetChatMessagesQuery();

  const [
    getConversations,
    {
      data: conversationData,
      error: conversationApiError,
      isLoading: conversationLoading,
    },
  ] = useGetUserConversationsByUsersIdMutation({
    fixedCacheKey: "conversation-api",
  });

  // UseEffect to handle real-time messages received via socket
  useEffect(() => {
    if (!socketService) return;

    const handleMessageReceived = (message: MessageType) => {
      setComingMessage(
        (prev: MessageType[]) => [message, ...prev] as MessageType[]
      );
    };

    socketService.onMessageReceived(handleMessageReceived);
  }, [socketService]);

  // UseEffect to reset the chat messages when a new conversation is opened
  useEffect(() => {
    if (openConversation.length) {
      setComingMessage([]);
    }
  }, [openConversation]);

  // UseEffect to fetch initial data for chat messages
  useEffect(() => {
    if (!conversationId) return;
    getChatMessages({ conversation_id: conversationId, messages: [] });
  }, [conversationId]);

  // UseEffect to set the initial data for chat messages
  useEffect(() => {
    if (inView && allChatMessages?.messages) {
      setComingMessage((prev: MessageType[]) => [
        ...prev,
        ...allChatMessages.messages,
      ]);
    }
  }, [allChatMessages?.messages]);

  // UseEffect to fetch conversation data if from new message modal
  useEffect(() => {
    if (!conversationId && userDataApi.data?.user) {
      const person = userDataApi.data.user;
      const otherPerson = openConversation[0];

      getConversations({
        user_one_id: person.user_id,
        user_two_id: otherPerson.user_id,
      });
    }
  }, [openConversation, userDataApi.data?.user]);

  // UseEffect to fetch chat messages when the user scrolls to the top
  useEffect(() => {
    const ids = comingMessage
      .map((item) => item?.message_id)
      .filter((id) => id !== null) as number[];

    if (inView && conversationId) {
      getChatMessages({
        conversation_id: conversationId,
        messages: ids,
      });
    } else if (conversationData?.conversation) {
      const newId = conversationData.conversation.conversation_id;
      getChatMessages({ conversation_id: newId, messages: ids });
    }
    // 'comingMessage' as a dependency to update the chat messages as request payload
    // 'conversationData' as a dependency to perform the fetch request with new id
    // 'inView' as a dependency to trigger the fetch request when the user scrolls
  }, [inView, conversationData?.conversation, comingMessage]);

  // useEffect to set/update the chat messages data when the user scrolls
  useEffect(() => {
    if (inView && allChatMessages?.messages) {
      setComingMessage((prev: MessageType[]) => [
        ...prev,
        ...allChatMessages.messages,
      ]);
    }
    // 'inView' as a dependency to set//update the fetch response's data
  }, [inView]);

  // UseEffect to fetch conversation data when the user opens a new conversation
  useEffect(() => {
    if (conversationData?.conversation) {
      const conversation = conversationData.conversation;
      getChatMessages({
        conversation_id: conversation.conversation_id,
        messages: [],
      });
    }
  }, [conversationData?.conversation]);

  return {
    comingMessage: comingMessage as MessageType[] | null[],
    setComingMessage,
    isLoading: chatMessagesLoading || conversationLoading,
  };
}

export default useFetchMessage;
