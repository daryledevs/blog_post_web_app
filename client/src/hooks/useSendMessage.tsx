import { useCallback, useEffect }                from 'react';
import { MessageType }                from '@/interfaces/types';
import { useSendNewMessagesMutation } from "@/redux/api/chatApi"; 
import SocketService from '@/services/SocketServices';

type useSendMessageHandlerProps = {
  userDataApi: any;
  openConversation: any;
  clearMessage: boolean;
  socketService: SocketService | null;
  newMessage: any;
  setComingMessage: React.Dispatch<React.SetStateAction<Array<any>>>;
  setClearMessage: React.Dispatch<React.SetStateAction<boolean>>;
};

function useSendMessageHandler({
  userDataApi,
  openConversation,
  clearMessage,
  socketService,
  setComingMessage,
  setClearMessage,
  newMessage,
}: useSendMessageHandlerProps) {
  const [sendMessage, ] = useSendNewMessagesMutation();

  // returning it, to make an instance of this function
  return useCallback(() => {
    if (!newMessage?.text_message || !socketService) return;
    const user = userDataApi;
    const { user_two_id, user_one_id, conversation_id } = openConversation[0];

    const receiver_id =
      user_one_id !== user.user_id ? user_one_id : user_two_id;

    const data = {
      sender_id: userDataApi.user_id,
      receiver_id: receiver_id,
      conversation_id: conversation_id,
      text_message: newMessage.text_message,
    };

    sendMessage(data);
    socketService.sendMessage(data);
    setComingMessage((prev: MessageType[]) => [...prev, { ...data }]);
    setClearMessage(!clearMessage);
  }, [newMessage, userDataApi, openConversation, clearMessage, socketService]);
}

export default useSendMessageHandler;