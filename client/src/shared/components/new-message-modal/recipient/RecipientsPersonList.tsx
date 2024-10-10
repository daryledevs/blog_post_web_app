import React                from "react";
import { IUser }      from "@/interfaces/interface";
import { useAppSelector }   from "@/hooks/reduxHooks";
import RecipientPersonCard  from "./RecipientPersonCard";
import { selectMessage } from "@/redux/slices/messageSlice";

function RecipientsPersonList() {
  const message = useAppSelector(selectMessage);
  const recipients = message.recipients;

  return (
    <React.Fragment>
      {recipients?.map((user: IUser, index: number) => (
        <RecipientPersonCard
          key={index}
          item={user}
        />
      ))}
    </React.Fragment>
  );
}

export default RecipientsPersonList;
