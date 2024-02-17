import usersPicture from "../assets/icons/avatar.png";
import { IEOpenConversation } from "../interfaces/interface";

type ChatHistoryRecipientProps = {
  chat: any;
  setOpenConversation: (value: IEOpenConversation| null) => void;
};

function ChatHistoryRecipient({ chat, setOpenConversation }: ChatHistoryRecipientProps) {
  return (
    <div
      key={chat.conversation_id}
      className="chat-history__recipient"
      onClick={() => setOpenConversation(chat)}
    >
      <img
        src={chat.avatar_url ? chat.avatar_url : usersPicture}
        width="10.6%"
        height="29"
        alt=""
      />
      <div className="chat-history__details">
        <p>
          {chat.first_name} {chat.last_name}
        </p>
      </div>
    </div>
  );
}

export default ChatHistoryRecipient
