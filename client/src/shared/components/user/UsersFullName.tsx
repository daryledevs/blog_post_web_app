type UserFullNameProps = {
  first_name: string;
  last_name: string;
  className?: string;
};

function UserFullName({ first_name, last_name, className }: UserFullNameProps) {
  return (
    <div className={className}>
      <p>
        {first_name} {last_name}
      </p>
    </div>
  );
}

export default UserFullName;
