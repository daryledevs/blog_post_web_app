import ChatBox from "./ChatBox";
import { IEOpenConversation } from "../interfaces/interface";
import SocketService from '../services/SocketServices';

type MessageChatBoxProps = {
  openConversation: IEOpenConversation | null;
  socketService: SocketService;
};

function MessageChatBox({ openConversation, socketService }: MessageChatBoxProps) {
  return (
    <div className="message__conversation-container">
      {openConversation ? (
        <ChatBox
          openConversation={openConversation}
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
