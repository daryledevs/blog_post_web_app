import React, { useCallback }         from 'react';
import SocketService                  from '@/services/SocketServices';
import { MessageType }                from '@/interfaces/interface';

import { useAppSelector }             from './reduxHooks';
import { selectMessage }              from '@/redux/slices/messageSlice';
import { useGetUserDataQuery }        from '@/redux/api/userApi';
import { useSendNewMessagesMutation } from "@/redux/api/chatApi"; 

type useSendMessageProps = {
  socketService: SocketService | null;
  newMessage: any;
  setComingMessage: React.Dispatch<React.SetStateAction<Array<any>>>;
  setNewMessage: React.Dispatch<React.SetStateAction<any>>;
};

function useSendMessage({
  newMessage,
  socketService,
  setComingMessage,
  setNewMessage,
}: useSendMessageProps) {
  const { openConversation } = useAppSelector(selectMessage);
  const [sendMessage] = useSendNewMessagesMutation({
    fixedCacheKey: "send-message-api",
  });

  const userDataApi = useGetUserDataQuery();
  const senderUuid = userDataApi.data?.user?.uuid;

  // returning it, to make an instance of this function
  return useCallback(() => {
    if (!newMessage?.text_message || !socketService || !senderUuid) return;
    const data = {
      conversationUuid: openConversation[0]?.uuid,
      receiverUuid: openConversation[0]?.userUuid,
      textMessage: newMessage?.text_message,
    };

    sendMessage(data);
    socketService.sendMessage({ ...data, senderUuid });
    setNewMessage({ text_message: "" });
    setComingMessage((prev: MessageType[]) => [{ ...data, senderUuid }, ...prev]);
  }, [newMessage, senderUuid, openConversation, socketService]);
}

export default useSendMessage;