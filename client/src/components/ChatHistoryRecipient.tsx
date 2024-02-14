import usersPicture from "../assets/icons/avatar.png";

type ChatHistoryRecipientProps = {
  user: any;
  chat: any,
  setOpenConversation: (id: string) => void;
};

function ChatHistoryRecipient({ user, chat, setOpenConversation }: ChatHistoryRecipientProps) {
  return (
    <div
      key={chat.conversation_id}
      className="chat-history__recipient"
      onClick={() => setOpenConversation(chat?.conversation_id)}
    >
      <img
        src={usersPicture}
        width="10.6%"
        height="29"
        alt=""
      />
      <div className="chat-history__details">
        <p>
          {chat.name.first_name} {chat.name.last_name}
        </p>
        <p>
          {chat?.[chat.length - 1]?.sender_id === user.user_id && "You: "}{" "}
          {chat?.[chat.length - 1]?.text_message}
        </p>
      </div>
    </div>
  );
}

export default ChatHistoryRecipient
