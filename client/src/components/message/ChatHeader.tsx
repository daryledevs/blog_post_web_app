import {
  setNewMessageTrigger,
  setSwitchAccountTrigger,
}                         from "../../redux/slices/messageSlice";
import downArrow          from "../../assets/icons/down-arrow.png";
import newMessage         from "../../assets/icons/editing.png";
import { useAppDispatch } from "../../hooks/reduxHooks";

type ChatHeaderProps = {
  user: any;
};

function ChatHeader({ user }: ChatHeaderProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="chat-header__container">
      <div />
      <div
        onClick={() => dispatch(setSwitchAccountTrigger())}
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
        onClick={() => dispatch(setNewMessageTrigger())}
        className="chat-header__new-message-icon"
      />
    </div>
  );
}

export default ChatHeader;
