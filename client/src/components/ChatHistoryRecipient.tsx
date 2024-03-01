import usersPicture from "../assets/icons/avatar.png";
import { useAppDispatch } from "../hooks/reduxHooks";
import { setOpenConversation } from "../redux/slices/messageSlice";

type ChatHistoryRecipientProps = {
  chat: any;
};

function ChatHistoryRecipient({ chat }: ChatHistoryRecipientProps) {
  const dispatch = useAppDispatch();

  return (
    <div
      key={chat.conversation_id}
      className="chat-history__recipient"
      onClick={() => dispatch(setOpenConversation(chat))}
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

export default ChatHistoryRecipient;
