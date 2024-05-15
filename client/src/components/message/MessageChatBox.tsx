import ChatBox            from "./chatbox/ChatBox";
import SocketService      from "@/services/SocketServices";
import MessageNotView     from "./MessageNotView";
import { selectMessage }  from "@/redux/slices/messageSlice";
import { useAppSelector } from "@/hooks/reduxHooks";

type MessageChatBoxProps = {
  socketService: SocketService;
};

function MessageChatBox({ socketService }: MessageChatBoxProps) {
  const messages = useAppSelector(selectMessage);

  return (
    <div className="message-chat-box">
      {messages.openConversation.length ? (
        <ChatBox socketService={socketService} />
      ) : (
        <MessageNotView />
      )}
    </div>
  );
}

export default MessageChatBox;
