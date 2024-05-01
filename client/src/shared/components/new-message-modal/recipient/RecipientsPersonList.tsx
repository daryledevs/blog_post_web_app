import React               from "react";
import RecipientPersonCard from "./RecipientPersonCard";

type RecipientsPersonListProps = {
  recipients: any;
  setRecipients: React.Dispatch<React.SetStateAction<any>>;
};

function RecipientsPersonList({
  recipients,
  setRecipients,
}: RecipientsPersonListProps) {
  return (
    <React.Fragment>
      {recipients.map((item: any, index: number) => (
        <RecipientPersonCard
          key={index}
          item={item}
          setRecipients={setRecipients}
        />
      ))}
    </React.Fragment>
  );
}

export default RecipientsPersonList;
