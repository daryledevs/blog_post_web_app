import closeModal               from "@/assets/icons/close.png";
import { useAppDispatch }       from '@/hooks/reduxHooks';
import { setNewMessageTrigger } from '@/redux/slices/messageSlice';

function NewMessageHeader() {
  const dispatch = useAppDispatch();
  return (
    <div className="new-message-header">
      <p>New message</p>
      <img
        alt=""
        src={closeModal}
        onClick={() => dispatch(setNewMessageTrigger({}))}
      />
    </div>
  );
}

export default NewMessageHeader
