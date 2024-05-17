import React, { useCallback }         from 'react';
import SocketService                  from '@/services/SocketServices';
import { MessageType }                from '@/interfaces/types';
import { useGetUserDataQuery }        from '@/redux/api/userApi';
import { useSendNewMessagesMutation } from "@/redux/api/chatApi"; 

type useSendMessageProps = {
  openConversation: any;
  socketService: SocketService | null;
  newMessage: any;
  setComingMessage: React.Dispatch<React.SetStateAction<Array<any>>>;
  setNewMessage: React.Dispatch<React.SetStateAction<any>>;
};

function useSendMessage({
  newMessage,
  openConversation,
  socketService,
  setComingMessage,
  setNewMessage,
}: useSendMessageProps) {
  const [sendMessage] = useSendNewMessagesMutation();
  const userDataApi = useGetUserDataQuery({ person: "" });

  // returning it, to make an instance of this function
  return useCallback(() => {
    if (!newMessage?.text_message || !socketService) return;
    const user = userDataApi?.data?.user;
    const { user_two_id, user_one_id, conversation_id } = openConversation[0];

    const receiver_id =
      user_one_id !== user.user_id ? user_one_id : user_two_id;

    const data = {
      sender_id: user.user_id,
      receiver_id: receiver_id,
      conversation_id: conversation_id,
      text_message: newMessage.text_message,
    };

    sendMessage(data);
    socketService.sendMessage(data);
    setNewMessage({ text_message: "" });
    setComingMessage((prev: MessageType[]) => [{ ...data }, ...prev]);
  }, [newMessage, userDataApi, openConversation, socketService]);
}

export default useSendMessage;