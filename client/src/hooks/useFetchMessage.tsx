import { useState, useEffect } from 'react'
import { MessageType } from '../interfaces/types'
import { useLazyGetChatMessagesQuery } from '../redux/api/chatApi';
import { IEOpenConversation } from '../interfaces/interface';
import SocketService from '../services/SocketServices';

type useFetchMessageProps = {
  socketService: SocketService;
  openConversation: IEOpenConversation;
}

function useFetchMessage({ socketService, openConversation }: useFetchMessageProps) {
  const [comingMessage, setComingMessage] = useState<MessageType[] | null[]>([]);
  const [getChatMessages, allChatMessages] = useLazyGetChatMessagesQuery();

  useEffect(() => {
    getChatMessages({ conversation_id: openConversation.conversation_id });

    socketService.onMessageReceived((message: any) => {
      setComingMessage((prev: any) => [...prev, { ...message }]);
    });
  }, [getChatMessages, openConversation.conversation_id, socketService]);

  useEffect(() => {
    if (allChatMessages.error) {
      console.error(allChatMessages.error);
      return;
    }

    if (allChatMessages.data) {
      setComingMessage(allChatMessages?.data?.chats);
    }
  }, [allChatMessages, allChatMessages.error]);

  return { comingMessage, setComingMessage, isLoading: allChatMessages.isLoading, };
}

export default useFetchMessage
