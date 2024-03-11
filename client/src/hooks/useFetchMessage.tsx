import { useState, useEffect } from 'react'
import { MessageType } from '../interfaces/types'
import { useLazyGetChatMessagesQuery } from '../redux/api/chatApi';
import { IEOpenConversation } from '../interfaces/interface';
import SocketService from '../services/SocketServices';

type useFetchMessageProps = {
  userDataApi: any;
  socketService: SocketService;
  openConversation: IEOpenConversation[];
};

function useFetchMessage({ userDataApi, socketService, openConversation }: useFetchMessageProps) {
  const [comingMessage, setComingMessage] = useState<MessageType[] | null[]>([]);
  const [getChatMessages, allChatMessages] = useLazyGetChatMessagesQuery();

  useEffect(() => {
    getChatMessages({
      userId: userDataApi?.user_id,
      personId: openConversation?.[0]?.user_id,
      conversation_id: openConversation?.[0]?.conversation_id,
      messages: [],
    });

    socketService.onMessageReceived((message: any) => {
      setComingMessage((prev: any) => [...prev, { ...message }]);
    });
  }, [getChatMessages, openConversation, socketService]);

  useEffect(() => {
    if (allChatMessages.error) {
      console.error(allChatMessages.error);
      return;
    }

    if (allChatMessages.data) {
      const data = allChatMessages?.data
      const chatData = data?.message ? data?.message : data?.chats;
      setComingMessage(chatData);
    }
  }, [allChatMessages, allChatMessages.error]);

  return { comingMessage, setComingMessage, isLoading: allChatMessages.isLoading, };
}

export default useFetchMessage
