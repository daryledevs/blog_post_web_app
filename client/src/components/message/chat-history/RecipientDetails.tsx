type RecipientDetailsProps = {
  first_name: string;
  last_name: string;
};

function RecipientDetails({ first_name, last_name }: RecipientDetailsProps) {
  return (
    <div className="recipient-details">
      <p>
        {first_name} {last_name}
      </p>
    </div>
  );
}

export default RecipientDetails;
