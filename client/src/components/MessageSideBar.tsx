import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";

type MessageSideBarProps = {
  user: any;
};

function MessageSideBar({ user }: MessageSideBarProps) {

  return (
    <div className="message__sidebar">
      <ChatHeader user={user} />
      <ChatHistory  user={user} />
    </div>
  );
}

export default MessageSideBar;
