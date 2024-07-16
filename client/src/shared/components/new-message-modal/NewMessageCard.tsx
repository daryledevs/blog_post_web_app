import {
  selectMessage,
  setRecipients,
  setSearch,
}                                         from "@/redux/slices/messageSlice";
import React, { useEffect }               from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { IEUserState }                    from "@/interfaces/interface";
import UserAvatar                         from "../user/UserAvatar";
import NewMessageCardDetails              from "./NewMessageCardDetails";

function NewMessageCard({ user }: { user: IEUserState }) {
  const dispatch = useAppDispatch();
  const message = useAppSelector(selectMessage);
  const recipients = message.recipients;

  const [isRecipient, setIsRecipient] = React.useState<boolean>(false);

  function newMessageHandler(person: IEUserState) {
    dispatch(setRecipients(person));
    dispatch(setSearch(""));
  }

  useEffect(() => {
    if (!recipients?.length) return;
    setIsRecipient(
      recipients.some(
        (recipient) => recipient.uuid === user.uuid
      )
    );
  }, [recipients]);

  if (isRecipient) return null;

  return (
    <div
      className="new-message-card"
      onClick={() => newMessageHandler(user)}
    >
      <UserAvatar
        avatar_url={user?.avatar_url}
        className="new-message-card-avatar"
      />
      <NewMessageCardDetails user={user} />
    </div>
  );
}

export default NewMessageCard;
