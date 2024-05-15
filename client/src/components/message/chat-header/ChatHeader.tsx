import { IEUserState }     from "@/interfaces/interface";
import HeaderNewMessage    from "./HeaderNewMessage";
import HeaderSwitchAccount from "./HeaderSwitchAccount";

function ChatHeader({ user }: { user: IEUserState }) {
  return (
    <div className="chat-header">
      <HeaderSwitchAccount username={user.username} />
      <HeaderNewMessage />
    </div>
  );
}

export default ChatHeader;
