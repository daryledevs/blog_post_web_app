type UserFullNameProps = {
  firstName: string | null;
  lastName: string | null;
  className?: string;
};

function UserFullName({ firstName, lastName, className }: UserFullNameProps) {
  return (
    <div className={className}>
      <p>
        {firstName} {lastName}
      </p>
    </div>
  );
}

export default UserFullName;
