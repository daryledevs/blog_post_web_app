import React, { useState, useEffect }  from "react";

import { MessageType }                 from "@/interfaces/types";
import { IEOpenConversation }          from "@/interfaces/interface";

import SocketService                   from "@/services/SocketServices";
import { useLazyGetChatMessagesQuery } from "@/redux/api/chatApi";

type useFetchMessageProps = {
  inView: boolean;
  socketService: SocketService | null;
  openConversation: IEOpenConversation[];
};

type useFetchMessageReturn = {
  comingMessage: MessageType[] | null[];
  setComingMessage: any;
  isLoading: boolean;
};

function useFetchMessage({
  inView,
  socketService,
  openConversation,
}: useFetchMessageProps): useFetchMessageReturn {
  const conversationId = openConversation?.[0]?.conversation_id;
  const [comingMessage, setComingMessage] = useState<MessageType[]>([]);

  const [
    getChatMessages,
    { data: allChatMessages, error: chatMessagesError, isLoading },
  ] = useLazyGetChatMessagesQuery();

  // UseEffect to handle real-time messages received via socket
  useEffect(() => {
    if (!socketService) return;

    const handleMessageReceived = (message: MessageType) => {
      setComingMessage((prev) => [message, ...prev]);
    };

    socketService.onMessageReceived(handleMessageReceived);

    // Cleanup function to remove the event listener
    // when the component unmounts or dependencies change
    return () => {
      socketService.onMessageReceived(handleMessageReceived);
      setComingMessage([]);
    };
  }, [socketService]);

  // UseEffect to fetch chat messages when the conversation changes
  useEffect(() => {
    if (!conversationId) return;
    getChatMessages({ conversation_id: conversationId, messages: [] });
  }, [getChatMessages]);

  // UseEffect to fetch chat messages when the user scrolls to the top
  useEffect(() => {
    if(!inView) return;
    const ids = comingMessage.map((item) => item.message_id);
    getChatMessages({ conversation_id: conversationId, messages: ids });
  }, [getChatMessages, inView]);

  // UseEffect to handle the result of the fetch and error states
  useEffect(() => {
    if (chatMessagesError) {
      console.error(chatMessagesError);
      return;
    }

    if (allChatMessages?.messages) {
      setComingMessage((prev) => [...prev, ...allChatMessages.messages]);
    }
  }, [allChatMessages, chatMessagesError]);

  return {
    comingMessage,
    setComingMessage,
    isLoading,
  };
}

export default useFetchMessage;
