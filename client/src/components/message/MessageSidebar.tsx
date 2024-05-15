import { useEffect }                       from "react";
import ChatHeader                          from "./chat-header/ChatHeader";
import ChatHistory                         from "./chat-history/ChatHistory";
import { useGetUserConversationsMutation } from "@/redux/api/chatApi";

type MessageSidebarProps = {
  user: any;
};

function MessageSidebar({ user }: MessageSidebarProps) {
  const [
    getUsersConversations, 
    chatHistory
  ] = useGetUserConversationsMutation();

  useEffect(() => {
    getUsersConversations({ 
      user_id: user.user_id,
      conversations: [] 
    });
  }, []);

  return (
    <div className="message-sidebar">
      <ChatHeader user={user} />
      <ChatHistory
        isLoading={chatHistory.isLoading || !chatHistory.data}
        list={chatHistory?.data?.chats}
      />
    </div>
  );
}

export default MessageSidebar;
