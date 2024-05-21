type UserUsernameProps = {
  username: string | null;
  className?: string;
};

function UserUsername({ username, className }: UserUsernameProps) {
  return (
    <div className={className}>
      <p>{username}</p>
    </div>
  );
}

export default UserUsername
