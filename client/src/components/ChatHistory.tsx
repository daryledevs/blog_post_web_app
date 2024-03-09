import { useEffect } from "react";
import ChatHistoryRecipient from "./ChatHistoryRecipient";
import { useGetUserConversationsMutation } from "../redux/api/chatApi";

type ChatHistoryProps = {
  user: any;
};

function ChatHistory({ user }: ChatHistoryProps) {
  const [getUsersConversations, chatHistory] = useGetUserConversationsMutation();

  useEffect(() => {
    getUsersConversations({ user_id: user.user_id, conversations: [] });
  }, []);
  
  if (chatHistory.isLoading || !chatHistory.data) return null;

  return (
    <div className="chat-history__container">
      {chatHistory?.data?.list?.map((chat: any, index: number) => {
        return (
          <ChatHistoryRecipient
            key={index}
            chat={chat}
          />
        );
      })}
    </div>
  );
}

export default ChatHistory;
