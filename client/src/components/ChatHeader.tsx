import downArrow from "../assets/icons/down-arrow.png";
import newMessage from "../assets/icons/editing.png";

type ChatHeaderProps = {
  user: any;
  newMessageTrgger: boolean;
  switchAccountTrggr: boolean;
  setSwitchAccountTrggr: (value: boolean) => void;
  setNewMessageTrgger: (value: boolean) => void;
};

function ChatHeader({
  user,
  switchAccountTrggr,
  newMessageTrgger,
  setSwitchAccountTrggr,
  setNewMessageTrgger,
}: ChatHeaderProps) {
  
  return (
    <div className="chat-header__container">
      <div />
      <div
        onClick={() => setSwitchAccountTrggr(!switchAccountTrggr)}
        className="chat-header__username"
      >
        <p>{user.username}</p>
        <img
          src={downArrow}
          className="chat-header__username-icon"
          alt=""
        />
      </div>
      <img
        alt=""
        src={newMessage}
        onClick={() => setNewMessageTrgger(!newMessageTrgger)}
        className="chat-header__new-message-icon"
      />
    </div>
  );
}

export default ChatHeader
