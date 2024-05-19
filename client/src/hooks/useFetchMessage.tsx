import React, { useState, useEffect }  from "react";

import { MessageType }                 from "@/interfaces/types";
import { IEOpenConversation }          from "@/interfaces/interface";

import SocketService                   from "@/services/SocketServices";
import { useLazyGetChatMessagesQuery } from "@/redux/api/chatApi";
import scrollChatIntoView              from "@/shared/utils/scrollChatIntoView";

type useFetchMessageProps = {
  inView: boolean;
  chatListRef: React.RefObject<HTMLDivElement> | null;
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
  chatListRef,
  socketService,
  openConversation,
}: useFetchMessageProps): useFetchMessageReturn {
  const conversationId = openConversation?.[0]?.conversation_id;
  const [comingMessage, setComingMessage] = useState<MessageType[]>([]);
  const [scrollView, setScrollView] = useState<boolean>(false);

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
  }, [socketService]);

  // UseEffect to fetch initial data for chat messages
  useEffect(() => {
    getChatMessages({ conversation_id: conversationId, messages: [] });
  }, []);

  // UseEffect to fetch chat messages when the user scrolls to the top
  useEffect(() => {
    if (!inView) return;
    const ids = comingMessage.map((item) => item.message_id);
    getChatMessages({ conversation_id: conversationId, messages: ids });
  }, [getChatMessages, inView]);

  // UseEffect to handle the result of the fetch and error states
  useEffect(() => {
    if (chatMessagesError) {
      console.error(chatMessagesError);
      return;
    }

    if (allChatMessages?.messages && chatListRef?.current) {
      setComingMessage((prev) => {
        const messages = [...prev, ...allChatMessages.messages];
        return messages.sort((a, b) => a.message_id - b.message_id);
      });

      if (scrollView) return;
      scrollChatIntoView(chatListRef, () => setScrollView(true));
    }
  }, [allChatMessages?.messages, chatMessagesError]);

  return {
    comingMessage,
    setComingMessage,
    isLoading,
  };
}

export default useFetchMessage;
