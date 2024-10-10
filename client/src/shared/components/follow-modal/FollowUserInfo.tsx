export type FollowUserInfoProps = {
  username: string;
  firstName: string;
  lastName: string;
};

function FollowUserInfo({
  username,
  firstName,
  lastName,
}: FollowUserInfoProps) {
  return (
    <div>
      <p>{username}</p>
      <p>
        {firstName} {lastName}
      </p>
    </div>
  );
}

export default FollowUserInfo;
