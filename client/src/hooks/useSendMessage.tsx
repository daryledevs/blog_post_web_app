import React, { useCallback }         from 'react';
import SocketService                  from '@/services/SocketServices';
import { MessageType }                from '@/interfaces/interface';
import { useGetUserDataQuery }        from '@/redux/api/userApi';
import { useSendNewMessagesMutation } from "@/redux/api/chatApi"; 
import { useAppSelector } from './reduxHooks';
import { selectMessage } from '@/redux/slices/messageSlice';

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

  const userDataApi = useGetUserDataQuery({ person: "" });

  // returning it, to make an instance of this function
  return useCallback(() => {
    if (!newMessage?.text_message || !socketService) return;
    const user = userDataApi?.data?.user;
    const conversation_id = openConversation[0]?.conversation_id;
    const user_id = openConversation[0]?.user_id;
    const user_one_id = openConversation[0]?.user_one_id;
    const user_two_id = openConversation[0]?.user_two_id;
  
    const receiver_id =
      user_one_id && user_one_id !== user.user_id
        ? user_one_id
        : user_two_id
        ? user_two_id
        : user_id;

    const data = {
      sender_id: user.user_id,
      receiver_id: receiver_id,
      conversation_id: conversation_id || null,
      text_message: newMessage?.text_message,
      message_id: newMessage?.message_id || null,
    };

    sendMessage(data);
    socketService.sendMessage(data);
    setNewMessage({ text_message: "" });
    setComingMessage((prev: MessageType[]) => [{ ...data }, ...prev]);
  }, [newMessage, userDataApi, openConversation, socketService]);
}

export default useSendMessage;