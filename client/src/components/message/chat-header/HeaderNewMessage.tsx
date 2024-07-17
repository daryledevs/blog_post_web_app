import newMessage               from "@/assets/icons/editing.png";
import { useAppDispatch }       from "@/hooks/reduxHooks";
import { setNewMessageTrigger } from "@/redux/slices/messageSlice";

function HeaderNewMessage() {
  const dispatch = useAppDispatch();
  return (
    <img
      alt=""
      src={newMessage}
      onClick={() => dispatch(setNewMessageTrigger({}))}
      className="header-new-message"
    />
  );
}

export default HeaderNewMessage;
