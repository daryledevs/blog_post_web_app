import {
  useGetUserConversationsMutation,
  useSendNewMessagesMutation,
}                      from "@/redux/api/chatApi";
import { useEffect }   from "react";
import { IEUserState } from "@/interfaces/interface";
import ChatHeader      from "./chat-header/ChatHeader";
import ChatHistory     from "./chat-history/ChatHistory";

function MessageSidebar({ user }: { user: IEUserState }) {
  const [getUsersConversations, chatHistory] =
    useGetUserConversationsMutation();

  const [, sendMessages] = useSendNewMessagesMutation({
    fixedCacheKey: "send-message-api",
  });

  useEffect(() => {
    getUsersConversations({
      user_id: user?.uuid,
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
