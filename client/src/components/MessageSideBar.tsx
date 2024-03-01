import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import { useGetAllChatsQuery } from "../redux/api/ChatApi";

type MessageSideBarProps = {
  user: any;
};

function MessageSideBar({ user }: MessageSideBarProps) {
  const chatMembers = useGetAllChatsQuery({
    user_id: user.user_id,
    conversation_id: "",
  });

  if (chatMembers.isLoading) return null;

  return (
    <div className="message__sidebar">
      <ChatHeader user={user} />
      <ChatHistory chatMembers={chatMembers?.data.data} />
    </div>
  );
}

export default MessageSideBar;
