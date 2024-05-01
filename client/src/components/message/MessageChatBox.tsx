import ChatBox            from "./ChatBox";
import SocketService      from '../../services/SocketServices';
import { selectMessage }  from "../../redux/slices/messageSlice";
import { useAppSelector } from "../../hooks/reduxHooks";

type MessageChatBoxProps = {
  socketService: SocketService;
};

function MessageChatBox({ socketService }: MessageChatBoxProps) {
  const messages = useAppSelector(selectMessage);

  return (
    <div className="message__conversation-container">
      {messages.openConversation.length ? (
        <ChatBox
          socketService={socketService}
        />
      ) : (
        <p className="message__not-viewed">
          open a conversation to start a chat.
        </p>
      )}
    </div>
  );
}

export default MessageChatBox;
