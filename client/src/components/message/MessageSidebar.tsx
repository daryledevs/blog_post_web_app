import {
  useGetUserConversationsMutation,
  useSendNewMessagesMutation,
}                    from "@/redux/api/chatApi";
import { useEffect } from "react";
import ChatHeader    from "./chat-header/ChatHeader";
import ChatHistory   from "./chat-history/ChatHistory";

type MessageSidebarProps = {
  user: any;
};

function MessageSidebar({ user }: MessageSidebarProps) {
  const [getUsersConversations, chatHistory] =
    useGetUserConversationsMutation();

  const [, sendMessages] = useSendNewMessagesMutation({
    fixedCacheKey: "send-message-api",
  });

  useEffect(() => {
    getUsersConversations({
      user_id: user.user_id,
      conversations: [],
    });
  }, [sendMessages]);

  return (
    <div className="message-sidebar">
      <ChatHeader user={user} />
      <ChatHistory
        isLoading={chatHistory.isLoading || !chatHistory.data}
        list={chatHistory?.data?.chats || []}
      />
    </div>
  );
}

export default MessageSidebar;
