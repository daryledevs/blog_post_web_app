import usersPicture from "@/assets/icons/avatar.png";
import UserAvatar   from "@/shared/components/UserComponents/UserAvatar";

type ChatBoxMessageCardProps = {
  value: string;
  text_message: string;
};

function ChatBoxMessageCard({ value, text_message }: ChatBoxMessageCardProps) {
  return (
    <div
      className={`
        chat-box-message-card 
        chat-box-message-${value}-card
      `}
    >
      <div
        className={`
          chat-box-message-card-container 
          chat-box-message-card-${value}-container
        `}
      >
        <UserAvatar
          avatar_url={usersPicture}
          className={`
            chat-box-message-card-image
            chat-box-message-card-${value}-image
          `}
        />
        <p
          className={`
            chat-box-message-card-text
            chat-box-message-card-${value}-text
          `}
        >
          {text_message}
        </p>
      </div>
    </div>
  );
};

export default ChatBoxMessageCard;
