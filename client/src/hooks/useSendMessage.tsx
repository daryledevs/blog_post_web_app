import { useCallback } from 'react';

function useSendMessageHandler({
  userDataApi,
  openConversation,
  clearMessage,
  sendMessage,
  setComingMessage,
  setClearMessage,
  newMessage,
}: any) {
  // returning it, to make an instance of this function
  return useCallback(() => {
    if (!newMessage?.text_message) return;
    const user = userDataApi;
    const { user_two, user_one, conversation_id } = openConversation;
    const receiver_id = user_one !== user.user_id ? user_one : user_two;

    const data = {
      sender_id: userDataApi.user_id,
      receiver_id: receiver_id,
      conversation_id: conversation_id,
      text_message: newMessage.text_message,
    };

    const { receiver_id: _, ...rest } = data;

    sendMessage(data);
    setComingMessage((prev: any) => [...prev, { ...rest }]);
    setClearMessage(!clearMessage);
  }, [newMessage, userDataApi, openConversation, clearMessage]);
}

export default useSendMessageHandler;