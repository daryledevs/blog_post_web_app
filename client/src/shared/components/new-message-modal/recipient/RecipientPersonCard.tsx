import CloseIcon    from "@/assets/icons/svg/close-icon-blue.svg?react";
import UserUsername from "../../UserComponents/UserUsername";

function RecipientPersonCard({ item, setRecipients }: any) {
  return (
    <div className="recipient-person-card">
      <UserUsername
        username={item.username}
        className="recipient-person-card-username"
      />
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
