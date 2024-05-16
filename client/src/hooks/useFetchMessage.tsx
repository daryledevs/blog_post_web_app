import { useState, useEffect } from "react";

import { MessageType } from "@/interfaces/types";
import { IEOpenConversation } from "@/interfaces/interface";

import SocketService from "@/services/SocketServices";
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
}: useFetchMessageProps): useFetchMessageReturn | any {
  const [comingMessage, setComingMessage] = useState<MessageType[] | null[]>(
    []
  );
  const [getChatMessages, allChatMessages] = useLazyGetChatMessagesQuery();

  useEffect(() => {
    getChatMessages({
      conversation_id: openConversation?.[0]?.conversation_id,
      messages: [],
    });

    socketService?.onMessageReceived((message: any) => {
      setComingMessage((prev: any) => [...prev, { ...message }]);
    });
  }, [getChatMessages, openConversation, socketService]);

  useEffect(() => {
    if (allChatMessages.error) {
      console.error(allChatMessages.error);
      return;
    }

    if (allChatMessages.data) {
      setComingMessage(allChatMessages?.data?.messages);
    }
  }, [allChatMessages, allChatMessages.error]);

  if (!socketService) return null;

  return {
    comingMessage,
    setComingMessage,
    isLoading: allChatMessages.isLoading,
  };
}

export default useFetchMessage;
