import React  from "react";
import UserAvatar from "../UserComponents/UserAvatar";
import NewMessageCardDetails from "./NewMessageCardDetails";

type NewMessageCardProps = {
  user: any;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  recipients: any;
  setRecipients: React.Dispatch<React.SetStateAction<any>>;
};

function NewMessageCard({
  user,
  recipients,
  setRecipients,
  setSearch,
}: NewMessageCardProps) {
  const isRecipients = recipients.some(
    (item: any) => item.user_id === user.user_id
  );

  function newMessageHandler(person: any) {
    let newArr = [...recipients];
    newArr.push(person);
    setRecipients([...newArr]);
    setSearch("");
  }

  if (isRecipients) return null;

  return (
    <div
      className="new-message-card"
      onClick={() => newMessageHandler(user)}
    >
      <UserAvatar
        avatar_url={user?.avatar}
        className="new-message-card-avatar"
      />
      <NewMessageCardDetails user={user} />
    </div>
  );
}

export default NewMessageCard;
