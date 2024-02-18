import { useState, useEffect } from 'react'
import { MessageType } from '../interfaces/types'
import { useLazyGetChatMessagesQuery } from '../redux/api/ChatApi';

function useFetchMessage({ socket, openConversation }:any) {
  const [comingMessage, setComingMessage] = useState<MessageType[] | null[]>([]);
  const [getChatMessages, allChatMessages] = useLazyGetChatMessagesQuery();
  const { onMessageReceived } = socket;

  useEffect(() => {
    getChatMessages({ conversation_id: openConversation.conversation_id });
  }, [getChatMessages, openConversation.conversation_id]);

  useEffect(() => {
    onMessageReceived((message: any) => {
      setComingMessage((prev: any) => [...prev, { ...message }]);
    });
  }, [onMessageReceived]);

  useEffect(() => {
    if (allChatMessages.data) {
      setComingMessage(allChatMessages?.data?.chats);
    }
  }, [allChatMessages]);

  useEffect(() => {
    if (allChatMessages.error) {
      console.log(allChatMessages.error);
    }
  }, [allChatMessages.error]);

  return { comingMessage, setComingMessage, isLoading: allChatMessages.isLoading, };
}

export default useFetchMessage
