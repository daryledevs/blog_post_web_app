import CloseIcon from "../../assets/icons/close-icon.svg?react";

function RecipientPersonCard({ item, setRecipients }: any) {
  return (
    <div className="recipients__selected-person">
      <p>{item.username}</p>
      <CloseIcon
        onClick={() =>
          setRecipients((recipients: any) =>
            recipients.filter(
              (recipient: any) => recipient.user_id !== item.user_id
            )
          )
        }
      />
    </div>
  );
}

export default RecipientPersonCard;
