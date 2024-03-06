import React from "react";

type FollowUserInfoProps = {
  username: string;
  first_name: string;
  last_name: string;
};

function FollowUserInfo({
  username,
  first_name,
  last_name,
}: FollowUserInfoProps) {
  return (
    <div>
      <p>{username}</p>
      <p>
        {first_name} {last_name}
      </p>
    </div>
  );
}

export default FollowUserInfo;
