import { useCallback }     from "react";
import UserUsername        from "../../user/UserUsername";
import CloseIcon           from "@/assets/icons/svg/close-icon-blue.svg?react";
import { IUser }     from "@/interfaces/interface";
import { useAppDispatch }  from "@/hooks/reduxHooks";
import { removeRecipient } from "@/redux/slices/messageSlice";

function RecipientPersonCard({ item }: { item: IUser }) {
  const dispatch = useAppDispatch();

  const removeRecipientCb = useCallback(() => {
    dispatch(removeRecipient(item.uuid));
  }, [dispatch, item.uuid]);

  return (
    <div className="recipient-person-card">
      <UserUsername
        username={item.username}
        className="recipient-person-card-username"
      />
      <CloseIcon onClick={removeRecipientCb} />
    </div>
  );
};

export default RecipientPersonCard;
