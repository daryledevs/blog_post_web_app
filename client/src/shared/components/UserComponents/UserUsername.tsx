type UserUsernameProps = {
  username: any;
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
