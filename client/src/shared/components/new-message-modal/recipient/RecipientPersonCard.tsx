import { useCallback }    from "react";
import UserUsername       from "../../user/UserUsername";
import CloseIcon          from "@/assets/icons/svg/close-icon-blue.svg?react";
import { IEUserState }    from "@/interfaces/interface";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setRecipients }  from "@/redux/slices/messageSlice";

function RecipientPersonCard({ item }: { item: IEUserState }) {
  const dispatch = useAppDispatch();

  const removeRecipient = useCallback(() => {
    dispatch(
      setRecipients((recipients: any) =>
        recipients.filter(
          (recipient: any) => recipient.user_id !== item.user_id
        )
      )
    );
  }, [dispatch, item.user_id]);

  return (
    <div className="recipient-person-card">
      <UserUsername
        username={item.username}
        className="recipient-person-card-username"
      />
      <CloseIcon onClick={removeRecipient} />
    </div>
  );
};

export default RecipientPersonCard;
