import {
  useGetUserConversationsMutation,
  useSendNewMessagesMutation,
}                      from "@/redux/api/chatApi";
import { useEffect }   from "react";
import { IUser }       from "@/interfaces/interface";
import ChatHeader      from "./chat-header/ChatHeader";
import ChatHistory     from "./chat-history/ChatHistory";

function MessageSidebar({ user }: { user: IUser }) {
  const [getUsersConversations, chatHistory] =
    useGetUserConversationsMutation();

  const [, sendMessages] = useSendNewMessagesMutation({
    fixedCacheKey: "send-message-api",
  });

  useEffect(() => {
    getUsersConversations({
      userUuid: user?.uuid,
      conversationUuids: [],
    });
  }, [sendMessages]);

  return (
    <div className="message-sidebar">
      <ChatHeader user={user} />
      <ChatHistory
        isLoading={chatHistory.isLoading}
        list={chatHistory?.data?.conversations || []}
      />
    </div>
  );
}

export default MessageSidebar;
