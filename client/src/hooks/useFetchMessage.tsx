import { useState, useEffect }         from "react";

import { MessageType }                 from "@/interfaces/types";
import { IEOpenConversation }          from "@/interfaces/interface";

import SocketService                   from "@/services/SocketServices";
import { useLazyGetChatMessagesQuery } from "@/redux/api/chatApi";

type useFetchMessageProps = {
  socketService: SocketService | null;
  openConversation: IEOpenConversation[];
};

type useFetchMessageReturn = {
  comingMessage: MessageType[] | null[];
  setComingMessage: any;
  isLoading: boolean;
};

function useFetchMessage({
  socketService,
  openConversation,
}: useFetchMessageProps): useFetchMessageReturn | null {
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
    };
  }, [socketService]);

  // UseEffect to fetch chat messages when the conversation changes
  useEffect(() => {
    const conversationId = openConversation?.[0]?.conversation_id;
    if (!conversationId) return
    getChatMessages({ conversation_id: conversationId, messages: [] });
  }, [getChatMessages, openConversation]);

  // UseEffect to handle the result of the fetch and error states
  useEffect(() => {
    if (chatMessagesError) {
      console.error(chatMessagesError);
      return;
    }

    if (allChatMessages?.messages) {
      setComingMessage(allChatMessages.messages);
    }
  }, [allChatMessages, chatMessagesError]);

  if (!socketService) return null;

  return {
    comingMessage,
    setComingMessage,
    isLoading,
  };
}

export default useFetchMessage;
