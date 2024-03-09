import React from 'react'
import avatar from "../../assets/icons/avatar.png";

type NewMessageListsCardProps = {
  user: any;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  recipients: any;
  setRecipients: React.Dispatch<React.SetStateAction<any>>;
};

function NewMessageListsCard({ user, recipients, setRecipients, setSearch }: NewMessageListsCardProps) {
  const isRecipients = recipients.some((item: any) => item.user_id === user.user_id);

  function newMessageHandler(person: any) {
    let newArr = [...recipients];
    newArr.push(person);
    setRecipients([...newArr]);
    setSearch("");
  };

  if (isRecipients) return null;
  
  return (
    <div
      className="new-message__person"
      onClick={() => newMessageHandler(user)}
    >
      <div className="new-message__avatar">
        <img
          src={user.avatar_url ? user.avatar_url : avatar}
          alt=""
        />
      </div>
      <div className="new-message__user-details">
        <p>{user.username}</p>
        <p>
          {user?.first_name} {user?.last_name}
        </p>
      </div>
    </div>
  );
}

export default NewMessageListsCard
